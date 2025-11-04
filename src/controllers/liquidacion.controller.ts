import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import springBootApi from '../services/springboot-api.service';

export const getMySettlements = async (req: AuthRequest, res: Response) => {
  try {
    const arbitroId = req.arbitroId;

    if (!arbitroId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const liquidaciones = await springBootApi.getLiquidacionesByArbitro(arbitroId);

    // Calcular totales
    const totales = {
      cantidad: liquidaciones.length,
      montoTotal: liquidaciones.reduce((sum: number, l: any) => sum + (l.monto || 0), 0),
      pagadas: liquidaciones.filter((l: any) => l.pagado).length,
      pendientes: liquidaciones.filter((l: any) => !l.pagado).length
    };

    res.json({
      liquidaciones,
      totales
    });
  } catch (error) {
    console.error('Get settlements error:', error);
    res.status(500).json({ error: 'Error al obtener liquidaciones' });
  }
};

export const getSettlementById = async (req: AuthRequest, res: Response) => {
  try {
    const arbitroId = req.arbitroId;
    const liquidacionId = parseInt(req.params.id);

    if (!arbitroId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (isNaN(liquidacionId)) {
      return res.status(400).json({ error: 'ID de liquidación inválido' });
    }

    // Obtener liquidación
    const liquidacion = await springBootApi.getLiquidacionById(liquidacionId);

    // Verificar que la liquidación pertenece al árbitro
    if (liquidacion.arbitroId !== arbitroId) {
      return res.status(403).json({ error: 'No autorizado para ver esta liquidación' });
    }

    res.json({
      liquidacion
    });
  } catch (error) {
    console.error('Get settlement error:', error);
    
    // Si el error es 404, es porque la liquidación no existe
    if ((error as any).response?.status === 404) {
      return res.status(404).json({ error: 'Liquidación no encontrada' });
    }
    
    res.status(500).json({ error: 'Error al obtener liquidación' });
  }
};
