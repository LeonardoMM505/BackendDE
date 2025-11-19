import jwt from 'jsonwebtoken';
import User from '../models/user.models.js'; // Necesario para buscar al usuario

// Lee la clave secreta directamente del .env
const TOKEN_SECRET = process.env.JWT_SECRET; 

/**
 * Middleware para requerir autenticación (verificar el token JWT)
 * Verifica el token en cookies o en el header Authorization.
 */
export const authRequired = async (req, res, next) => {
    // 1. Obtener token de cookies o header (Esta lógica es perfecta)
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ 
            message: ["Acceso denegado: Token no proporcionado"] 
        });
    }

    // 2. Verificar la validez del token
    jwt.verify(token, TOKEN_SECRET, async (error, userPayload) => {
        if (error) {
            console.error("Error al verificar token:", error.message);
            return res.status(403).json({ 
                message: ["Token inválido o expirado"] 
            });
        }

        // 3. Buscar al usuario en la BD para asegurar que existe (Security Check)
        // Usamos el ID del payload del token (userPayload.id)
        const userFound = await User.findById(userPayload.id); 

        // Si el usuario no se encuentra (fue eliminado, etc.)
        if (!userFound) {
            return res.status(401).json({ message: ["Usuario no encontrado"] });
        }
        
        // 4. Adjuntar datos del usuario a la request
        // Usamos los datos FRESCOS de la BD, no solo los del token
        req.user = userFound; 

        next();
    });
};