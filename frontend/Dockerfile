FROM node:18

# Install PM2 globally
RUN npm install -g pm2

WORKDIR /usr/src/app

# Copy package files and configuration
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY ecosystem.config.js ./

# Install dependencies
RUN npm install

RUN mkdir -p logs

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Start the app using PM2
CMD ["pm2-runtime", "ecosystem.config.js"]