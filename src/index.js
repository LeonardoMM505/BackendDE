import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.config.js'; 

// 4. Ejecutar conexion
connectDB();

dotenv.config();
// 5. Iniciar el servidor
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`\n\n----------------------------------------------------`);
    console.log(` Servidor de la API corriendo en http://localhost:${PORT}`);
    console.log(` (Usando ES Modules)`);
    console.log(`----------------------------------------------------\n`);
});