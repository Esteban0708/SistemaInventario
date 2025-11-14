// src/app/service/chat.service.ts
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';

export type BotResponse =
  | { type: 'text'; text: string }
  | { type: 'navigate'; route: string; text: string }
  | { type: 'error'; text: string };

type ApiVersion = 'v1beta' | 'v1';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly HOST = 'https://generativelanguage.googleapis.com';
  private apiVersion: ApiVersion | null = null;
  private modelName: string | null = null;

  // Fallbacks por si listados fallan
  private readonly FALLBACK_MODELS = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-001',
    'gemini-1.5-pro-001',
    'gemini-pro',           // legacy
    'gemini-1.0-pro'        // legacy
  ];

  async send(message: string): Promise<BotResponse> {
    if (!environment.GEMINI_API_KEY) {
      return { type: 'error', text: 'Falta configurar la API key.' };
    }

    try {
      // 1) Resolver versión de API + modelo por listado
      if (!this.apiVersion || !this.modelName) {
        await this.resolveApiAndModel();
      }

      const prompt = `
Usted es InvenBot, asistente virtual institucional.
CONTEXTO:
${environment.SITE_CONTEXT}

USUARIO:
${message}
`.trim();

      const url = `${this.HOST}/${this.apiVersion}/models/${this.modelName}:generateContent?key=${environment.GEMINI_API_KEY}`;
      const body = { contents: [{ role: 'user', parts: [{ text: prompt }]}] };

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!resp.ok) {
        const err = await safeText(resp);
        console.error('GenerateContent error', resp.status, err);

        // Si fue 404, intenta fallbacks directos
        if (resp.status === 404) {
          const ok = await this.tryFallbackModels();
          if (ok) {
            return this.send(message); // reintenta con el fallback resuelto
          }
        }
        return { type: 'error', text: 'No fue posible procesar la solicitud (API).' };
      }

      const json = await resp.json();
      const raw = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
      const finish = json?.candidates?.[0]?.finishReason;

      if (finish && finish !== 'STOP') {
        return { type: 'error', text: 'La respuesta fue bloqueada por políticas del modelo. Intente reformular.' };
      }

      const cleaned = stripFence(raw);
      try {
        const parsed = JSON.parse(cleaned);
        if (parsed?.type === 'navigate' && typeof parsed.route === 'string' && typeof parsed.text === 'string') {
          return parsed;
        }
        if (parsed?.type === 'text' && typeof parsed.text === 'string') {
          return parsed;
        }
      } catch (e) {
        console.warn('No se pudo parsear JSON del modelo', e, { raw });
      }
      return { type: 'error', text: 'No se pudo entender la respuesta del modelo.' };
    } catch (e) {
      console.error('send() fatal', e);
      return { type: 'error', text: 'Error de red o tiempo de espera excedido.' };
    }
  }

  // ---------------- helpers ----------------

  private async resolveApiAndModel(): Promise<void> {
    // Intenta primero v1beta
    let versionTried: ApiVersion[] = ['v1beta', 'v1'];
    for (const ver of versionTried) {
      const model = await this.pickModelFromList(ver);
      if (model) {
        this.apiVersion = ver;
        this.modelName = model;
        return;
      }
    }
    // Si no hubo suerte, intenta fallbacks directos con v1beta y luego v1
    for (const ver of versionTried) {
      for (const candidate of this.FALLBACK_MODELS) {
        const ok = await this.pingModel(ver, candidate);
        if (ok) {
          this.apiVersion = ver;
          this.modelName = candidate;
          return;
        }
      }
    }
    // Si llegamos aquí, lanzamos error claro
    throw new Error('No hay modelos disponibles para esta API key en v1 ni v1beta.');
  }

  private async pickModelFromList(ver: ApiVersion): Promise<string | null> {
    const url = `${this.HOST}/${ver}/models?key=${environment.GEMINI_API_KEY}`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        console.warn(`ListModels ${ver} => ${resp.status}`, await safeText(resp));
        return null;
      }
      const data = await resp.json();
      const models: any[] = data?.models ?? data?.model ?? [];
      if (!Array.isArray(models) || models.length === 0) return null;

      // Prioriza 1.5, que soporte generateContent
      const preferred = models
        .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
        .sort((a, b) => (b.displayName || '').localeCompare(a.displayName || '')); // heurística tonta de orden

      const pick =
        preferred.find(m => `${m.name}`.includes('1.5')) ||
        preferred[0];

      return pick ? pick.name : null; // ← IMPORTANTE: usar "name" EXACTO que lista el API
    } catch (e) {
      console.warn(`ListModels ${ver} error`, e);
      return null;
    }
  }

  private async pingModel(ver: ApiVersion, model: string): Promise<boolean> {
    const url = `${this.HOST}/${ver}/models/${model}:generateContent?key=${environment.GEMINI_API_KEY}`;
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'ok' }]}] })
      });
      if (!resp.ok) {
        console.warn(`Ping ${ver}/${model} => ${resp.status}`, await safeText(resp));
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  private async tryFallbackModels(): Promise<boolean> {
    // Prueba fallbacks con la versión ya elegida; si no había, prueba ambas
    const versions: ApiVersion[] = this.apiVersion ? [this.apiVersion] as ApiVersion[] : ['v1beta', 'v1'];
    for (const ver of versions) {
      for (const candidate of this.FALLBACK_MODELS) {
        const ok = await this.pingModel(ver, candidate);
        if (ok) {
          this.apiVersion = ver;
          this.modelName = candidate;
          return true;
        }
      }
    }
    return false;
    }
}

// utilidades
function stripFence(s: string): string {
  return s.replace(/^```[\w-]*\s*/i, '').replace(/```$/i, '').trim();
}
async function safeText(resp: Response): Promise<string> {
  try { return await resp.text(); } catch { return ''; }
}
