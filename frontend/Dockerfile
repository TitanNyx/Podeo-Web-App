# Stage 1: Build the Angular app
FROM node:18 AS build
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install
# Copy the rest of the application code
COPY . .
# Build the Angular app for production
RUN npm run build --prod

# Stage 2: Serve the built app using Nginx
FROM nginx:alpine
# Copy the build output from Stage 1 to Nginx's default folder
COPY --from=build /app/dist/podeo-web-app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]