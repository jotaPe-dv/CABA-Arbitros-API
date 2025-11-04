# CABA Arbitros API - Project Setup Instructions

## Project Status

- [x] ✅ Verify that the copilot-instructions.md file exists
- [ ] ⏳ Clarify Project Requirements
- [ ] ⏳ Scaffold the Project
- [ ] ⏳ Customize the Project
- [ ] ⏳ Install Required Extensions
- [ ] ⏳ Compile the Project
- [ ] ⏳ Create and Run Task
- [ ] ⏳ Launch the Project
- [ ] ⏳ Ensure Documentation is Complete

## Project Overview

**CABA-Arbitros-API** - Node.js/Express REST API for referee (árbitros) management system. This microservice consumes the Spring Boot backend API and provides referee-specific functionality.

### Technology Stack
- Node.js + Express.js
- TypeScript
- JWT Authentication
- Swagger/OpenAPI
- AWS S3 (referee images)
- Docker + Docker Swarm
- Axios (HTTP client)

### Key Features
- Referee authentication (login/register)
- Dashboard for referees
- Assignments (asignaciones) management
- Settlements (liquidaciones) tracking
- Profile management with S3 images
- Consume Spring Boot API endpoints

### Project Structure
```
src/
  ├── config/        # Configuration files
  ├── controllers/   # Route controllers
  ├── middleware/    # Custom middleware
  ├── models/        # Data models/DTOs
  ├── routes/        # API routes
  ├── services/      # Business logic
  └── utils/         # Helper functions
```

## Next Steps
1. Create TypeScript Node.js project structure
2. Set up Express server with middleware
3. Configure Swagger documentation
4. Implement JWT authentication
5. Create referee endpoints
6. Set up Docker configuration
7. Configure GitHub Actions for DockerHub
