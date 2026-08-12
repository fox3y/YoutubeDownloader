# Multi-stage build for VideoFlow

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm install

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build the application
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Install yt-dlp and FFmpeg
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    && pip3 install --no-cache-dir yt-dlp

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production && npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Create downloads directory
RUN mkdir -p /app/downloads

# Create non-root user
RUN addgroup -g 1001 -S videoflow && \
    adduser -S -u 1001 -G videoflow videoflow

# Change ownership
RUN chown -R videoflow:videoflow /app

# Switch to non-root user
USER videoflow

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV YTDLP_PATH=yt-dlp
ENV FFMPEG_PATH=ffmpeg
ENV CORS_ORIGIN=*

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/server.js"]
