import { Router } from 'express';
import * as asignacionController from '../controllers/asignacion.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/asignaciones:
 *   get:
 *     summary: Obtener mis asignaciones
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones del árbitro
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 asignaciones:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       estado:
 *                         type: string
 *                         enum: [PENDIENTE, ACEPTADO, RECHAZADO, COMPLETADO]
 *                       rol:
 *                         type: string
 *                       partido:
 *                         type: object
 *       401:
 *         description: No autenticado
 */
router.get('/', authMiddleware, asignacionController.getMyAssignments);

/**
 * @swagger
 * /api/asignaciones/{id}:
 *   get:
 *     summary: Obtener asignación por ID
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación
 *     responses:
 *       200:
 *         description: Detalle de la asignación
 *       404:
 *         description: Asignación no encontrada
 *       401:
 *         description: No autenticado
 */
router.get('/:id', authMiddleware, asignacionController.getAssignmentById);

/**
 * @swagger
 * /api/asignaciones/{id}/accept:
 *   put:
 *     summary: Aceptar asignación
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación
 *     responses:
 *       200:
 *         description: Asignación aceptada exitosamente
 *       403:
 *         description: No autorizado
 *       401:
 *         description: No autenticado
 */
router.put('/:id/accept', authMiddleware, asignacionController.acceptAssignment);

/**
 * @swagger
 * /api/asignaciones/{id}/reject:
 *   put:
 *     summary: Rechazar asignación
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación
 *     responses:
 *       200:
 *         description: Asignación rechazada exitosamente
 *       403:
 *         description: No autorizado
 *       401:
 *         description: No autenticado
 */
router.put('/:id/reject', authMiddleware, asignacionController.rejectAssignment);

export default router;
