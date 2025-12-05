import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from "./routes/auth.routes.js";
import songRoutes from './routes/song.routes.js';
import playlistRoutes from './routes/playlists.routes.js';

const app = express();

// CORS - Mantén tu configuración actual
app.use(cors({
    origin: ['http://localhost:5173',
         process.env.BASE_URL_BACKEND,
        process.env.BASE_URL_FRONTEND
    ],
    
    credentials: true 
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Tus rutas existentes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);

// SOLO AÑADE ESTE ENDPOINT PARA VERIFICAR CONEXIÓN
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'API funcionando',
        database: process.env.DB_HOST ? 'Configurada' : 'No configurada'
    });
});

// Tu endpoint raíz existente (sin cambios)
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'API de Disco Elysium: Conectada (Usando ES Modules)',
        version: '1.0.0',
        rutasDisponibles: [
            { endpoint: "/api/auth/register", method: "POST", description: "Crear un nuevo usuario" },
            { endpoint: "/api/auth/login", method: "POST", description: "Iniciar sesion" },
            { endpoint: "/api/auth/logout", method: "POST", description: "Cerrar sesion" }
        ]
    });
});

// Error handler (sin cambios)
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({ 
        message: ['Error interno del servidor'],
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

export default app;