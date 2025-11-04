import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import springBootApi from '../services/springboot-api.service';
import { AuthRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }

    // En un escenario real, aquí consultarías tu base de datos local
    // Para este ejemplo, asumimos que la autenticación se hace contra Spring Boot
    
    // Generar token JWT
    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { email, arbitroId: 1 }, // En producción, usar datos reales
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      message: 'Login exitoso',
      arbitro: {
        id: 1,
        email,
        nombre: 'Árbitro Demo'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error en login' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, email, password, telefono } = req.body;

    // Validar campos requeridos
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear árbitro en Spring Boot
    const arbitroData = {
      nombre,
      apellido,
      email,
      password: hashedPassword,
      telefono: telefono || '',
      escalafon: 'C',
      disponible: true,
      activo: true
    };

    const newArbitro = await springBootApi.createArbitro(arbitroData);

    // Generar token
    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { email, arbitroId: newArbitro.id },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      message: 'Árbitro registrado exitosamente',
      arbitro: newArbitro
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error al registrar árbitro' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const arbitroId = req.arbitroId;

    if (!arbitroId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const arbitro = await springBootApi.getArbitroById(arbitroId);

    res.json({
      arbitro
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};
