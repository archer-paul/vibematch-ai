# Dockerfile
# Étape 1: Build de l'application
FROM node:18-alpine AS builder

# Installer des dépendances système
RUN apk add --no-cache libc6-compat

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer TOUTES les dépendances (dev + prod) pour pouvoir builder
RUN npm ci --legacy-peer-deps

# Copier le code source
COPY . .

# Builder l'application React avec Vite
RUN npm run build

# Vérifier que le dossier dist existe
RUN ls -la dist/

# Étape 2: Image de production
FROM node:18-alpine AS production

# Installer des dépendances système
RUN apk add --no-cache libc6-compat

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer seulement les dépendances de production
RUN npm ci --legacy-peer-deps --only=production

# Copier le build depuis l'étape précédente
COPY --from=builder /app/dist ./dist

# Copier le serveur
COPY server.js ./

# Exposer le port 8080
EXPOSE 8080

# Variables d'environnement
ENV PORT=8080
ENV NODE_ENV=production

# Démarrer le serveur Express
CMD ["node", "server.js"]