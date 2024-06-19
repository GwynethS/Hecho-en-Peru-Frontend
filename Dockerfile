# Step 1: We build the angular app using the production configuration
FROM node:latest as build
# Set the working directory
WORKDIR /app
# Copy the package.json and package-lock.json files
COPY package*.json ./
# Run a clean install of the dependencies
RUN npm ci
# Install Angular CLI globally
RUN npm install -g @angular/cli
# Copy all files
COPY . .
# Build the angular app using the production configuration
RUN npm run build --configuration=production    
#Step 2: We use the nginx image to serve the angular app
FROM nginx:latest
# Copy the build output to replace the default nginx contents
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/hecho-en-peru/browser /usr/share/nginx/html

# Expose the port 80
EXPOSE 80

# Build: docker build -t hecho-en-peru .
# Run: docker run -d -p 4200:80 hecho-en-peru