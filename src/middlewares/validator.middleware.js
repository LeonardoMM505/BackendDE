/**
 * Middleware que valida el body (req.body) 
 * @param {object} schema - El esquema de Zod contra el cual validar.
 */
export const validateSchema = (schema) => async (req, res, next) => {
    try {
        // 1. Validar el req.body usando el esquema
        await schema.parseAsync(req.body);
        
        // 2. Si es válido, continuamos al controlador
        next(); 

    } catch (error) {
        // 3. Si no es válido, Zod lanza un error.
        
        const errorMessages = error.errors.map(err => err.message);
        
        return res.status(400).json({ 
            message: "Error de validación",
            errors: errorMessages 
        });
    }
};