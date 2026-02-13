# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install git (needed for GitHub npm packages)
RUN apk add --no-cache git

# Copy package.json first (for better layer caching)
# Don't copy package-lock.json if it has file: references - we'll regenerate it
COPY package.json ./

# Set up .npmrc for GitHub npm packages
# Uses GITHUB_TOKEN from build arg (CI uses GH_PAT, local can use GITHUB_TOKEN env var)
# Note: ARG values don't persist to RUN commands, so we need to pass it as env var
ARG GITHUB_TOKEN=
ENV GITHUB_TOKEN=${GITHUB_TOKEN}
RUN if [ -z "$GITHUB_TOKEN" ]; then \
        echo "ERROR: GITHUB_TOKEN build arg is required for private GitHub npm packages" >&2 && \
        echo "For local builds, use: export GITHUB_TOKEN=\$(cat ~/.DeveloperEdition/GITHUB_TOKEN)" >&2 && \
        exit 1; \
    fi && \
    echo "@agile-learning-institute:registry=https://npm.pkg.github.com" > .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc && \
    chmod 600 .npmrc && \
    echo ".npmrc created successfully"

# Ensure package.json uses exact published version for Docker build
# Replace both file: references and version ranges with exact version
# Note: For GitHub npm packages, use exact version (not ^) for better compatibility
ARG SPA_UTILS_VERSION=0.2.0
RUN sed -i \
        -e "s|\"@agile-learning-institute/spa_utils\": \"file:[^\"]*\"|\"@agile-learning-institute/spa_utils\": \"${SPA_UTILS_VERSION}\"|g" \
        -e "s|\"@agile-learning-institute/spa_utils\": \"\\^[^\"]*\"|\"@agile-learning-institute/spa_utils\": \"${SPA_UTILS_VERSION}\"|g" \
        -e "s|\"@agile-learning-institute/spa_utils\": \"~[^\"]*\"|\"@agile-learning-institute/spa_utils\": \"${SPA_UTILS_VERSION}\"|g" \
        package.json && \
    echo "Package.json after version update:" && \
    grep "@agile-learning-institute/spa_utils" package.json

# Install dependencies
# Use npm install (not npm ci) to regenerate package-lock.json without file: references
# This ensures we get the published package from GitHub npm registry
RUN echo "Installing dependencies..." && \
    echo "Checking .npmrc:" && cat .npmrc | sed 's/authToken=.*/authToken=***/' && \
    rm -f package-lock.json && \
    npm install 2>&1 | tee /tmp/npm-install.log || (echo "npm install failed. Full log:" && cat /tmp/npm-install.log && exit 1)

# Verify spa_utils package is installed and show details
RUN echo "Verifying spa_utils installation..." && \
    if npm list @agile-learning-institute/spa_utils 2>/dev/null; then \
        echo "✓ spa_utils package found"; \
        npm list @agile-learning-institute/spa_utils; \
    else \
        echo "✗ spa_utils package NOT found"; \
        echo "Checking node_modules structure:"; \
        ls -la node_modules/ | head -20 || true; \
        ls -la node_modules/@agile-learning-institute/ 2>&1 || echo "node_modules/@agile-learning-institute/ does not exist"; \
        echo "Checking package.json:"; \
        grep -A 2 "@agile-learning-institute/spa_utils" package.json || true; \
        echo "Checking npm registry config:"; \
        npm config get registry || true; \
        npm config get @agile-learning-institute:registry || true; \
        exit 1; \
    fi

# Copy source code
COPY . .
RUN npm run build

# Get branch and patch level, then create patch.txt file
RUN DATE=$(date "+%Y-%m-%d:%H:%M:%S") && \
    echo $DATE > ./dist/patch.txt

# Deployment stage
FROM nginx:stable-alpine AS deploy

LABEL org.opencontainers.image.source="https://github.com/agile-learning-institute/mentorhub_sample_spa"

# Default Environment Variable values
ENV API_HOST=localhost
ENV API_PORT=8184

# Copy built assets from build stage to nginx serving directory
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 80 (nginx listens on 80 inside container)
EXPOSE 80

# Start nginx with environment variable substitution
CMD ["/start.sh"]