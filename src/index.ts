import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import authRoutes from './routes/auth.routes';
import arbitroRoutes from './routes/arbitro.routes';
import asignacionRoutes from './routes/asignacion.routes';
import liquidacionRoutes from './routes/liquidacion.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'CABA Arbitros API',
    containerID: process.env.HOSTNAME || 'local'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/arbitros', arbitroRoutes);
app.use('/api/asignaciones', asignacionRoutes);
app.use('/api/liquidaciones', liquidacionRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CABA Arbitros API running on port ${PORT}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);
  console.log(`🐳 Container ID: ${process.env.HOSTNAME || 'local'}`);
});

export default app;
