# backend/Dockerfile

# --- Tahap 1: Base Node Image ---
FROM node:18-alpine AS base
WORKDIR /app

# Copy package files dan install dependencies
COPY package*.json ./
RUN npm install

# --- Tahap 2: Development (jika perlu) ---
# Bisa digunakan jika ingin menjalankan dengan nodemon di dalam container
# FROM base AS development
# COPY . .
# EXPOSE 5000
# CMD ["npm", "run", "dev"]

# --- Tahap 3: Production (disarankan) ---
FROM base AS production
COPY . .
EXPOSE 5000
# Jalankan server menggunakan node langsung (lebih ringan)
CMD ["node", "server.js"]