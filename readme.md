This repo primarily contains the source, content, and configuration for my
personal website. It also includes some other sites I host for projects and
people in my life.

# websites

- photos.aryadee.dev
  - immich photo gallery
- aryadee.dev & www.aryadee.dev
  - tech blog
  - sveltekit on deno
- nathaliektherapy.com & www.nathaliektherapy.com
  - therapy profile
  - sveltekit on deno

# apps

- immich
  - self-hosted photo gallery
- web-gateway
  - caddy reverse proxy and cloudflare tunnel for the servers
- web-sites
  - sveltekit sites

Note: Immich should be installed via the direction from the trunas community app, and its associated [docs](https://docs.immich.app/install/truenas/). The other two apps are installed via custom docker-compose setups described in their respective readmes.

# server

- `truenas`
  - Mass storage NAS
  - i7-6700K, 32GB RAM
  - Pool "marble"
    - Hot storage
    - Multiple VDEVs of different size SSDs
    - `/mnt/marble/` 
  - Pool "amber"
    - Cold storage. Backed up nightly from "marble"
    - Single VDEV of mirrored HDDs

