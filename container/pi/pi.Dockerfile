FROM denoland/deno:debian-2.1.4

# Install Caddy
RUN apt-get update && \
    apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl && \
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg && \
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list && \
    apt-get update && \
    apt-get install -y caddy && \
    rm -rf /var/lib/apt/lists/*

# Create working directories
WORKDIR /app

# Copy both sites
COPY aryadee.dev /app/aryadee.dev
COPY nathaliektherapy.com /app/nathaliektherapy.com

# Copy Caddy configuration
COPY server-configs/pi/Caddyfile /etc/caddy/Caddyfile

# Copy entrypoint script
COPY _container/pi_entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose Caddy ports (HTTP and HTTPS)
EXPOSE 80 443

# Expose SvelteKit app ports for internal use
EXPOSE 7000 8000

ENTRYPOINT ["/entrypoint.sh"]
