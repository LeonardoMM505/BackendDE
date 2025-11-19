import pool from '../config/db.config.js';
import bcrypt from 'bcryptjs';

class User { 
    /** 
     * @description Crea un nuevo usuario en la base de datos (Registro)
     * @param {object} newUser - Objeto con los datos del usuario { NomUs, Email, Pass }
     * @returns {Promise<number>} - El ID del usuario insertado
     */

    static async create(newUser) {
        try {
            // 1. Hashear la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newUser.Pass, salt);

            // 2. Definir el rol (default 'cliente')
            const role = 'cliente'; 
            
            // 3. La consulta SQL (los ? son "prepared statements" para seguridad)
            const sql = 'INSERT INTO usuarios (Email, NomUs, Pass, Rol) VALUES (?, ?, ?, ?)';
            
            // 4. Ejecutar la consulta
            const [result] = await pool.execute(sql, [
                newUser.Email,
                newUser.NomUs,
                hashedPassword,
                role
            ]);
            
            // 5. Devolver el ID del usuario recién creado
            return result.insertId;

        } catch (error) {
            console.error("Error al crear el usuario:", error);
            throw error;
        }

    }

    /**
     * @description Busca un usuario por su Email
     * @param {string} email - El email del usuario a buscar
     * @returns {Promise<object|null>} - El usuario encontrado o null si no existe
     */
    static async findByEmail(email) {
        try {
            const sql = 'SELECT * FROM usuarios WHERE Email = ?';
            
            // pool.execute devuelve [rows, fields]
            const [rows] = await pool.execute(sql, [email]);
            
            // rows es un array. Si encontramos un usuario, estará en la posición 0.
            return rows[0];

        } catch (error) {
            console.error("Error al buscar por email:", error);
            throw error;
        }
    }

    /**
     * @description Busca un usuario por su ID
     * @param {number} id - El ID del usuario (IdUs)
     * @returns {Promise<object|null>} - El usuario encontrado o null
     */
    static async findById(id) {
        try {
            const sql = 'SELECT * FROM usuarios WHERE IdUs = ?';
            const [rows] = await pool.execute(sql, [id]);
            return rows[0];

        } catch (error) {
            console.error("Error al buscar por ID (modelo):", error);
            throw error;
        }
    }

    // Agregar delete update si es necesario (que probablemente lo sea)
}

export default User;
