# Stage 1: Build React App
FROM node:22-alpine AS builder

LABEL MAINTAINER="Lorin Urbantat"
LABEL org.opencontainers.image.source https://github.com/ghollbeck/Elect-O-Mate/

# Install Git (required for certain npm packages)
RUN apk add --no-cache git

# Set build-time argument for backend URL
ARG BACKEND_URL=https://backend.elect-o-mate.eu
ENV REACT_APP_BACKEND_URL=$BACKEND_URL

WORKDIR /app

# Copy dependency files
COPY package.json yarn.lock ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the project for production
RUN npm run build

# Stage 2: Serve the React app using Nginx
FROM nginx:stable-alpine3.19

# Copy built files from the builder stage to Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Replace the default Nginx configuration with your custom configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
