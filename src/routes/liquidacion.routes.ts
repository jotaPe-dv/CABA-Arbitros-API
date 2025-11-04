import { Router } from 'express';
import * as liquidacionController from '../controllers/liquidacion.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/liquidaciones:
 *   get:
 *     summary: Obtener mis liquidaciones
 *     tags: [Liquidaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de liquidaciones del árbitro con totales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liquidaciones:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       monto:
 *                         type: number
 *                       fecha:
 *                         type: string
 *                         format: date
 *                       pagado:
 *                         type: boolean
 *                 totales:
 *                   type: object
 *                   properties:
 *                     cantidad:
 *                       type: number
 *                     montoTotal:
 *                       type: number
 *                     pagadas:
 *                       type: number
 *                     pendientes:
 *                       type: number
 *       401:
 *         description: No autenticado
 */
router.get('/', authMiddleware, liquidacionController.getMySettlements);

/**
 * @swagger
 * /api/liquidaciones/{id}:
 *   get:
 *     summary: Obtener liquidación por ID
 *     tags: [Liquidaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la liquidación
 *     responses:
 *       200:
 *         description: Detalle de la liquidación
 *       404:
 *         description: Liquidación no encontrada
 *       403:
 *         description: No autorizado
 *       401:
 *         description: No autenticado
 */
router.get('/:id', authMiddleware, liquidacionController.getSettlementById);

export default router;
