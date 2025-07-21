# Use official Node.js image
FROM node:18-alpine@sha256:7e2e4b2e8e2b7a2e6e8e2e4b2e8e2b7a2e6e8e2e4b2e8e2b7a2e6e8e2e4b2e8e2

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all files
COPY . .

# Build the project (if using TypeScript)
RUN npm run build

# Expose the port (Render will override this)
EXPOSE 10000

# Start the app
CMD ["node", "dist/main.js"]