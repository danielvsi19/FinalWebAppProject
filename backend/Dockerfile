FROM node:18

# Install PM2 globally
RUN npm install -g pm2

WORKDIR /usr/src/app

# Copy package files and configuration
COPY package*.json ./
COPY tsconfig.json ./
COPY ecosystem.config.js ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3000

# Start the app using PM2
CMD ["pm2-runtime", "ecosystem.config.js"]