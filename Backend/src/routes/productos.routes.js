router.post("/",
  auth,
  checkPlan("LIMIT_PRODUCTOS"), 
  checkRol("CREAR_PRODUCTO"),   
  crearProducto
);
