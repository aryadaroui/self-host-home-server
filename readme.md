This repo primarily contains the source, content, and configuration for my
personal website. It also includes some other sites I host for projects and
people in my life.

# domains

- photos.aryadee.dev
  - immich photo gallery
- aryadee.dev & www.aryadee.dev
  - tech blog
  - sveltekit on deno
- nathaliektherapy.com & www.nathaliektherapy.com
  - static site
  - sveltekit on deno

# apps

- immich
  - self-hosted photo gallery
- web-gateway
  - reverse proxy and cloudflare tunnel for the servers
- web-sites
  - sveltekit sites

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
