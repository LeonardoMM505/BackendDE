import playlist from '../models/playlist.models.js';
import Song from '../models/Song.models.js';


//playlist controller

// 1. crear playlist
export const createPlaylist = async (req, res) => {
    try {
        const { NomPlay, genero } = req.body;
        
        // OBTENER EL ID DEL USUARIO AUTENTICADO
        const IdUs = req.user.IdUs; 
       

        const newPlaylistData = {
            NomPlay,
            genero,
            IdUs,
          
        };

        const newPlaylistId = await playlist.create(newPlaylistData);
        const createdPlaylist = await playlist.findById(newPlaylistId);
        
        return res.status(201).json({
            message: ['Playlist creada exitosamente'],
            playlist: createdPlaylist
        });
    } catch (error) {
        console.error("Error detallado al crear playlist:", error);
        return res.status(500).json({
            message: ["Error interno del servidor al crear playlist."],
            error: error.message
        });
    }
};

// 2. Actualizar playlist
export const updatePlaylist = async (req, res) => {
    const playlistId = req.params.id;
    const updateData = req.body;
    
    try {
        
        const affectedRows = await playlist.update(playlistId, updateData);

        if (affectedRows === 0) {
            return res.status(404).json({ message: ["Playlist no encontrada."] });
        }

        const updatedPlaylist = await playlist.findById(playlistId);
        return res.status(200).json({
            message: ["Playlist actualizada exitosamente."],
            playlist: updatedPlaylist
        })
    } catch (error) {
        console .error("Error al actualizar playlist:", error);
    }
};

// 3. Borrar playlist
export const deletePlaylist = async (req, res) => {
    const playlistId = req.params.id;

    try {
        const affectedRows = await playlist.delete(playlistId);

        if (affectedRows === 0) {
            return res.status(404).json({ message: ["Playlist no encontrada."] });
        }
        return res.sendStatus(204);
    } catch (error) {
        console.error("Error al borrar playlist:", error);
        return res.status(500).json({ message: ["Error interno del servidor al borrar playlist."] });
    }
};

export const getPlaylists = async (req, res) => {
    console.log('🚀 getPlaylists ejecutándose (admin)');
    console.log('🔍 Usuario que hace la solicitud:', req.user);
    
    try {
        console.log('🔍 Llamando a playlist.findAll()');
        const playlists = await playlist.findAll();
        console.log('✅ Playlists encontradas:', playlists.length);
        
        return res.status(200).json(playlists);
    } catch (error) {
        console.error("❌ Error en getPlaylists:", error);
        console.error("❌ Stack trace:", error.stack);
        return res.status(500).json({ 
            message: ["Error interno del servidor al obtener playlists."],
            error: error.message // Solo en desarrollo
        });
    }
};

// 5. Obtener playlists por ID de usuario (cliente/admin)
export const getPlaylistsByUserId = async (req, res) => {
    const userId = req.params.userId;

    try {
        const playlists = await playlist.findByUserId(userId);
        return res.status(200).json(playlists);
    } catch (error) {
        console.error("Error al obtener playlists por ID de usuario:", error);    
        return res.status(500).json({ message: ["Error interno del servidor al obtener playlists del usuario."] });
    }
};

// 6. Busqueda avanzada  (admin)
export const searchPlaylists = async (req, res) => {
    try {
        const q = req.query.q;

        if (!q || q.trim() === "") {
            return res.status(400).json({ message: ["Parámetro de búsqueda requerido."] });
        }

        let playlistsByName = await playlist.findByName(q);
        let playlistsByGenre = await playlist.findByGenre(q);
        let getPlaylistsByUserId = await playlist.findByUserId(q);

        // unir sin duplicados
        let playlists = [...new Map(
            [...playlistsByName, ...playlistsByGenre, ...getPlaylistsByUserId].map(p => [p.IdPlay, p])
        ).values()];

        if (playlists.length === 0) {
            return res.status(404).json({ message: ["No se encontraron playlists con ese criterio."] });
        }

        return res.status(200).json(playlists);

    } catch (error) {
        console.error("Error en búsqueda avanzada:", error);
        return res.status(500).json({ message: ["Error interno al buscar playlists."] });
    }
};

// 7. Busqueda avanzada por usuario (cliente)
export const searchPlaylistsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const q = req.query.q;

        if (!q || q.trim() === "") {
            return res.status(400).json({ message: ["Parámetro q requerido."] });
        }

        const userPlaylists = await playlist.findByUserId(userId);

        const filtered = userPlaylists.filter(p =>
            p.NomPlay.toLowerCase().includes(q.toLowerCase()) ||
            (p.genero || "").toLowerCase().includes(q.toLowerCase())
        );

        if (filtered.length === 0) {
            return res.status(404).json({ message: ["No se encontraron playlists."] });
        }

        return res.status(200).json(filtered);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: ["Error en la búsqueda del usuario."] });
    }
};

// playlist_canciones controller (relación playlist-canciones)

// 1. Agregar cancion 
export const addSongToPlaylist = async (req, res) => {
    /*const playlistId = req.params.Id;
    const { songId } = req.body;

    try {
        await playlist.addSongToPlaylist(playlistId, songId);
        return res.status(201).json({ message: ["Canción agregada a la playlist exitosamente."] });*/
    const { playlistId, songId } = req.body; // ← Ahora viene del body

    try {
        await playlist.addSongToPlaylist(playlistId, songId);
        return res.status(201).json({ 
            message: ["Canción agregada a la playlist exitosamente."] 
        });

    } catch (error) {
        if (error.message === "La canción ya está dentro de la playlist") {
            return res.status(409).json({ message: [error.message] });
        }

        if (error.message === "La playlist no existe" || error.message === "La canción no existe") {
            return res.status(404).json({ message: [error.message] });
        }

        console.error("Error al agregar canción a la playlist:", error);
        return res.status(500).json({ message: ["Error interno del servidor al agregar canción a la playlist."] });
    }
};

// 2. Quitar cancion 
export const removeSongFromPlaylist = async (req, res) => {
    const playlistId = parseInt(req.params.id);        // ← De la URL
    const songId = parseInt(req.params.songId);        // ← De la URL

    try {
        // Validar que los IDs sean números válidos
        if (isNaN(playlistId) || isNaN(songId)) {
            return res.status(400).json({ 
                message: ["Los IDs deben ser números válidos"] 
            });
        }

        const affectedRows = await playlist.removeSong(playlistId, songId);

        if (affectedRows === 0) {
            return res.status(404).json({ 
                message: ["La canción no se encontró en la playlist."] 
            });
        }
        
        return res.status(200).json({ 
            message: ["Canción eliminada de la playlist exitosamente."] 
        });
    } catch (error) {
        console.error("Error al eliminar canción de la playlist:", error);
        return res.status(500).json({ 
            message: ["Error interno del servidor al eliminar canción de la playlist."] 
        });
    }
};

// 3. Obtener canciones de una playlist - VERSIÓN CORREGIDA
export const getSongsFromPlaylist = async (req, res) => {
    const playlistId = parseInt(req.params.id);

    try {
        // Validar que el ID sea un número válido
        if (isNaN(playlistId)) {
            return res.status(400).json({ 
                message: ["El ID de la playlist debe ser un número válido"] 
            });
        }

        const songs = await playlist.getSongsInPlaylist(playlistId);

        // ¡CAMBIAR ESTO! No devolver 404 si está vacía
        // if (songs.length === 0) {
        //     return res.status(404).json({ 
        //         message: ["No se encontraron canciones en esta playlist."] 
        //     });
        // }
        
        // En su lugar, devolver array vacío
        return res.status(200).json(songs);

    } catch (error) {
        console.error("Error al obtener canciones de la playlist:", error);
        return res.status(500).json({ 
            message: ["Error interno del servidor al obtener canciones de la playlist."] 
        });
    }
};


// 4. Obtener playlist por ID - VERSIÓN CORREGIDA
export const getPlaylistById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔍 Controller getPlaylistById - ID recibido:', id);
        
        // Validar que el ID sea un número
        const playlistId = parseInt(id);
        if (isNaN(playlistId)) {
            console.error('❌ ID no es un número:', id);
            return res.status(400).json({ 
                message: 'El ID de la playlist debe ser un número válido'
            });
        }
        
        // Obtener la playlist desde la base de datos
        // CAMBIA EL NOMBRE DE LA VARIABLE:
        const playlistData = await playlist.findById(playlistId); // Cambié a playlistData
        
        console.log('🔍 Playlist encontrada:', playlistData);
        
        if (!playlistData) {
            return res.status(404).json({ message: 'Playlist no encontrada' });
        }
        
        // Normalizar el ID para que el frontend reciba IdPlay (no idPlay)
        const normalizedPlaylist = {
            IdPlay: playlistData.idPlay || playlistData.IdPlay, // Asegura IdPlay
            NomPlay: playlistData.NomPlay,
            genero: playlistData.genero,
            IdUs: playlistData.IdUs
       
        };
        
        res.json(normalizedPlaylist);
    } catch (error) {
        console.error('Error al obtener playlist:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};