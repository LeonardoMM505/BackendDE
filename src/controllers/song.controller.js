import Song from '../models/Song.models.js';
import cloudinary from '../config/cloudinary.config.js';

// 1. CREAR CANCIÓN (ADMIN) 
export const createSong = async (req, res) => {
    try {
        const { NomMus, Album, AnPu, Art, genero } = req.body; 
        const UrlPort = req.file?.path; 

        if (!UrlPort) {
            return res.status(400).json({ message: ["La imagen de la portada es requerida."] });
        }

        // Convertir AnPu a número
        const AnPuNumber = parseInt(AnPu, 10);
        if (isNaN(AnPuNumber)) {
            return res.status(400).json({ message: "El año de publicación debe ser un número válido." });
        }

        const newSongData = { 
            NomMus, 
            Album, 
            UrlPort, 
            AnPu: AnPuNumber, 
            Art, 
            genero 
        };
        
        const newSongId = await Song.create(newSongData);
        const createdSong = await Song.findById(newSongId); 

        return res.status(201).json({ 
            message: ['Canción creada exitosamente'],
            song: createdSong 
        });
    } catch (error) {
        console.error("Error detallado al crear canción:", error);
        return res.status(500).json({ 
            message: ["Error interno del servidor al crear canción."],
            error: error.message 
        });
    }
};

// --- 2. OBTENER TODAS LAS CANCIONES (CLIENTE/ADMIN) ---
export const getSongs = async (req, res) => {
    try {
        // Esta ruta es pública, solo obtiene todas las canciones
        const songs = await Song.findAll();
        return res.status(200).json(songs);
    } catch (error) {
        console.error("Error al obtener canciones:", error);
        return res.status(500).json({ message: ["Error interno del servidor al obtener canciones."] });
    }
};

// --- 3. OBTENER UNA CANCIÓN POR ID (CLIENTE/ADMIN) ---
export const getSong = async (req, res) => {
    const songId = req.params.id;

    try {
        const song = await Song.findById(songId);

        if (!song) {
            return res.status(404).json({ message: ["Canción no encontrada."] });
        }
        
        return res.status(200).json(song);
    } catch (error) {
        console.error("Error al obtener canción por ID:", error);
        return res.status(500).json({ message: ["Error interno del servidor."] });
    }
};


// --- 4. ACTUALIZAR CANCIÓN (ADMIN) ---
export const updateSong = async (req, res) => {
    const songId = req.params.id;
    const updatedData = req.body; // Datos de texto (NomMus, Album, etc.)

    try {
        // 1. Verificar si se subió un archivo nuevo
        if (req.file && req.file.path) {
            updatedData.UrlPort = req.file.path; // Asigna la nueva URL

            // --- Lógica para borrar la imagen antigua ---
            // 1.1 Buscar la canción que vamos a actualizar
            const songToUpdate = await Song.findById(songId);

            // 1.2 Verificar si tenía una URL válida de Cloudinary
            if (songToUpdate && songToUpdate.UrlPort && songToUpdate.UrlPort.includes('cloudinary.com')) {
                try {
                    // 1.3  LÓGICA DE EXTRACCIÓN CORRECTA 
                    // Extraer el public_id (CON LA RUTA DE LA CARPETA)
                    const urlParts = songToUpdate.UrlPort.split('/');
                    
                    // Encuentra 'disco-elysium' y toma todo lo que sigue
                    const publicIdWithExtension = urlParts.slice(urlParts.indexOf('disco-elysium')).join('/');
                    
                    // Quita la extensión (ej. .jpg)
                    const oldPublicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
                    // Esto nos da: "disco-elysium/portadas/mi_imagen"

                    if (oldPublicId) {
                        // Borramos la imagen antigua de Cloudinary
                        await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'image' });
                    }
                } catch (imgError) {
                    console.error("Error al borrar la imagen antigua de Cloudinary:", imgError);
                    // No detenemos el proceso, solo lo advertimos.
                }
            }
        }
        // --- Fin de la lógica de borrado ---

        // 2. Actualizar la BD con los nuevos datos (incluida la nueva URL si existe)
        const affectedRows = await Song.update(songId, updatedData);

        if (affectedRows === 0) {
            return res.status(404).json({ message: ["Canción no encontrada para actualizar."] });
        }

        const updatedSong = await Song.findById(songId);
        return res.status(200).json({ 
            message: ['Canción actualizada exitosamente'],
            song: updatedSong
        });
    } catch (error) {
        console.error("Error al actualizar canción:", error);
        return res.status(500).json({ message: ["Error interno del servidor al actualizar canción."] });
    }
};


export const deleteSong = async (req, res) => {
    const songId = req.params.id;

    try {
        // 1. Buscar la canción
        const songToDelete = await Song.findById(songId);
        if (!songToDelete) {
            return res.status(404).json({ message: ["Canción no encontrada."] });
        }

        // 2. Eliminar de Cloudinary con TIMEOUT
        if (songToDelete.UrlPort && songToDelete.UrlPort.includes('cloudinary.com')) {
            try {
                const urlParts = songToDelete.UrlPort.split('/');
                const publicIdWithExtension = urlParts.slice(urlParts.indexOf('disco-elysium')).join('/');
                const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
                
                if (publicId) {
                    // Timeout de 5 segundos para Cloudinary
                    const cloudinaryPromise = cloudinary.uploader.destroy(publicId, { 
                        resource_type: 'image' 
                    });
                    
                    // Race entre Cloudinary y timeout
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('Cloudinary timeout')), 5000);
                    });
                    
                    await Promise.race([cloudinaryPromise, timeoutPromise]);
                    
                }
            } catch (imgError) {
                console.error("Error (no crítico) al eliminar de Cloudinary:", imgError.message);
                // CONTINUAMOS aunque falle Cloudinary
            }
        }

        // 3. Eliminar de la BD (esto siempre debe ejecutarse)
        const affectedRows = await Song.delete(songId);
        
        if (affectedRows === 0) {
            return res.status(404).json({ message: ["Canción no encontrada en la BD."] });
        }
        
        return res.sendStatus(204);

    } catch (error) {
        console.error("Error al eliminar canción:", error);
        return res.status(500).json({ 
            message: ["Error interno del servidor al eliminar canción."]
        });
    }
};

// --- 6. BÚSQUEDA AVANZADA (CLIENTE/ADMIN) ---
export const searchSongs = async (req, res) => {
    try {
        const q = req.query.q;

        if (!q || q.trim() === "") {
            return res.status(400).json({ message: "Debes proporcionar un parámetro de búsqueda (q)." });
        }

        let songs = [];

        // Si q es un número, buscar también por año
        const isNumber = !isNaN(q);

        songs = await Song.universalSearch(q, isNumber);

        if (songs.length === 0) {
            return res.status(404).json({ message: "No se encontraron canciones que coincidan." });
        }

        return res.status(200).json(songs);

    } catch (error) {
        console.error("Error en búsqueda universal:", error);
        return res.status(500).json({ error: "Error interno al realizar la búsqueda" });
    }
};