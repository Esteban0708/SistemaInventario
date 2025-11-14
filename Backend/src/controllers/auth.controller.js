

export const login = async (req, res) => {
    const { email, password } = req.body;

    const {data: usuario} = await supabase
    .from("usuarios")
    .select("*, roles(nombre")
    .eq("email", email)
    .single();

    if(!usuario) 
        return res.status(401).json({message: "Credenciales invalidas"});

    const validPass = await bcrypt.compare(password, usuario.password);

    if(!validPass)
        return res.status(401).json({message: "Credenciales invalidas"});

    const token = jwt.sign(
        {
            idUsuario: usuario.idUsuario,
            idRol: usuario.idRol,
            idTienda: usuario.idTienda
        },
        process.env.JWT_SECRET,
        {expiresIn: "8h"}
    );
    req.json({
        message: "Login exitoso",
        token,
        rol: usuario.roles.nombre
    })
}

export const registro = async (req, res) => {
  const { nombreTienda, nombreUsuario, email, password, idPlan } = req.body;

  const { data: tienda } = await supabase
    .from("tiendas")
    .insert([{ nombre: nombreTienda, idPlan }])
    .select()
    .single();

  const hashed = await bcrypt.hash(password, 10);

  const { data: rolAdmin } = await supabase
    .from("roles")
    .select("idRol")
    .eq("nombre", "ADMIN")
    .single();

  const { error } = await supabase
    .from("usuarios")
    .insert([{
      nombre: nombreUsuario,
      email,
      password: hashed,
      idTienda: tienda.idTienda,
      idRol: rolAdmin.idRol
    }]);

  if (error) return res.status(400).json(error);

  res.json({ message: "Registro completado" });
};
