## truenas setup

## caddy

it's expected that there be a dataset at `/mnt/marble/appdata/web-gateway/`. In the dataset, there must be subdirs:
- `caddy_data`
- `caddy_config`

The Caddyfile must be placed at `/mnt/marble/appdata/web-gateway/Caddyfile`.

## cloudflared

Create the tunnel token on cloudflare, and set it in the cloudflared service.

Create the application routes for the tunnel, setting the subdomain as desired, but the service must be `http://caddy:80`. The Caddyfile will appropriately convert it to https.
