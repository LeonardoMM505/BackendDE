import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';

//REGISTRO DE USUARIO
export const register = async (req, res) => {
    const { NomUs, Email, Pass } = req.body;

    try {
        // 1. Validamos que el email no esté registrado
        const userFound = await User.findByEmail(Email);
        
        if (userFound) {
            return res.status(400)
                .json({ message: ['El email ya está en uso'] });
        }

        // 2. Crear el usuario 
        const newUserId = await User.create({ NomUs, Email, Pass });

        // 3.Buscar al usuario recién creado para obtener el Rol
        const userSaved = await User.findById(newUserId);

        // 4. Crear el token de acceso
        const token = await createAccessToken({ 
            id: userSaved.IdUs, 
            role: userSaved.Rol 
        });

        // 5. Guardar el token en una cookie
        res.cookie('token', token, {
            // httpOnly: true, //Descomentar en producción para más seguridad
            // secure: true,   //Descomentar en producción (HTTPS)
            sameSite: 'lax', // 'none' si el frontend está en otro dominio
        });

        // 6. Enviar la respuesta
        res.json({
            id: userSaved.IdUs,
            nombre: userSaved.NomUs,
            email: userSaved.Email,
            rol: userSaved.Rol,
        });

    } catch (error) {
        console.error("Error en el controlador de registro:", error);
        res.status(500).json({ message: ['Error interno del servidor'] });
    }
};


//LOGIN
export const login = async (req, res) => {
    const { Email, Pass } = req.body;

    try {
        // 1. Buscar al usuario por email
        const userFound = await User.findByEmail(Email);

        if (!userFound) {
            return res.status(400)
                .json({ message: ['Usuario o contraseña incorrectos'] });
        }

        // 2. Comparar la contraseña
        const isMatch = await bcrypt.compare(Pass, userFound.Pass);

        if (!isMatch) {
            return res.status(400)
                .json({ message: ['Usuario o contraseña incorrectos'] });
        }

        // 3. Crear el token
        const token = await createAccessToken({ 
            id: userFound.IdUs, 
            role: userFound.Rol 
        });

        // 4. Guardar el token en la cookie
        res.cookie('token', token, {
            sameSite: 'lax',
        });

        // 5. Enviar respuesta
        res.json({
            id: userFound.IdUs,
            nombre: userFound.NomUs,
            email: userFound.Email,
            rol: userFound.Rol,
        });

    } catch (error) {
        console.error("Error en el controlador de login:", error);
        res.status(500).json({ message: ['Error interno del servidor'] });
    }
};


//LOGOUT
export const logout = (req, res) => {
    res.clearCookie("token", {
        sameSite: "lax",
    });
    return res.status(200).json({ message: "Sesión cerrada exitosamente" });
};

export const profile = async (req, res) => {
    // El middleware authRequired ya buscó y adjuntó el usuario a req.user.
    
    // Si llega a esta línea, es porque req.user existe y es válido.
    
    return res.json({
       
        id: req.user.IdUs,
        username: req.user.NomUs,
        email: req.user.Email,
        role: req.user.Rol
    });
};

// --- 4. VERIFY TOKEN (VERIFICA SI EL TOKEN ES VÁLIDO AL CARGAR LA APP) ---
export const verifyToken = async (req, res) => {
    // Si el middleware authRequired no encontró al usuario, ya envió un 401/403.
    // Si llega hasta aquí, significa que req.user existe y es válido.

    if (!req.user) {
        // En teoría, authRequired ya lo habría enviado, pero es una buena verificación final.
        return res.status(401).json({ message: ['No autorizado'] });
    }

    // Devolvemos los datos del usuario adjuntos por el middleware
    return res.json({
        id: req.user.IdUs,
        username: req.user.NomUs,
        email: req.user.Email,
        role: req.user.Rol
    });


    //deleteuserequest pendiente
};