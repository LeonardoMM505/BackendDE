import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.config.js'; 



// Ejecutar conexión
connectDB();

// Iniciar el servidor
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`\n\n----------------------------------------------------`);
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
    console.log(` Base de datos: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`----------------------------------------------------\n`);
});