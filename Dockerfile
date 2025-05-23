FROM node:20-alpine AS builder

USER node
WORKDIR /home/node

COPY package.json package.json
COPY package-lock.json package-lock.json

COPY --chown=node:node . .

# Définir la variable d'environnement pour les cibles binaires avant de générer le client Prisma
ENV PRISMA_BINARY_TARGETS="linux-musl-openssl-3.0.x"

RUN npx prisma generate  # Génère le client Prisma avec le bon moteur
RUN npm run build
RUN ls -l dist

RUN rm -rf node_modules
ENV NODE_ENV=production
RUN npm ci --production

# Deuxième étape avec l'image `node:20-alpine` pour garder `musl`
FROM node:20-alpine

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

RUN npm install bcrypt@5.0.1  # Installation de bcrypt après la copie

EXPOSE 3000

CMD ["node", "dist/main.js"]