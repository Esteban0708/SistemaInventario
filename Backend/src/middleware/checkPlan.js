import { supabase } from "../config/supabase";

export const checkPlan = (permisoPlan) => {
    return async (req, res, next) => {
        const {idTienda} = req.user;

        const {data: tienda} = await supabase
        .from("tiendas")
        .select("idPlan")
        .eq("idTienda", idTienda)
        .single();

        const {data: permiso} = await supabase
        .from("plan_permisos")
        .select("valor, permisos(codigo)")
        .eq("idPlan", tienda.idPlan)
        .eq("permisos.codigo", permisoPlan)
        .single();

        if(!permiso || !permiso.valor){
            return res.status(403).json({message: "El plan de tu tienda no permite realizar esta acción"});
        }
        req.planPermisoValor = permiso.valor;
        next();
    }
}
