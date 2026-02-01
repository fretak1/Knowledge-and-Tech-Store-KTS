FROM node:18-alpine

WORKDIR /app

# Copy dependency definitions
COPY Client/package.json Client/package-lock.json ./Client/

# Install dependencies
WORKDIR /app/Client
RUN npm ci

# Copy source code
COPY Client ./
COPY Server ../Server

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
