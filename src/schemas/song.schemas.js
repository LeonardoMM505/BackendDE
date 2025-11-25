import { z } from 'zod';

// Esquema de Validación para CREAR/ACTUALIZAR una Canción
export const createSongSchema = z.object({
    NomMus: z.string({
        required_error: "El nombre de la canción es requerido"
    }).min(1),
    
    Album: z.string().optional(),
    
    AnPu: z.union([
        z.number().int().min(1900),
        z.string().regex(/^\d{4}$/, "El año debe ser un valor de 4 dígitos")
    ], {
        required_error: "El año de publicación es requerido"
    }),

    Art: z.string({
        required_error: "El artista es requerido"
    }).min(1),
    
    genero: z.string().optional(),
});

export const searchSongSchema = z.object({
    q: z.string().min(1, "El parámetro q no puede estar vacío")
}).strict();


export const updateSongSchema = z.object({
    NomMus: z.string().min(1).optional(),
    Album: z.string().min(1).optional(),
    Art: z.string().min(1).optional(),
    genero: z.string().min(1).optional(),
    AnPu: z
        .string()
        .regex(/^\d{4}$/)
        .optional(),
});