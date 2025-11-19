/**
 * Middleware para restringir el acceso basado en el rol del usuario.
 * @param {string[]} allowedRoles - Array de roles permitidos (ej. ['admin']).
 */
export const authorize = (allowedRoles) => (req, res, next) => {
    // 1. Verificar si el usuario ha sido adjuntado por authRequired
    if (!req.user || !req.user.Rol) {
        // Este error solo debería ocurrir si el middleware authRequired falla.
        return res.status(403).json({ message: ["Acceso denegado: El rol no está disponible."] });
    }

    const userRole = req.user.Rol;

    // 2. Verificar si el rol del usuario está en la lista de roles permitidos
    if (!allowedRoles.includes(userRole)) {
        // Si el usuario es 'cliente' y la ruta requiere 'admin'
        return res.status(403).json({ message: ["Acceso denegado: Rol insuficiente."] });
    }

    // 3. Si el rol es permitido, continuar
    next();
};