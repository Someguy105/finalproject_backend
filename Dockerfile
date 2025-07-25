# Stage 1: Build
FROM node:18 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-slim

WORKDIR /usr/src/app

# Install required packages for Node.js crypto
RUN apt-get update && \
    apt-get install -y openssl ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Install production dependencies
RUN npm install --production

# Set environment variables for Node.js crypto support
ENV NODE_OPTIONS="--experimental-global-webcrypto"

EXPOSE 10000
CMD ["node", "dist/main.js"]