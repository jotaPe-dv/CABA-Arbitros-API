import { Router } from 'express';
import * as arbitroController from '../controllers/arbitro.controller';
import { authMiddleware } from '../middleware/auth';
import { uploadToS3 } from '../config/s3.config';

const router = Router();

/**
 * @swagger
 * /api/arbitros/dashboard:
 *   get:
 *     summary: Obtener dashboard del árbitro
 *     tags: [Arbitros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard con estadísticas y datos recientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 arbitro:
 *                   type: object
 *                 stats:
 *                   type: object
 *                   properties:
 *                     partidosPendientes:
 *                       type: number
 *                     partidosAceptados:
 *                       type: number
 *                     partidosCompletados:
 *                       type: number
 *                     totalLiquidaciones:
 *                       type: number
 *                     montoTotal:
 *                       type: number
 *                 asignacionesRecientes:
 *                   type: array
 *                 liquidacionesRecientes:
 *                   type: array
 *       401:
 *         description: No autenticado
 */
router.get('/dashboard', authMiddleware, arbitroController.getDashboard);

/**
 * @swagger
 * /api/arbitros/profile:
 *   get:
 *     summary: Obtener perfil del árbitro
 *     tags: [Arbitros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del árbitro
 *       401:
 *         description: No autenticado
 */
router.get('/profile', authMiddleware, arbitroController.getProfile);

/**
 * @swagger
 * /api/arbitros/profile:
 *   put:
 *     summary: Actualizar perfil del árbitro
 *     tags: [Arbitros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       401:
 *         description: No autenticado
 */
router.put('/profile', authMiddleware, arbitroController.updateProfile);

/**
 * @swagger
 * /api/arbitros/upload-photo:
 *   post:
 *     summary: Subir foto de perfil
 *     tags: [Arbitros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto subida exitosamente
 *       400:
 *         description: No se proporcionó ninguna imagen
 *       401:
 *         description: No autenticado
 */
router.post('/upload-photo', authMiddleware, uploadToS3.single('photo'), arbitroController.uploadPhoto);

export default router;
