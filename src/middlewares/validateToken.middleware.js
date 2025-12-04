import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

// CORREGIR: La constante debe estar definida
const TOKEN_SECRET = process.env.JWT_SECRET;  // ← ¡ESTO ES IMPORTANTE!

export const authRequired = async (req, res, next) => {
   
    
    // Verificar que TOKEN_SECRET esté definido
    if (!TOKEN_SECRET) {
        console.error('❌ authRequired - TOKEN_SECRET no está definido');
        return res.status(500).json({ 
            message: ["Error de configuración del servidor"] 
        });
    }
    
    // 1. Obtener token de cookies o header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; 
    
   
   
    if (!token) {
        console.error('❌ authRequired - No hay token');
        return res.status(401).json({ 
            message: ["Acceso denegado: Token no proporcionado"] 
        });
    }

    // 2. Verificar la validez del token
    jwt.verify(token, TOKEN_SECRET, async (error, userPayload) => {
        if (error) {
            console.error("❌ Error al verificar token:", error.message);
            return res.status(403).json({ 
                message: ["Token inválido o expirado"] 
            });
        }

   
        
        // 3. Obtener el ID del usuario - CORREGIDO: manejar todos los casos
        const userId = userPayload.IdUs || userPayload.id || userPayload.userId || userPayload.Id;

        
        if (!userId || userId === undefined || userId === null) {
            console.error('❌ authRequired - No se pudo extraer ID del token. Payload:', userPayload);
            return res.status(401).json({ 
                message: ["Token inválido: sin ID de usuario"] 
            });
        }
        
        // Asegurar que userId sea un número
        const userIdNum = Number(userId);
        if (isNaN(userIdNum)) {
            console.error('❌ authRequired - ID de usuario no es un número:', userId);
            return res.status(401).json({ 
                message: ["Token inválido: ID de usuario no válido"] 
            });
        }
        
        
        // 4. Buscar al usuario en la BD para asegurar que existe
        try {

            const userFound = await User.findById(userIdNum); 
         
            
            if (!userFound) {
                console.error('❌ authRequired - Usuario no encontrado en BD');
                return res.status(401).json({ message: ["Usuario no encontrado"] });
            }
            
            // 5. Adjuntar datos del usuario a la request
            req.user = userFound; 
         
            
            // También adjuntar el payload del token para compatibilidad
            req.tokenPayload = userPayload;

            next();
        } catch (dbError) {
            console.error('❌ authRequired - Error en base de datos:', dbError);
            return res.status(500).json({ 
                message: ["Error interno del servidor"],
                error: dbError.message 
            });
        }
    });
};