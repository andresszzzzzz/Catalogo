FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# --host expone el server a 0.0.0.0 para que sea visible fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]
