export interface Partido {
  id: number;
  torneoId: number;
  equipoLocal: string;
  equipoVisitante: string;
  fecha: string;
  hora: string;
  lugar: string;
  fase: 'CUARTOS' | 'SEMIFINAL' | 'FINAL';
  estado: 'PROGRAMADO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';
  resultadoLocal?: number;
  resultadoVisitante?: number;
  observaciones?: string;
}

export interface Torneo {
  id: number;
  nombre: string;
  anio: number;
  categoria: string;
  estado: 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';
  fechaInicio: string;
  fechaFin?: string;
}
