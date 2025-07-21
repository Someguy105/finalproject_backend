# Stage 1: Build
FROM node:18 AS builder

WORKDIR /usr/src/app

# Install required system dependencies
RUN apt-get update && apt-get install -y python3 make g++

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18

WORKDIR /usr/src/app

# Install openssl for crypto support
RUN apt-get update && apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Install production dependencies
RUN npm install --production

EXPOSE 10000
CMD ["node", "dist/main.js"]