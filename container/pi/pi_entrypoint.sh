#!/bin/bash
set -e

echo "Starting pi server services..."

# Build both SvelteKit sites
echo "Building aryadee.dev..."
cd /app/aryadee.dev
deno install
deno task build

echo "Building nathaliektherapy.com..."
cd /app/nathaliektherapy.com
deno install
deno task build

# Start Caddy in the background
echo "Starting Caddy reverse proxy..."
caddy run --config /etc/caddy/Caddyfile &
CADDY_PID=$!

# Start aryadee.dev on port 7000
echo "Starting aryadee.dev on port 7000..."
cd /app/aryadee.dev
HOST=0.0.0.0 PORT=7000 deno task preview &
ARYADEE_PID=$!

# Start nathaliektherapy.com on port 8000
echo "Starting nathaliektherapy.com on port 8000..."
cd /app/nathaliektherapy.com
HOST=0.0.0.0 PORT=8000 deno task preview &
NATHALIE_PID=$!

# Wait for all processes
echo "All services started. Waiting for processes..."
wait $CADDY_PID $ARYADEE_PID $NATHALIE_PID
