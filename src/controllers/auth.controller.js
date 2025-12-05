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
    try {
        const { Email, Pass } = req.body;
      
        
        const userFound = await User.findByEmail(Email);
        
        if (!userFound) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }
        
   
        // Verificar contraseña
        const isMatch = await bcrypt.compare(Pass, userFound.Pass);
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }
        
        // Crear token
        const token = await createAccessToken({
            IdUs: userFound.IdUs,
            Rol: userFound.Rol
        });
        
        // Preparar respuesta
        const userResponse = {
            id: userFound.IdUs,
            username: userFound.NomUs, // ← Esto es importante
            email: userFound.Email,
            role: userFound.Rol, // ← Esto es importante
            Rol: userFound.Rol
        };
        
        
        res.json({
            token,
            user: userResponse // ← Asegúrate de que sea 'user'
        });
        
    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({ message: error.message });
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
    try {
        
        const userFound = await User.findById(req.user.IdUs); // o como obtengas el usuario
        
        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        console.log('🔍 Usuario encontrado en BD:', userFound);
        
        // Asegúrate de devolver el rol como 'role' (minúscula)
        const userResponse = {
            id: userFound.IdUs,
            username: userFound.NomUs,
            email: userFound.Email,
            role: userFound.Rol, // ← Esto es lo importante
            // También incluye Rol por compatibilidad
            Rol: userFound.Rol
        };
        
        console.log('✅ Token creado con payload:', {
    id: userFound.IdUs,
    IdUs: userFound.IdUs,
    role: userFound.Rol
});
        
        res.json(userResponse);
    } catch (error) {
        console.error('❌ Error en verifyToken:', error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// --- 5. GET USERS (PENDIENTE) ---
export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('❌ Error al obtener usuarios:', error);
        res.status(500).json({ message: "Error del servidor" });
    }
};
    //deleteuserequest pendiente
