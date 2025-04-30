# 1. Base image
FROM node:20-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and install deps
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the app
COPY . .

# 5. Build the app
RUN npm run build

# 6. Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Only copy the build output and node_modules for production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Optional: expose env variables (can be passed at runtime too)
# ENV MONGO_URI=your_mongo_url
# ENV JWT_SECRET=your_jwt_secret

# 7. Expose port
EXPOSE 3000

# 8. Start the Next.js app
CMD ["npm", "start"]
