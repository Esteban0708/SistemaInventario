

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