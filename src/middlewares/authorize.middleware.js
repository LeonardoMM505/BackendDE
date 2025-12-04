// authorize.middleware.js
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    console.log('🔍 authorize middleware ejecutándose');
    console.log('🔍 Ruta:', req.path);
    console.log('🔍 req.user:', req.user);
    console.log('🔍 req.user.Rol:', req.user?.Rol);
    console.log('🔍 req.user.role:', req.user?.role);
    console.log('🔍 Roles permitidos:', allowedRoles);
    
    // Verificar que el usuario existe
    if (!req.user) {
      console.error('❌ authorize - No hay usuario en la request');
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    
    // Obtener el rol del usuario (manejar diferentes propiedades)
    const userRole = req.user.Rol || req.user.role;
    console.log('🔍 authorize - Rol del usuario:', userRole);
    
    // Verificar si el rol está permitido
    if (!userRole || !allowedRoles.includes(userRole)) {
      console.error('❌ authorize - Rol no permitido:', userRole);
      return res.status(403).json({ 
        message: `Acceso denegado. Se requiere uno de estos roles: ${allowedRoles.join(', ')}` 
      });
    }
    
    console.log('✅ authorize - Acceso permitido para rol:', userRole);
    next();
  };
};