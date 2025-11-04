export interface Arbitro {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  escalafon: 'A' | 'B' | 'C';
  disponible: boolean;
  activo: boolean;
  photoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateArbitroDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  escalafon?: 'A' | 'B' | 'C';
  disponible?: boolean;
  activo?: boolean;
}

export interface UpdateArbitroDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  escalafon?: 'A' | 'B' | 'C';
  disponible?: boolean;
  activo?: boolean;
  photoUrl?: string;
}
