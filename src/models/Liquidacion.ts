export interface Liquidacion {
  id: number;
  arbitroId: number;
  partidoId: number;
  monto: number;
  fecha: string;
  concepto: string;
  pagado: boolean;
  fechaPago?: string;
  metodoPago?: string;
  comprobante?: string;
  observaciones?: string;
}

export interface CreateLiquidacionDto {
  arbitroId: number;
  partidoId: number;
  monto: number;
  concepto: string;
}

export interface UpdateLiquidacionDto {
  monto?: number;
  concepto?: string;
  pagado?: boolean;
  fechaPago?: string;
  metodoPago?: string;
  comprobante?: string;
  observaciones?: string;
}
