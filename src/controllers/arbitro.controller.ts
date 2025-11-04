import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import springBootApi from '../services/springboot-api.service';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const arbitroId = req.arbitroId;

    if (!arbitroId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Obtener datos del árbitro
    const arbitro = await springBootApi.getArbitroById(arbitroId);
    
    // Obtener asignaciones
    const asignaciones = await springBootApi.getAsignacionesByArbitro(arbitroId);
    
    // Obtener liquidaciones
    const liquidaciones = await springBootApi.getLiquidacionesByArbitro(arbitroId);

    // Calcular estadísticas
    const stats = {
      partidosPendientes: asignaciones.filter((a: any) => a.estado === 'PENDIENTE').length,
      partidosAceptados: asignaciones.filter((a: any) => a.estado === 'ACEPTADO').length,
      partidosCompletados: asignaciones.filter((a: any) => a.estado === 'COMPLETADO').length,
      totalLiquidaciones: liquidaciones.length,
      montoTotal: liquidaciones.reduce((sum: number, l: any) => sum + (l.monto || 0), 0)
    };

    res.json({
      arbitro,
      stats,
      asignacionesRecientes: asignaciones.slice(0, 5),
      liquidacionesRecientes: liquidaciones.slice(0, 3)
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Error al obtener dashboard' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const arbitroId = req.arbitroId;

    if (!arbitroId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const arbitro = await springBootApi.getArbitroById(arbitroId);

    res.json({ arbitro });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const arbitroId = req.arbitroId;

    if (!arbitroId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { nombre, apellido, telefono, email } = req.body;

    const updateData = {
      nombre,
      apellido,
      telefono,
      email
    };

    const updatedArbitro = await springBootApi.updateArbitro(arbitroId, updateData);

    res.json({
      message: 'Perfil actualizado exitosamente',
      arbitro: updatedArbitro
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

export const uploadPhoto = async (req: AuthRequest, res: Response) => {
  try {
    const arbitroId = req.arbitroId;

    if (!arbitroId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // La foto se sube a S3 mediante el middleware multer-s3
    // La URL de la foto estará en req.file.location
    const file = req.file as any;

    if (!file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    const photoUrl = file.location;

    // Actualizar URL de foto en Spring Boot
    await springBootApi.updateArbitro(arbitroId, { photoUrl });

    res.json({
      message: 'Foto actualizada exitosamente',
      photoUrl
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: 'Error al subir foto' });
  }
};
