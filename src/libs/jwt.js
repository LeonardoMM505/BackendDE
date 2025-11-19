
import jwt from 'jsonwebtoken';

/**
 * @description Crea un token de acceso (JWT) para un usuario.
 * @param {object} payload - Los datos del usuario a guardar en el token.
 * Debe ser un objeto con { id, role }
 */
export const createAccessToken = (payload) => {
    return new Promise((resolve, reject) => {
        // Firmamos el token con los datos clave del usuario y el secreto del .env
        jwt.sign(
            payload, // El payload que guardaremos
            process.env.JWT_SECRET, // La clave secreta del .env
            {
                expiresIn: '1d', // El token expira en 1 día
            },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
};