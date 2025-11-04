# CABA Arbitros API

API REST para gestión de árbitros del proyecto CABA. Desarrollada con Node.js, Express y TypeScript para el Taller 02.

## 🚀 Características

- **Autenticación JWT**: Login y registro de árbitros con tokens seguros
- **Dashboard**: Estadísticas de asignaciones y liquidaciones
- **Gestión de Asignaciones**: Aceptar/rechazar partidos asignados
- **Liquidaciones**: Consultar pagos y montos
- **AWS S3**: Upload de fotos de perfil
- **Swagger**: Documentación interactiva de API
- **Docker**: Contenerización para despliegue en producción
- **Docker Swarm**: Orquestación para alta disponibilidad

## 📋 Prerequisitos

- Node.js 18 o superior
- npm 9 o superior
- Docker y Docker Compose
- Cuenta de AWS (para S3)
- Spring Boot backend running en `http://localhost:8081`

## 🛠️ Instalación Local

### 1. Clonar repositorio

```bash
git clone <repository-url>
cd CABA-Arbitros-API
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Editar `.env`:

```env
# Application
NODE_ENV=development
PORT=3000

# Spring Boot API
SPRING_BOOT_API_URL=http://localhost:8081/api/v1

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=caba-arbitros-images

# CORS
CORS_ORIGIN=*
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`

## 📚 Documentación API

Una vez iniciada la aplicación, acceder a:

- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

### Endpoints Principales

#### Autenticación
- `POST /api/auth/login` - Login de árbitro
- `POST /api/auth/register` - Registro de nuevo árbitro
- `GET /api/auth/profile` - Obtener perfil (requiere token)

#### Árbitros
- `GET /api/arbitros/dashboard` - Dashboard con estadísticas
- `GET /api/arbitros/profile` - Obtener perfil completo
- `PUT /api/arbitros/profile` - Actualizar perfil
- `POST /api/arbitros/upload-photo` - Subir foto (multipart/form-data)

#### Asignaciones
- `GET /api/asignaciones` - Listar asignaciones del árbitro
- `GET /api/asignaciones/:id` - Detalle de asignación
- `PUT /api/asignaciones/:id/accept` - Aceptar asignación
- `PUT /api/asignaciones/:id/reject` - Rechazar asignación

#### Liquidaciones
- `GET /api/liquidaciones` - Listar liquidaciones con totales
- `GET /api/liquidaciones/:id` - Detalle de liquidación

## 🐳 Docker

### Build imagen local

```bash
npm run docker:build
```

O manualmente:

```bash
docker build -t caba-arbitros-api:latest .
```

### Ejecutar contenedor

```bash
npm run docker:run
```

O manualmente:

```bash
docker run -p 3000:3000 --env-file .env caba-arbitros-api:latest
```

### Docker Compose

```bash
docker-compose up -d
```

## 📦 Docker Hub

La imagen está disponible públicamente en Docker Hub:

```bash
docker pull jotapedv/caba-arbitros-api:latest
# O versión específica
docker pull jotapedv/caba-arbitros-api:v1.0.0
```

**Docker Hub Repository**: https://hub.docker.com/r/jotapedv/caba-arbitros-api

## ☁️ Despliegue en AWS EC2 con Docker Swarm

### 1. Preparar instancias EC2

Lanzar 4 instancias EC2 (t2.micro con Ubuntu 22.04):

- 1 Manager node
- 3 Worker nodes

### 2. Instalar Docker en todas las instancias

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu
```

### 3. Inicializar Docker Swarm (en Manager)

```bash
docker swarm init --advertise-addr <MANAGER_PRIVATE_IP>
```

Guardar el token mostrado para unir workers.

### 4. Unir Workers al Swarm

En cada worker node:

```bash
docker swarm join --token <TOKEN> <MANAGER_PRIVATE_IP>:2377
```

### 5. Verificar nodos

```bash
docker node ls
```

### 6. Desplegar servicio con 10 réplicas

En el manager node:

```bash
docker service create \
  --name caba-arbitros-api \
  --replicas 10 \
  --publish published=3000,target=3000 \
  --env-file .env \
  <your-dockerhub-username>/caba-arbitros-api:latest
```

### 7. Verificar réplicas

```bash
docker service ps caba-arbitros-api
docker service ls
```

### 8. Escalar réplicas (opcional)

```bash
docker service scale caba-arbitros-api=10
```

### 9. Actualizar servicio

```bash
docker service update --image <your-dockerhub-username>/caba-arbitros-api:latest caba-arbitros-api
```

### 10. Ver logs

```bash
docker service logs caba-arbitros-api
```

## 🔍 Verificar Container IDs

Cada réplica tiene un `HOSTNAME` único que se muestra en el health check:

```bash
curl http://<EC2_PUBLIC_IP>:3000/health
```

Respuesta:

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "CABA Arbitros API",
  "containerID": "a1b2c3d4e5f6"
}
```

Al hacer múltiples requests, verás diferentes `containerID` (load balancing entre réplicas).

## 🏗️ Estructura del Proyecto

```
CABA-Arbitros-API/
├── src/
│   ├── config/
│   │   ├── swagger.ts          # Configuración OpenAPI
│   │   └── s3.config.ts        # AWS S3 client y multer
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── arbitro.controller.ts
│   │   ├── asignacion.controller.ts
│   │   └── liquidacion.controller.ts
│   ├── middleware/
│   │   ├── auth.ts             # JWT verification
│   │   ├── errorHandler.ts
│   │   └── logger.ts
│   ├── models/
│   │   ├── Arbitro.ts
│   │   ├── Asignacion.ts
│   │   ├── Liquidacion.ts
│   │   └── Partido.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── arbitro.routes.ts
│   │   ├── asignacion.routes.ts
│   │   └── liquidacion.routes.ts
│   ├── services/
│   │   └── springboot-api.service.ts
│   └── index.ts                # Entry point
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Testing

### Test con curl

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"arbitro@example.com","password":"password123"}'

# Dashboard (requiere token)
curl -X GET http://localhost:3000/api/arbitros/dashboard \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

## 📊 Arquitectura

```
┌─────────────┐      HTTP      ┌──────────────────┐
│   Cliente   │ ─────────────> │  CABA Arbitros  │
│  (Browser)  │                 │   API (Express) │
└─────────────┘                 └──────────────────┘
                                         │
                                         │ Axios
                                         ↓
                                ┌──────────────────┐
                                │  Spring Boot API │
                                │    (Backend)     │
                                └──────────────────┘
                                         │
                                         ↓
                                   ┌──────────┐
                                   │  H2 DB   │
                                   └──────────┘
```

## 🔐 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso cross-origin
- **JWT**: Tokens con expiración
- **Rate Limiting**: Prevención de abuse (configurado)
- **S3 ACL**: Control de acceso a imágenes

## 📝 Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NODE_ENV` | Entorno (development/production) | `development` |
| `PORT` | Puerto de la aplicación | `3000` |
| `SPRING_BOOT_API_URL` | URL del backend Spring Boot | `http://localhost:8081/api/v1` |
| `JWT_SECRET` | Clave secreta para JWT | `secret` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `7d` |
| `AWS_ACCESS_KEY_ID` | AWS Access Key | - |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key | - |
| `AWS_REGION` | Región de AWS | `us-east-1` |
| `AWS_S3_BUCKET` | Nombre del bucket S3 | `caba-arbitros-images` |
| `CORS_ORIGIN` | Origen permitido para CORS | `*` |

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es parte del Taller 02 de la materia [Nombre de la materia].

## 👥 Autores

- **Tu Nombre** - Desarrollo inicial

## 🙏 Agradecimientos

- Proyecto CABA (Spring Boot backend)
- Cátedra de [Nombre de la materia]
- AWS por servicios de cloud

---

**Nota**: Este proyecto es parte de un trabajo académico (Taller 02) y no debe ser usado en producción sin las debidas auditorías de seguridad y pruebas exhaustivas.
