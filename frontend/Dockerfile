# frontend/Dockerfile

# --- Tahap 1: Build Stage ---
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files dan install dependencies
COPY package*.json ./
RUN npm install

# Copy sisa kode frontend
COPY . .

# Build aplikasi React
RUN npm run build

# --- Tahap 2: Production Stage (Serve using Nginx) ---
FROM nginx:stable-alpine AS production

# Copy hasil build dari tahap sebelumnya ke direktori Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# (Opsional tapi direkomendasikan) Copy konfigurasi Nginx kustom
# agar routing React Router berfungsi saat refresh halaman
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (default Nginx)
EXPOSE 80

# Perintah default Nginx untuk start
CMD ["nginx", "-g", "daemon off;"]