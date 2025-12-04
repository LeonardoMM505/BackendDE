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

// RUTAS PARA USUARIOS REGULARES (cliente o admin)
router.get('/user/:userId/search', validateQuery(searchPlaylistSchema), searchPlaylistsByUser);
router.get('/user/:userId', getPlaylistsByUserId);
router.post('/songs', validateSchema(addSongToPlaylistSchema), addSongToPlaylist);
router.delete('/:id/songs/:songId', removeSongFromPlaylist);
router.put('/:id', validateSchema(updatePlaylistSchema), updatePlaylist);
router.delete('/:id', deletePlaylist);
router.post('/', validateSchema(createPlaylistSchema), createPlaylist);
router.get('/:id/songs', getSongsFromPlaylist);
router.get('/:id', getPlaylistById);

// ===== RUTAS EXCLUSIVAS PARA ADMIN =====
// NOTA: Estas rutas deben estar después de las generales
router.get('/search', authorize(['admin']), validateQuery(searchPlaylistSchema), searchPlaylists);
router.get('/', authorize(['admin']), getPlaylists);

export default router;
