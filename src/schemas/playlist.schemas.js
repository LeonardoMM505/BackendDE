import { z } from "zod";

//playlist

// Esquema de Validación para crear una Playlist
export const createPlaylistSchema = z.object({
    NomPlay: z.union([
        z.string({
            required_error: "El nombre de la playlist es requerido"
        }).min(1),
        z.array(z.string()).transform(arr => arr[0]) // Para form-data array
    ]).transform(val => typeof val === 'string' ? val : val[0]),
    
    genero: z.union([
        z.string().min(1).optional(),
        z.array(z.string()).optional()
    ]).transform(val => val && Array.isArray(val) ? val[0] : val).optional(),
});

//esquema de validación para buscar playlist
export const searchPlaylistSchema = z.object({
    q: z.string().min(1, "El parámetro q no puede estar vacío")
}).strict();

// Esquema de Validación para ACTUALIZAR una Playlist
export const updatePlaylistSchema = z.object({
    NomPlay: z.string().min(1, "El nombre no puede estar vacío").optional(),
    genero: z.string().min(1, "El género no puede estar vacío").optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "Debes proporcionar al menos un campo para actualizar."
    }
);

//playlist_canciones

// Esquema de Validación para AGREGAR una Canción a una Playlist
/*export const addSongToPlaylistSchema = z.object({
    playlistId: z.number({
        required_error: "La playlist es requerida"
    }).int().positive(),
    songId: z.number({
        required_error: "La canción es requerida"
    }).int().positive(),
});*/
export const addSongToPlaylistSchema = z.object({
    playlistId: z.number({
        required_error: "La playlist es requerida"
    }).int().positive(),
    songId: z.number({
        required_error: "La canción es requerida"  
    }).int().positive(),
});

// Esquema de Validación para REMOVER una Canción de una Playlist
export const removeSongFromPlaylistSchema = z.object({
    // Schema vacío porque los datos vienen de los parámetros de la URL
}).strict();