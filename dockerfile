# Usa la imagen base oficial de Node.js
FROM node:20.17.0

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copia solo los archivos necesarios para instalar dependencias primero
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto del código al contenedor
COPY . .

# Expone el puerto 3001
EXPOSE 3001

# Comando por defecto para iniciar la aplicación
CMD ["npm", "start"]
