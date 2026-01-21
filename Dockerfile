# use the official Bun image
FROM oven/bun:latest

# create a directory for the project
WORKDIR /app
COPY . .

RUN bun install
RUN bun run build

#build web frontend
WORKDIR /app/web
COPY web/package.json web/bun.lockb* ./
COPY web/ ./
RUN bun run build

#install backend dependencies
WORKDIR /app/backend
COPY backend/package.json backend/bun.lockb* ./
RUN bun install --frozen-lockfile
COPY backend/ ./

# expose port
EXPOSE 3000

# set non-sensitive defaults

ENV PORT=3000
ENV NODE_ENV=production

# start the application
CMD ["bun", "index.ts"]
