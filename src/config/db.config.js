import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración única (usa Aiven si DB_HOST está configurado, sino local)
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // 3306 para local, 23940 para Aiven
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Si hay host de Aiven, agregar SSL
if (process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com')) {
    dbConfig.ssl = { 
        rejectUnauthorized: false  // Cambia true por false
    };
}

console.log(`🔌 Conectando a: ${dbConfig.host}:${dbConfig.port}`);

// Crear el Pool
const pool = createPool(dbConfig);

// Función de conexión (sin cambios a tu función)
export const connectDB = async () => {
    try {
        const connection = await pool.getConnection(); 
        
        console.log(`\n----------------------------------------------------`);
        console.log(`  Base de Datos MySQL conectada exitosamente`);
        console.log(`  Host: ${dbConfig.host}:${dbConfig.port}`);
        console.log(`  Base: ${dbConfig.database}`);
        console.log(`----------------------------------------------------`);
        
        connection.release();
    } catch (error) {
        console.error("\n[ERROR] No se pudo conectar a la base de datos:");
        console.error(error.message);
        process.exit(1); 
    }
};

// Exportar pool (sin cambios)
export default pool;