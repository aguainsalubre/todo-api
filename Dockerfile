# Imagem enxuta baseada em Node LTS
FROM node:20-alpine

WORKDIR /app

# Copia apenas os manifestos primeiro para aproveitar cache de camadas do Docker
COPY package*.json ./
RUN npm install --omit=dev

# Copia o restante do código
COPY src ./src

EXPOSE 3000

# Usuário não-root por boa prática de segurança
USER node

CMD ["node", "src/app.js"]
