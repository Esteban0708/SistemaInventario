import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

// Respuesta esperada del bot
export type BotResponse =
  | { type: 'text'; text: string }
  | { type: 'navigate'; route: string; text: string };

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly API = 'https://generativelanguage.googleapis.com/v1';
  // Modelo estable para free tier
  private readonly modelName = 'gemini-1.5-flash-8b';

  constructor() {}

  async send(message: string): Promise<BotResponse> {
    const prompt = `
Usted es InvenBot, asistente virtual institucional.
CONTEXTO:
${environment.SITE_CONTEXT}

USUARIO:
${message}
`.trim();

    const url = `${this.API}/models/${this.modelName}:generateContent`;
    const body = {
      contents: [{ role: 'user', parts: [{ text: prompt }]}]
    };

    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': environment.GEMINI_API_KEY
        },
        body: JSON.stringify(body)
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        console.error('Gemini HTTP Error', resp.status, errText);
        return { type: 'text', text: 'Error al contactar el modelo. Verifique su API key y restricciones de dominio.' };
      }

      const json = await resp.json();
      const raw = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
      const jsonCandidate = raw.replace(/^```json/i, '').replace(/```$/i, '').trim();

      try {
        const parsed = JSON.parse(jsonCandidate);
        if (parsed?.type === 'navigate' && typeof parsed.route === 'string' && typeof parsed.text === 'string') {
          return parsed as BotResponse;
        }
        if (parsed?.type === 'text' && typeof parsed.text === 'string') {
          return parsed as BotResponse;
        }
      } catch {
      }
      return { type: 'text', text: 'Disculpe, ocurrió un problema procesando su solicitud.' };
    } catch (e) {
      console.error(e);
      return { type: 'text', text: 'Error de red al contactar el modelo.' };
    }
  }
}
