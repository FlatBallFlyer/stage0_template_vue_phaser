#!/bin/sh

# Set default values for environment variables if not provided
export API_HOST=${API_HOST:-localhost}
export API_PORT=${API_PORT:-8184}

# Substitute environment variables in nginx configuration
envsubst '${API_HOST} ${API_PORT}' < /etc/nginx/nginx.conf.template > /tmp/nginx.conf

# Inject API_HOST and API_PORT into index.html for client-side use
# This allows the SPA to construct the dev-login URL in container mode
HTML_FILE="/usr/share/nginx/html/index.html"
if [ -f "$HTML_FILE" ]; then
  # Create injection script with environment variables
  INJECT_SCRIPT="<script>window.API_HOST='${API_HOST}';window.API_PORT='${API_PORT}';</script>"
  # Inject before closing </head> tag, or at start of <body> if no </head>
  if grep -q "</head>" "$HTML_FILE"; then
    sed -i "s|</head>|${INJECT_SCRIPT}</head>|" "$HTML_FILE"
  else
    sed -i "s|<body>|<body>${INJECT_SCRIPT}|" "$HTML_FILE"
  fi
fi

# Start nginx with the substituted configuration
exec nginx -g "daemon off;" -c /tmp/nginx.conf

