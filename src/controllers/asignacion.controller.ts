import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import springBootApi from '../services/springboot-api.service';

export const getMyAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const arbitroId = req.arbitroId;

    if (!arbitroId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const asignaciones = await springBootApi.getAsignacionesByArbitro(arbitroId);

    // Enriquecer asignaciones con datos del partido
    const asignacionesConPartido = await Promise.all(
      asignaciones.map(async (asignacion: any) => {
        try {
          const partido = await springBootApi.getPartidoById(asignacion.partidoId);
          return {
            ...asignacion,
            partido
          };
        } catch (error) {
          return asignacion;
        }
      })
    );

    res.json({
      asignaciones: asignacionesConPartido
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Error al obtener asignaciones' });
  }
};

export const getAssignmentById = async (req: AuthRequest, res: Response) => {
  try {
    const arbitroId = req.arbitroId;
    const asignacionId = parseInt(req.params.id);

    if (!arbitroId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (isNaN(asignacionId)) {
      return res.status(400).json({ error: 'ID de asignación inválido' });
    }

    // Obtener asignaciones del árbitro y buscar la específica
    const asignaciones = await springBootApi.getAsignacionesByArbitro(arbitroId);
    const asignacion = asignaciones.find((a: any) => a.id === asignacionId);

    if (!asignacion) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }

    // Enriquecer con datos del partido
    try {
      const partido = await springBootApi.getPartidoById(asignacion.partidoId);
      res.json({
        asignacion: {
          ...asignacion,
          partido
        }
      });
    } catch (error) {
      res.json({ asignacion });
    }
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ error: 'Error al obtener asignación' });
  }
};

export const acceptAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const arbitroId = req.arbitroId;
    const asignacionId = parseInt(req.params.id);

    if (!arbitroId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (isNaN(asignacionId)) {
      return res.status(400).json({ error: 'ID de asignación inválido' });
    }

    // Verificar que la asignación pertenece al árbitro
    const asignaciones = await springBootApi.getAsignacionesByArbitro(arbitroId);
    const asignacion = asignaciones.find((a: any) => a.id === asignacionId);

    if (!asignacion) {
      return res.status(403).json({ error: 'No autorizado para aceptar esta asignación' });
    }

    // Aceptar asignación
    await springBootApi.aceptarAsignacion(asignacionId);

    res.json({
      message: 'Asignación aceptada exitosamente',
      asignacionId
    });
  } catch (error) {
    console.error('Accept assignment error:', error);
    res.status(500).json({ error: 'Error al aceptar asignación' });
  }
};

export const rejectAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const arbitroId = req.arbitroId;
    const asignacionId = parseInt(req.params.id);

    if (!arbitroId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (isNaN(asignacionId)) {
      return res.status(400).json({ error: 'ID de asignación inválido' });
    }

    // Verificar que la asignación pertenece al árbitro
    const asignaciones = await springBootApi.getAsignacionesByArbitro(arbitroId);
    const asignacion = asignaciones.find((a: any) => a.id === asignacionId);

    if (!asignacion) {
      return res.status(403).json({ error: 'No autorizado para rechazar esta asignación' });
    }

    // Rechazar asignación
    await springBootApi.rechazarAsignacion(asignacionId, 'Rechazado por el árbitro');

    res.json({
      message: 'Asignación rechazada exitosamente',
      asignacionId
    });
  } catch (error) {
    console.error('Reject assignment error:', error);
    res.status(500).json({ error: 'Error al rechazar asignación' });
  }
};
