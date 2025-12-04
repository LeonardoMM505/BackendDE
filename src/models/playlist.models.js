import pool from "../config/db.config.js";

class Playlist {
    
    //playlist

    /**
     * @description Crea una nueva playlist en la base de datos
     * @param {object} newPlaylist - Objeto con los datos de la playlist {NomPlay, genero, IdUs}
     * @returns {Promise<number>} - El ID de la playlist insertada
     */
    static async create(newPlaylist) {
        try {
            const sql = 'INSERT INTO playlists (NomPlay, genero, IdUs) VALUES (?, ?, ?)';
            
            const [result] = await pool.execute(sql, [
                newPlaylist.NomPlay,
                newPlaylist.genero,
                newPlaylist.IdUs
            ]);

            return result.insertId;
        } catch (error) {
            console.error("Error al crear la playlist:", error);
            throw error;
        }

    }

    /**
     * @description Actualiza una playlist existente
     * @param {number} id - El ID de la playlist a actualizar
     * @param {object} updatedPlaylist - Datos a actualizar
     * @returns {Promise<number>} - Número de filas afectadas (1 o 0)
     */
    static async update(id, updatedPlaylist) {
        try {
            const fields = [];
            const values = [];

            // Agregar solo los campos que vienen definidos
            for (const key in updatedPlaylist) {
                if (updatedPlaylist[key] !== undefined) {
                    fields.push(`${key} = ?`);
                    values.push(updatedPlaylist[key]);
                }
            }

            if (fields.length === 0) return 0; // Nada que actualizar

            const sql = `UPDATE playlists SET ${fields.join(', ')} WHERE IdPlay = ?`;
            values.push(id);

            const [result] = await pool.execute(sql, values);
            return result.affectedRows;
        } catch (error) {
            console.error("Error al actualizar la playlist:", error);
            throw error;
        }

    }

    /**
     * @description Elimina una playlist por su ID
     * @param {number} id - El ID de la playlist a eliminar
     * @returns {Promise<number>} - Número de filas afectadas (1 o 0)
     */
    static async delete(id) {
    try {
        // Primero eliminar relaciones
        await pool.execute('DELETE FROM playlist_canciones WHERE IdPlay = ?', [id]);

        // Luego eliminar la playlist
        const [result] = await pool.execute('DELETE FROM playlists WHERE IdPlay = ?', [id]);

        return result.affectedRows;
    } catch (error) {
        console.error("Error al eliminar la playlist:", error);
        throw error;
    }
}


    /**
     * @description Busca las playlists de un usuario por su IDUsuario
     * @param {number} userId - El ID del usuario
     * @return {Promise<Array>} - Array de playlists del usuario
     */

    static async findByUserId(userId) {//permite al usuario ver sus propias playlists
        try {
            const sql = 'SELECT * FROM playlists WHERE IdUs = ?';

            const [rows] = await pool.execute(sql, [userId]);

            return rows;
        } catch (error) {
            console.error("Error al buscar las playlists del usuario:", error);
            throw error;
        }

    }

    /**
     * @description Busca todas las playlists en la base de datos
     * @returns {Promise<Array>} - Array con todas las playlists
     */

    static async findAll() { //permite al admin ver todas las playlists
        try {
            const sql = 'SELECT * FROM playlists';

            const [rows] = await pool.execute(sql);

            return rows;
        } catch (error) {
            console.error("Error al buscar todas las playlists:", error);
            throw error;
        }
    }

    /**
     * @description Busca una playlist por su Nombre
     * @param {string} NomPlay - El nombre de la playlist a buscar
     * @returns {Promise<object|null>} - La playlist encontrada o null si no existe
     */
    static async findByName(NomPlay) {
        try {
            const sql = 'SELECT * FROM playlists WHERE NomPlay LIKE ?';

            const [rows] = await pool.execute(sql, [`%${NomPlay}%`]);

            return rows;
        } catch (error) {
            console.error("Error al buscar por nombre de playlist:", error);
            throw error;
        }
    }

    /** 
     * @description Busca una playlist por su género
     * @param {string} genero - El género de la playlist a buscar
     * @returns {Promise<object|null>} - La playlist encontrada o null si no existe
     */
    static async findByGenre(genero) { 
        try {
            const sql = 'SELECT * FROM playlists WHERE genero LIKE ?';

            const [rows] = await pool.execute(sql, [`%${genero}%`]);

            return rows;
        } catch (error) {
            console.error("Error al buscar por género de playlist:", error);    
            throw error;
        }
    }

    /**
     * @description Busca una playlist por su ID
     * @param {number} id - El ID de la playlist a buscar
     * @returns {Promise<object|null>} - La playlist encontrada o null si no existe
     */
    static async findById(id) {
    const sql = "SELECT * FROM playlists WHERE IdPlay = ?";
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
    }
    //playlist_canciones

    /**
     * @description Agrega una canción a una playlist
     * @param {number} playlistId - El ID de la playlist
     * @param {number} songId - El ID de la canción
     * @returns {Promise<number>} - El ID de la relación insertada
     */

    static async addSongToPlaylist(playlistId, songId) {
        console.log("Modelo: Agregando canción a la playlist", playlistId, songId);
    try {

        // VALIDAR que la playlist exista
        const [playlistExists] = await pool.execute(
            'SELECT IdPlay FROM playlists WHERE IdPlay = ?',
            [playlistId]
        );
        if (playlistExists.length === 0)
            throw new Error("La playlist no existe");

        // VALIDAR que la canción exista
        const [songExists] = await pool.execute(
            'SELECT IdMus FROM musica WHERE IdMus = ?',
            [songId]
        );
        if (songExists.length === 0)
            throw new Error("La canción no existe");

        // VALIDAR que la canción NO esté ya dentro de la playlist
        const [relationExists] = await pool.execute(
            'SELECT * FROM playlist_canciones WHERE IdPlay = ? AND IdMus = ?',
            [playlistId, songId]
        );
        if (relationExists.length > 0)
            throw new Error("La canción ya está dentro de la playlist");

        // SI TODO ES VÁLIDO → insertar
        const sql = 'INSERT INTO playlist_canciones (IdPlay, IdMus) VALUES (?, ?)';
        const [result] = await pool.execute(sql, [playlistId, songId]);
        return result.insertId;

    } catch (error) {
        console.error("Error al agregar canción a la playlist:", error);
        throw error;   
    }
}

    /**
     * @description Elimina una canción de una playlist
     * @param {number} playlistId - El ID de la playlist
     * @param {number} songId - El ID de la canción
     * @returns {Promise<number>} - Número de filas afectadas (1 o 0)
     */

    static async removeSong(playlistId, songId) { 
    try {
        const sql = 'DELETE FROM playlist_canciones WHERE IdPlay = ? AND IdMus = ?';
        console.log(`Ejecutando SQL: ${sql} con params: ${playlistId}, ${songId}`);
        
        const [result] = await pool.execute(sql, [playlistId, songId]);
        console.log(`Filas afectadas: ${result.affectedRows}`);
        
        return result.affectedRows;
    } catch (error) {
        console.error("Error al eliminar canción de la playlist:", error);
        throw error;
    }
}

    /**
     * @description Obtiene todas las canciones de una playlist
     * @param {number} playlistId - El ID de la playlist
     * @returns {Promise<Array>} - Array de canciones en la playlist
     */

    static async getSongsInPlaylist(playlistId) {
        try {
            const sql = `
        SELECT m.*
        FROM playlist_canciones pc
        JOIN musica m ON m.IdMus = pc.IdMus
        WHERE pc.IdPlay = ?
    `;
            const [rows] = await pool.execute(sql, [playlistId]);
            return rows;
        } catch (error) {
            console.error("Error al obtener canciones de la playlist:", error);
            throw error;    
        }
    }

}

export default Playlist;