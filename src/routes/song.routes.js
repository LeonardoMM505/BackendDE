import { Router } from 'express';

// Importamos controladores
import { 
    createSong, 
    getSongs, 
    getSong, 
    updateSong, 
    deleteSong,
    searchSongs 
} from '../controllers/song.controller.js';

// Importamos Middlewares de Seguridad y Validación
import { authRequired } from '../middlewares/validateToken.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js'; 
import { validateSchema } from '../middlewares/validator.middleware.js';

// Importamos los Esquemas de Zod
import { createSongSchema, searchSongSchema } from '../schemas/song.schemas.js';

import { upload } from '../config/cloudinary.config.js';



const router = Router();


// RUTAS PÚBLICAS Y DE CLIENTE (No requieren Rol 'admin')

// GET /api/songs -> Obtiene todo el catálogo musical
router.get('/', getSongs); 

// GET /api/songs/:id -> Obtiene una canción específica
router.get('/:id', getSong); 

// GET /api/songs/search?artist=... -> Búsqueda avanzada por parámetros
router.get('/search', validateSchema(searchSongSchema), searchSongs);


// RUTAS PROTEGIDAS POR ROL (Requieren Rol: 'admin')

// Aplica los middlewares de Autenticación y Autorización a todas las rutas siguientes
router.use(authRequired);
router.use(authorize(['admin'])); 

// POST /api/songs -> Crea una nueva canción
router.post('/', upload.single('UrlPort'), validateSchema(createSongSchema), createSong);

// PUT /api/songs/:id -> Actualiza una canción
router.put('/:id', upload.single('UrlPort'), validateSchema(createSongSchema) ,updateSong);

// DELETE /api/songs/:id -> Elimina una canción
router.delete('/:id', deleteSong);



export default router;