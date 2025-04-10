FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/tsconfig packages/tsconfig/
COPY services/model-service services/model-service/

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @mcp/model-service build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/services/model-service/dist ./dist
COPY --from=builder /app/services/model-service/package.json ./

RUN npm install -g pnpm
RUN pnpm install --prod

EXPOSE 4001
CMD ["node", "dist/index.js"]
