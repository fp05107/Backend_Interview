# Event Booking Microservices

A high-performance event booking application using NestJS Microservices (TCP/RabbitMQ) and Next.js 14.

## Structure
- **apps/web**: Next.js 14 Frontend
- **apps/api-gateway**: NestJS HTTP Entry Point
- **apps/auth-service**: Auth Microservice (TCP)
- **apps/event-service**: Event Logic (TCP)
- **apps/booking-service**: Booking Logic (RabbitMQ)
- **packages/shared**: Shared DTOs and Interfaces

## Prerequisites
- Docker
- Node.js > 18
- RabbitMQ, Redis, Postgres (via Docker)

## Setup
1. **Infrastructure**:
   ```bash
   docker-compose up -d
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Database Setup**:
   Ensure databases (`auth_db`, `event_db`, `booking_db`) exist or use the single `booking_db` schema separation (default config uses one DB, schemas can be separated via connection string).
   
   Run Prisma migrations for each service:
   ```bash
   npx prisma db push --schema=apps/auth-service/prisma/schema.prisma
   npx prisma db push --schema=apps/event-service/prisma/schema.prisma
   npx prisma db push --schema=apps/booking-service/prisma/schema.prisma
   ```

## Running
Use Turbo to run all services:
```bash
npm run dev
```
Or run individually:
```bash
nest start api-gateway
nest start auth-service
nest start event-service
nest start booking-service
npm run dev --workspace=apps/web
```
