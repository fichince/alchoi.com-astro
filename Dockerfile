# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Astro"

# Astro app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY . .

RUN \
  --mount=type=secret,id=OPENSEARCH_API,env=OPENSEARCH_API \
  --mount=type=secret,id=DIRECTUS_TOKEN,env=DIRECTUS_TOKEN \
  --mount=type=secret,id=DIRECTUS_URL,env=DIRECTUS_URL \
  npm run build

# Build application
#RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ENV PORT=80
ENV HOST=0.0.0.0

# Start the server by default, this can be overwritten at runtime
EXPOSE 80
CMD [ "node", "./dist/server/entry.mjs" ]
