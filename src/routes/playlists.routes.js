import {Router} from 'express';

import {
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    getPlaylists,  // Para admin
    getPlaylistsByUserId,
    searchPlaylists,  // Para admin
    searchPlaylistsByUser,
    getPlaylistById,
    addSongToPlaylist,
    removeSongFromPlaylist,
    getSongsFromPlaylist
} from '../controllers/playlist.controller.js';

import { authRequired } from '../middlewares/validateToken.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { validateSchema, validateQuery } from '../middlewares/validator.middleware.js';

import {
    createPlaylistSchema, 
    updatePlaylistSchema, 
    addSongToPlaylistSchema, 
    removeSongFromPlaylistSchema,
    searchPlaylistSchema,
} from "../schemas/playlist.schemas.js";

const router = Router();

// ===== RUTAS PÚBLICAS (si las hay) =====
// ...

// ===== RUTAS QUE REQUIEREN AUTENTICACIÓN =====
// Aplicar authRequired a todas las rutas siguientes
router.use(authRequired);

// ===== RUTAS EXCLUSIVAS PARA ADMIN =====
// Estas rutas deben estar PRIMERO, antes de las rutas con parámetros
router.get('/search', authorize(['admin']), validateQuery(searchPlaylistSchema), searchPlaylists);
router.get('/', authorize(['admin']), getPlaylists);

// ===== RUTAS PARA USUARIOS REGULARES Y ADMIN =====
// NOTA: Estas rutas van DESPUÉS de las rutas específicas
router.get('/user/:userId/search', validateQuery(searchPlaylistSchema), searchPlaylistsByUser);
router.get('/user/:userId', getPlaylistsByUserId);
router.post('/songs', validateSchema(addSongToPlaylistSchema), addSongToPlaylist);
router.put('/:id', validateSchema(updatePlaylistSchema), updatePlaylist);
router.delete('/:id', deletePlaylist);
router.post('/', validateSchema(createPlaylistSchema), createPlaylist);
router.get('/:id/songs', getSongsFromPlaylist);
router.get('/:id', getPlaylistById);
router.delete('/:id/songs/:songId', removeSongFromPlaylist);

export default router;