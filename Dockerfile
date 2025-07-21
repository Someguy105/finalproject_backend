# Use official Node.js image
FROM node:18-alpine

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