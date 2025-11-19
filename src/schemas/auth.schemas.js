import {z} from 'zod';

export const registerSchema = z.object({
    NomUs: z.string({
        required_error: "El nombre de usuario es requerido",
    })
    .min(3, {
        message: "El nombre de usuario debe tener al menos 3 caracteres",
    })
    .max(100), 

    Email: z.string({
        required_error: "El email es requerido",
    })
    .email({
        message: "Email no válido",
    })
    .max(100),

    Pass: z.string({
        required_error: "La contraseña es requerida",
    })
    .min(6, {
        message: "La contraseña debe tener al menos 6 caracteres",
    })
    .max(255), 
});


// Este es el esquema de validación para el LOGIN
export const loginSchema = z.object({
    Email: z.string({
        required_error: "El email es requerido",
    }).email({
        message: "Email no válido",
    }),

    Pass: z.string({
        required_error: "La contraseña es requerida",
    }).min(6, {
        message: "La contraseña debe tener al menos 6 caracteres",
    }),
});
