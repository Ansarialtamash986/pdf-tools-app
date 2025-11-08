# Use Node.js LTS
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the app source code
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
