import axios, { AxiosInstance } from 'axios';

class SpringBootApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.SPRING_BOOT_API_URL || 'http://localhost:8081/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Arbitros
  async getArbitros() {
    const response = await this.client.get('/arbitros');
    return response.data;
  }

  async getArbitroById(id: number) {
    const response = await this.client.get(`/arbitros/${id}`);
    return response.data;
  }

  async createArbitro(data: any) {
    const response = await this.client.post('/arbitros', data);
    return response.data;
  }

  async updateArbitro(id: number, data: any) {
    const response = await this.client.put(`/arbitros/${id}`, data);
    return response.data;
  }

  // Asignaciones
  async getAsignacionesByArbitro(arbitroId: number) {
    const response = await this.client.get(`/asignaciones/arbitro/${arbitroId}`);
    return response.data;
  }

  async aceptarAsignacion(asignacionId: number) {
    const response = await this.client.put(`/asignaciones/${asignacionId}/aceptar`);
    return response.data;
  }

  async rechazarAsignacion(asignacionId: number, comentario: string) {
    const response = await this.client.put(`/asignaciones/${asignacionId}/rechazar`, {
      comentario
    });
    return response.data;
  }

  // Liquidaciones
  async getLiquidacionesByArbitro(arbitroId: number) {
    const response = await this.client.get(`/liquidaciones/arbitro/${arbitroId}`);
    return response.data;
  }

  async getLiquidacionById(id: number) {
    const response = await this.client.get(`/liquidaciones/${id}`);
    return response.data;
  }

  // Partidos
  async getPartidoById(id: number) {
    const response = await this.client.get(`/partidos/${id}`);
    return response.data;
  }
}

export default new SpringBootApiService();
