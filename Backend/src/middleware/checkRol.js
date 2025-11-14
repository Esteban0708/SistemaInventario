import { supabase } from "../config/supabase.js";

export const checkRol = (permisoNecesario) => {
    return async (req, res, next) => {
        const { idRol } = req.user;

        const { data: rol, error } = await supabase
            .from("rol_permisos")
            .select(`
                permisos(codigo)
            `)
            .eq("idRol", idRol);

        const tienePermiso = permisos.some(
            p => p.permisos.codigo === permisoNecesario
        );
        if (!tienePermiso)
            return res.status(403).json({ message: "No tienes permiso para realizar esta acción" });

        next();
    }
}