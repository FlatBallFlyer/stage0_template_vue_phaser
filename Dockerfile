# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./

# .npmrc for GitHub Packages - GITHUB_TOKEN required (build fails if missing)
ARG GITHUB_TOKEN
RUN echo "@{{org.git_org}}:registry=https://npm.pkg.github.com" > .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc

# Pin spa_utils version for reproducible builds
ARG SPA_UTILS_VERSION=0.1.0
RUN sed -i "s|\"@{{org.git_org}}/{{info.slug}}_spa_utils\": \"[^\"]*\"|\"@{{org.git_org}}/{{info.slug}}_spa_utils\": \"${SPA_UTILS_VERSION}\"|g" package.json

RUN npm install

COPY . .
RUN npm run build

RUN DATE=$(date "+%Y-%m-%d:%H:%M:%S") && echo "$DATE" > ./dist/patch.txt

# Deploy stage
FROM nginx:stable-alpine

LABEL org.opencontainers.image.source="{{org.git_host}}/{{org.git_org}}/{{info.slug}}_{{service.name}}_spa"

ENV API_HOST={{info.slug}}_{{service.name}}_api
ENV API_PORT={{repo.port - 1}}

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# envsubst for runtime config; inject API_HOST/PORT into index.html for SPA
RUN apk add --no-cache gettext

EXPOSE 80

# Native config: envsubst + index.html injection + nginx (no custom start script)
CMD sh -c "envsubst '${API_HOST} ${API_PORT}' < /etc/nginx/nginx.conf.template > /tmp/nginx.conf && \
  sed -i \"s|</head>|<script>window.API_HOST='${API_HOST}';window.API_PORT='${API_PORT}';</script></head>|\" /usr/share/nginx/html/index.html 2>/dev/null || true && \
  exec nginx -g 'daemon off;' -c /tmp/nginx.conf"