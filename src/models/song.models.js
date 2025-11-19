import pool from '../config/db.config.js';

class Song { 
    /** 
     * @description Crea una nueva canción en la base de datos
     * @param {object} newSong - Objeto con los datos de la canción {NomMus, Album, UrlPort, AnPu, Art, genero}
     * @returns {Promise<number>} - El ID de la canción insertada
     */
    static async create(newSong) { 
        try {

            const sql = 'INSERT INTO musica (NomMus, Album, UrlPort, AnPu, Art, genero) VALUES (?, ?, ?, ?, ?, ?)';
            
            const [result] = await pool.execute(sql, [
                newSong.NomMus,
                newSong.Album,
                newSong.UrlPort,
                newSong.AnPu,
                newSong.Art,
                newSong.genero
            ]);

        return result.insertId; 

        } catch (error) {
            console.error("Error al crear el usuario:", error);
            throw error;
        }
    } 
    
    /**
     * @description Actualiza una canción existente (Admin)
     * @param {number} id - El ID de la canción a actualizar
     * @param {object} updatedSong - Datos a actualizar
     * @returns {Promise<number>} - Número de filas afectadas (1 o 0)
     */
    static async update(id, updatedSong) {
        try {
            const sql = 'UPDATE musica SET NomMus = ?, Album = ?, UrlPort = ?, AnPu = ?, Art = ?, genero = ? WHERE IdMus = ?';
            
            const [result] = await pool.execute(sql, [
                updatedSong.NomMus,
                updatedSong.Album,
                updatedSong.UrlPort,
                updatedSong.AnPu,
                updatedSong.Art,
                updatedSong.genero,
                id // El ID de la canción
            ]);
            
            return result.affectedRows;
        } catch (error) {
            console.error("Error al actualizar la canción:", error);
            throw error;
        }
    }

    /**
     * @description Elimina una canción por su ID (Admin)
     * @param {number} id - El ID de la canción a eliminar
     * @returns {Promise<number>} - Número de filas afectadas (1 o 0)
     */
    static async delete(id) {
        try {
            const sql = 'DELETE FROM musica WHERE IdMus = ?';
            const [result] = await pool.execute(sql, [id]);
            // El CASCADE que configuramos se encargará de borrarlo de playlist_canciones
            return result.affectedRows; 
        } catch (error) {
            console.error("Error al eliminar la canción:", error);
            throw error;
        }
    }

    /**  
      * @description Busca todas las canciones en la base de datos
      * @returns {Promise<Array>} - Array con todas las canciones
      */

     static async findAll() { 
        try {
            const sql = 'SELECT * FROM musica';

            const [rows] = await pool.execute(sql);

            return rows;
        } catch (error) {
            console.error("Error al buscar todas las canciones:", error);
            throw error;
        }
     }


    /**
     * @description Busca una canción por su Nombre
     * @param {string} NomMus - El nombre de la canción a buscar
     * @returns {Promise<object|null>} - La canción encontrada o null si no existe
     */
     static async findByName(NomMus) { 
        try {
            const sql = 'SELECT * FROM musica WHERE NomMus = ?';

            const [rows] = await pool.execute(sql, [NomMus]);

            return rows[0];
        } catch (error) {
            console.error("Error al buscar por nombre de canción:", error);
            throw error;
        }
     }

     /**
     * @description Busca una canción por su Nombre
     * @param {string} Album - El album de la canción a buscar
     * @returns {Promise<object|null>} - La canción encontrada o null si no existe
     */
     static async findByAlbum(Album) { 
        try {
            const sql = 'SELECT * FROM musica WHERE Album = ?';

            const [rows] = await pool.execute(sql, [Album]);

            return rows[0];
        } catch (error) {
            console.error("Error al buscar por nombre de canción:", error);
            throw error;
        }
     }

     /**
     * @description Busca una canción por su Nombre
     * @param {string} AnPu - El nombre de la canción a buscar
     * @returns {Promise<object|null>} - La canción encontrada o null si no existe
     */
     static async findByPubl(AnPu) { 
        try {
            const sql = 'SELECT * FROM musica WHERE AnPu = ?';

            const [rows] = await pool.execute(sql, [AnPu]);

            return rows[0];
        } catch (error) {
            console.error("Error al buscar por nombre de canción:", error);
            throw error;
        }
     }

     /**
     * @description Busca una canción por su Nombre
     * @param {string} Art - El nombre de la canción a buscar
     * @returns {Promise<object|null>} - La canción encontrada o null si no existe
     */
     static async findByArt(Art) { 
        try {
            const sql = 'SELECT * FROM musica WHERE Art = ?';

            const [rows] = await pool.execute(sql, [Art]);

            return rows[0];
        } catch (error) {
            console.error("Error al buscar por nombre de canción:", error);
            throw error;
        }
     }
    
     /**
     * @description Busca una canción por su Nombre
     * @param {string} genero - El nombre de la canción a buscar
     * @returns {Promise<object|null>} - La canción encontrada o null si no existe
     */
     static async findByGenero(genero) { 
        try {
            const sql = 'SELECT * FROM musica WHERE genero = ?';

            const [rows] = await pool.execute(sql, [genero]);

            return rows[0];
        } catch (error) {
            console.error("Error al buscar por nombre de canción:", error);
            throw error;
        }
     }


     /**
 * @description Busca una canción por su ID
 * @param {number} id - El ID de la canción a buscar
 * @returns {Promise<object|null>} - La canción encontrada o null si no existe
 */
static async findById(id) { 
    try {
        const sql = 'SELECT * FROM musica WHERE IdMus = ?';
        const [rows] = await pool.execute(sql, [id]);
        return rows[0];
    } catch (error) {
        console.error("Error al buscar canción por ID:", error);
        throw error;
    }
}

     
}



export default Song;