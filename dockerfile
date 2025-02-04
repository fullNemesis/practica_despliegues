# Use an official Node.js runtime as a parent image
FROM node:20.17.0

# Crea un directorio llamado "app" en la ruta /usr/src/ con la opción -p para asegurar que se crean todos los subdirectorios, incluso si ya existen.
RUN mkdir-p /usr/src/app

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]