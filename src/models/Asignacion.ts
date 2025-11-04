import { Partido } from './Partido';

export interface Asignacion {
  id: number;
  partidoId: number;
  arbitroId: number;
  rol: 'PRINCIPAL' | 'ASISTENTE_1' | 'ASISTENTE_2';
  estado: 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'COMPLETADO';
  fechaAsignacion: string;
  fechaRespuesta?: string;
  partido?: Partido;
}

export interface CreateAsignacionDto {
  partidoId: number;
  arbitroId: number;
  rol: 'PRINCIPAL' | 'ASISTENTE_1' | 'ASISTENTE_2';
}

export interface UpdateAsignacionDto {
  estado?: 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'COMPLETADO';
  fechaRespuesta?: string;
}
