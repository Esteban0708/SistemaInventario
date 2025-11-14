export type Faq = { q: string; a: string; keywords: string[] };

export const FAQS: Faq[] = [
  { q: '¿Cómo inicio sesión?', a: '...', keywords: ['login','iniciar','sesión','clave','contraseña','acceso'] },
  { q: '¿Cómo registro un nuevo proyecto?', a: '...', keywords: ['proyecto','registrar','crear','nuevo','proyectos','alta'] },
  { q: '¿Qué roles existen?', a: '...', keywords: ['roles','permisos','perfil','acceso','autorización'] },
  { q: '¿Cómo contacto soporte?', a: '...', keywords: ['soporte','ayuda','contacto','asistencia','tickets'] }
];
