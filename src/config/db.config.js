
import { createPool } from 'mysql2/promise';

// 1. Crear el Pool de Conexiones
// Un "pool" gestiona múltiples conexiones para que sea más eficiente
// y robusto para una aplicación web.
const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Límite de conexiones
    queueLimit: 0
});

// 2. Función de Test de Conexión
// Esta función la llamaremos desde index.js para asegurarnos de que todo funciona al arrancar.
export const connectDB = async () => {
    try {
        // Obtenemos una conexión del pool solo para probar
        const connection = await pool.getConnection(); 
        
        console.log(`\n----------------------------------------------------`);
        console.log(`  Base de Datos MySQL conectada exitosamente (Pool)`);
        console.log(`----------------------------------------------------`);
        
        // Devolvemos la conexión al pool
        connection.release();
    } catch (error) {
        console.error("\n[ERROR] No se pudo conectar a la base de datos MySQL:");
        console.error(error.message);
        // Si la conexión falla, detenemos la aplicación
        process.exit(1); 
    }
};

// 3. Exportación Principal
// Exportamos el 'pool' por defecto. Este 'pool' será el que 
// usaremos en nuestros Modelos (User.model.js, Song.model.js) 
// para hacer las consultas SQL.
export default pool;