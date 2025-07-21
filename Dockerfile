# Use official Node.js image
FROM node:18-alpine@sha256:2c40cd44aadd2d6a5835fc1c3d07e60b8b965eef64e5b82a49f19b56a1c5f6a9

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