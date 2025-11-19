import { Router } from 'express';

// 1. Importamos los controladores que YA TENEMOS
import { 
    register, 
    login, 
    logout,
    profile, 
    verifyToken // <-- Aún no lo creamos
} from '../controllers/auth.controller.js';

// 2. Importamos los middlewares
import { validateSchema } from '../middlewares/validator.middleware.js';
import { authRequired } from '../middlewares/validateToken.middleware.js';

// 3. Importamos los middlewares que NOS FALTAN
// (Los usaremos para proteger rutas como /profile)
// import { authorize } from "../middlewares/authorize.middleware.js";

// 4. Importamos los esquemas 
import { registerSchema, loginSchema } from '../schemas/auth.schemas.js'; // (Tu 'auth.schemas.js')


const router = Router();

// Rutas de Autenticación Públicas
router.post('/register', validateSchema(registerSchema), register);

router.post('/login', validateSchema(loginSchema), login);

router.post('/logout', logout);

// Rutas de Autenticación Protegidas
router.get('/profile', authRequired, profile); 
router.get('/verify', authRequired, verifyToken);

// --- Rutas de Admin (PENDIENTES) ---
// router.get('/users', authRequired, authorize(['admin']), getUsers); 
// router.delete('/users/:id', authRequired, authorize(['admin']), deleteUser);


export default router;