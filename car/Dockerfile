# Stage 1: Optional builder (can be used if you add pre-processing or tooling later)
FROM node:alpine as builder
WORKDIR /app

# Copy everything to the container
COPY . .

# In this plain setup, we don't need to install anything or run a build,
# but this stage is left here for future use if needed (e.g., using a bundler like Parcel, Vite, etc.)

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the static files to Nginx web root
COPY --from=builder /app /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
