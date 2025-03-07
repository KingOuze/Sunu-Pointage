# Utiliser l'image de base Node.js
FROM node:18

# Créer un répertoire pour l'application
WORKDIR /usr/src/app

# Copier les fichiers de dépendance
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port sur lequel l'application va tourner
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["node", "server.js"]