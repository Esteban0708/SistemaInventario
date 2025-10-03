export type Faq = { q: string; a: string; keywords: string[] };

export const FAQS: Faq[] = [
  {
    q: '¿Cómo inicio sesión?',
    a: 'Para iniciar sesión, diríjase al botón “Iniciar sesión” en la esquina superior derecha, ingrese su correo registrado y su contraseña. Si presenta inconvenientes, por favor restablezca la contraseña desde la misma pantalla.',
    keywords: ['login', 'iniciar', 'sesión', 'clave', 'contraseña', 'acceso']
  },
  {
    q: '¿Cómo registro un nuevo proyecto?',
    a: 'Para registrar un nuevo proyecto, abra el módulo “Proyectos”, seleccione “Crear proyecto” y complete la información requerida. Asegúrese de guardar y verificar el estado en la sección de seguimiento.',
    keywords: ['proyecto', 'registrar', 'crear', 'nuevo', 'proyectos', 'alta']
  },
  {
    q: '¿Qué roles existen?',
    a: 'El sistema contempla roles diferenciados (por ejemplo, administrador, evaluador, participante y visitante), cada uno con permisos específicos. Si requiere privilegios adicionales, solicite su actualización al administrador.',
    keywords: ['roles', 'permisos', 'perfil', 'acceso', 'autorización']
  },
  {
    q: '¿Cómo contacto soporte?',
    a: 'Si requiere asistencia, por favor comuníquese con nuestra mesa de ayuda a través del formulario de soporte en el menú principal o escriba a soporte@tudominio.com indicando su usuario y una breve descripción del caso.',
    keywords: ['soporte', 'ayuda', 'contacto', 'asistencia', 'tickets']
  }
];
