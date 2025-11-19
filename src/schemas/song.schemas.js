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
    // La búsqueda puede ser por uno o más de estos campos, todos opcionales.
    NomMus: z.string().optional(),
    Album: z.string().optional(),
    Art: z.string().optional(),
    genero: z.string().optional(),
    
    // El año debe ser un string que se puede convertir a número
    AnPu: z.string().regex(/^\d{4}$/, "El año debe ser un valor de 4 dígitos").optional(),
    
    // Agregamos un campo de término genérico, si se desea buscar por cualquier cosa
    term: z.string().optional(),

}).strict().partial(); // Usamos .partial() para que todos los campos sean opcionales