# Guía Rápida de Despliegue - CABA Arbitros API

## 🚀 Despliegue Paso a Paso

### Parte 1: Configuración Local (5 minutos)

```bash
# 1. Instalar dependencias
cd CABA-Arbitros-API
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 3. Probar localmente
npm run dev
# Verificar: http://localhost:3000/health
# Swagger: http://localhost:3000/api-docs
```

---

### Parte 2: Docker Local (5 minutos)

```bash
# 1. Build imagen
docker build -t caba-arbitros-api:latest .

# 2. Ejecutar contenedor
docker run -p 3000:3000 --env-file .env caba-arbitros-api:latest

# 3. Verificar
curl http://localhost:3000/health

# O con docker-compose
docker-compose up -d
docker-compose logs -f
```

---

### Parte 3: GitHub + DockerHub (10 minutos)

```bash
# 1. Crear repo en GitHub
git init
git add .
git commit -m "Initial commit - Taller 02"
git remote add origin https://github.com/[tu-usuario]/CABA-Arbitros-API.git
git push -u origin main

# 2. Configurar Secrets en GitHub
# Settings → Secrets and variables → Actions → New repository secret
# - DOCKERHUB_USERNAME: tu usuario de DockerHub
# - DOCKERHUB_TOKEN: token de acceso de DockerHub

# 3. Push trigger CI/CD
git push origin main
# GitHub Actions automáticamente:
# - Builds Docker image
# - Push to DockerHub
```

---

### Parte 4: AWS EC2 Setup (15 minutos)

#### Paso 1: Lanzar EC2 Instances

1. **AWS Console → EC2 → Launch Instance**
2. **Configuración**:
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: t2.micro (Free Tier)
   - Quantity: 4 instances
   - Key pair: Crear o seleccionar existente
   - Security Group: Permitir puertos 22, 2377, 3000, 7946
   - Storage: 8 GB (default)

3. **Security Group Rules**:
```
Type            Protocol    Port Range    Source
SSH             TCP         22            0.0.0.0/0
Custom TCP      TCP         2377          0.0.0.0/0  (Swarm management)
Custom TCP      TCP         3000          0.0.0.0/0  (API)
Custom TCP      TCP         7946          0.0.0.0/0  (Container network discovery)
Custom UDP      UDP         7946          0.0.0.0/0  (Container network discovery)
Custom UDP      UDP         4789          0.0.0.0/0  (Container overlay network)
```

#### Paso 2: Instalar Docker en TODAS las instancias

```bash
# SSH a cada instancia
ssh -i "your-key.pem" ubuntu@<EC2_PUBLIC_IP>

# Ejecutar en cada una:
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu

# Logout y login para aplicar cambios
exit
ssh -i "your-key.pem" ubuntu@<EC2_PUBLIC_IP>

# Verificar
docker --version
```

---

### Parte 5: Docker Swarm (10 minutos)

#### Paso 1: Inicializar Swarm (solo en Manager)

```bash
# SSH al Manager node
ssh -i "your-key.pem" ubuntu@<MANAGER_PUBLIC_IP>

# Obtener IP privada
hostname -I
# Output: 172.31.xx.xx (usar esta IP)

# Inicializar Swarm
docker swarm init --advertise-addr 172.31.xx.xx

# GUARDAR el comando de join que aparece:
# docker swarm join --token SWMTKN-1-xxxxxxxxx 172.31.xx.xx:2377
```

#### Paso 2: Unir Workers (en cada worker)

```bash
# SSH a Worker 1
ssh -i "your-key.pem" ubuntu@<WORKER1_PUBLIC_IP>
docker swarm join --token SWMTKN-1-xxxxxxxxx 172.31.xx.xx:2377

# SSH a Worker 2
ssh -i "your-key.pem" ubuntu@<WORKER2_PUBLIC_IP>
docker swarm join --token SWMTKN-1-xxxxxxxxx 172.31.xx.xx:2377

# SSH a Worker 3
ssh -i "your-key.pem" ubuntu@<WORKER3_PUBLIC_IP>
docker swarm join --token SWMTKN-1-xxxxxxxxx 172.31.xx.xx:2377
```

#### Paso 3: Verificar Cluster (en Manager)

```bash
# Volver al Manager
ssh -i "your-key.pem" ubuntu@<MANAGER_PUBLIC_IP>

# Ver nodos
docker node ls

# Output esperado:
# ID               HOSTNAME    STATUS    AVAILABILITY    MANAGER STATUS
# abc123...  *     ip-172-...  Ready     Active          Leader
# def456...        ip-172-...  Ready     Active
# ghi789...        ip-172-...  Ready     Active
# jkl012...        ip-172-...  Ready     Active
```

---

### Parte 6: Desplegar Servicio (5 minutos)

#### Opción A: Con variables individuales

```bash
# En Manager node
docker service create \
  --name caba-arbitros-api \
  --replicas 10 \
  --publish 3000:3000 \
  --env NODE_ENV=production \
  --env PORT=3000 \
  --env SPRING_BOOT_API_URL=http://[SPRING_IP]:8081/api/v1 \
  --env JWT_SECRET=tu-super-secret-key-aqui \
  --env JWT_EXPIRES_IN=7d \
  --env AWS_ACCESS_KEY_ID=tu-aws-key \
  --env AWS_SECRET_ACCESS_KEY=tu-aws-secret \
  --env AWS_REGION=us-east-1 \
  --env AWS_S3_BUCKET=caba-arbitros-images \
  --env CORS_ORIGIN=* \
  [dockerhub-usuario]/caba-arbitros-api:latest
```

#### Opción B: Con archivo .env

```bash
# 1. Crear .env en Manager
nano .env
# Pegar contenido de tu .env local

# 2. Crear secret
docker secret create api_env .env

# 3. Deploy con secret
docker service create \
  --name caba-arbitros-api \
  --replicas 10 \
  --publish 3000:3000 \
  --secret api_env \
  [dockerhub-usuario]/caba-arbitros-api:latest
```

---

### Parte 7: Verificación (5 minutos)

```bash
# 1. Ver servicios
docker service ls

# 2. Ver réplicas
docker service ps caba-arbitros-api

# 3. Ver logs
docker service logs caba-arbitros-api -f

# 4. Verificar distribución
docker service ps caba-arbitros-api --format "table {{.Name}}\t{{.Node}}\t{{.CurrentState}}"

# 5. Test API
curl http://<MANAGER_PUBLIC_IP>:3000/health

# 6. Test load balancing (múltiples requests)
for i in {1..10}; do
  curl -s http://<MANAGER_PUBLIC_IP>:3000/health | jq .containerID
done
# Deberías ver diferentes container IDs
```

---

## 🔧 Comandos Útiles

### Gestión del Servicio

```bash
# Ver estado
docker service ls
docker service ps caba-arbitros-api

# Escalar
docker service scale caba-arbitros-api=15

# Actualizar imagen
docker service update --image [dockerhub-usuario]/caba-arbitros-api:v2 caba-arbitros-api

# Ver logs
docker service logs caba-arbitros-api -f --tail 100

# Remover servicio
docker service rm caba-arbitros-api
```

### Gestión del Swarm

```bash
# Ver nodos
docker node ls

# Promover a Manager
docker node promote <NODE_ID>

# Degradar a Worker
docker node demote <NODE_ID>

# Drenar nodo (maintenance)
docker node update --availability drain <NODE_ID>

# Activar nodo
docker node update --availability active <NODE_ID>

# Abandonar Swarm (en worker)
docker swarm leave

# Remover nodo (en manager)
docker node rm <NODE_ID>
```

### Troubleshooting

```bash
# Ver logs de container específico
docker ps  # en cualquier nodo
docker logs <CONTAINER_ID>

# Inspeccionar servicio
docker service inspect caba-arbitros-api

# Ver tareas fallidas
docker service ps caba-arbitros-api --filter "desired-state=shutdown"

# Forzar recreación
docker service update --force caba-arbitros-api

# Network inspect
docker network ls
docker network inspect ingress
```

---

## 📊 Verificación de Requisitos

### Checklist Final

- [ ] **Código fuente**: Repositorio GitHub completo
- [ ] **Docker**: Imagen en DockerHub
- [ ] **EC2**: 4 instancias running
- [ ] **Swarm**: Cluster inicializado (1 manager + 3 workers)
- [ ] **Servicio**: 10 réplicas desplegadas
- [ ] **Load Balancing**: Container IDs varían entre requests
- [ ] **Health Check**: Responde OK en todas las réplicas
- [ ] **Swagger**: Accesible en http://[IP]:3000/api-docs
- [ ] **Screenshots**: Capturados (service ps, health check, etc.)
- [ ] **README**: Documentación completa
- [ ] **TALLER02_SUBMISSION.md**: Documento entregable

---

## 🆘 Problemas Comunes

### 1. "Cannot connect to Docker daemon"
```bash
sudo systemctl start docker
sudo usermod -aG docker ubuntu
# Logout y login
```

### 2. "No space left on device"
```bash
docker system prune -a
```

### 3. "Error response from daemon: rpc error"
```bash
# Verificar puertos de Swarm abiertos en Security Group
# 2377, 7946, 4789
```

### 4. "Service failed to deploy"
```bash
docker service logs caba-arbitros-api
# Verificar variables de entorno
```

### 5. "Health check failing"
```bash
# SSH a un nodo con réplica
docker ps
docker logs <CONTAINER_ID>
# Verificar que Spring Boot API esté accesible
```

---

## 📸 Screenshots a Capturar

1. **GitHub Actions**: Workflow exitoso
2. **DockerHub**: Imagen publicada
3. **EC2 Console**: 4 instancias running
4. **docker node ls**: Cluster Swarm
5. **docker service ps**: 10 réplicas distribuidas
6. **curl /health**: Container ID único
7. **Swagger UI**: /api-docs accesible
8. **Load Balancing**: Múltiples Container IDs diferentes

---

## ⏱️ Tiempo Estimado Total

| Fase | Tiempo |
|------|--------|
| Setup Local | 5 min |
| Docker Local | 5 min |
| GitHub + DockerHub | 10 min |
| AWS EC2 Launch | 15 min |
| Docker Install | 10 min |
| Swarm Setup | 10 min |
| Deploy Service | 5 min |
| Verificación | 5 min |
| **TOTAL** | **65 min** (~1 hora) |

---

**¡Éxito en tu Taller 02! 🚀**
