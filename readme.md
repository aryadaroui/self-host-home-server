# aryadee.dev

This repo primarily contains the source, content, and configuration for my
personal website. It also includes some other sites I host for projects and
people in my life.

Since, I self-host, I also have some configuration files for my servers in here
as well.

# domains

- aryadee.dev
  - tech blog
  - dynamic photo gallery with user accounts
  - sveltekit on deno
- nathaliektherapy.com
  - static site
  - sveltekit on deno

# servers

- `pi`
  - Low power HTTPS server
  - Retrieves media from `mu` NAS
  - Raspberry Pi 4B, 8GB RAM
  - served from `server` account
- `mu`
  - Mass storage NAS
  - Eager to sleep; Wake on LAN to conserve power
  - Ingests, stores, and serves media to `pi` HTTPS server
  - i7-6700K, 32GB RAM
  - `/mnt/marble/` LVM on ext4 composed of hot storage SSDs
  - `/mnt/amber/` LVM on ext4 composed of cold storage HDDs
  - served from `server` account

## fs

on pi
```
# account `server`

~/aryadee.dev
~/nathaliektherapy.com
```

on mu
```
# account `server`

~/logs/
  /ingest/
  /backup/
  /heifer/
```

# tools and services

- `heifer`
  - Image server on `mu` that serves thumbnails and resized images from the HEIF and JPEG fullsize originals
- `ingest`
  - Ingests photos and videos from SD cards to `mu` NAS
- `backup.ts`
  - Backs up data from `mu` NAS hot storage to cold storage drives
- `checkup`
  - Checks drive health, disk usage, and other server stats
These should all write to log files.

## External tools

- Caddy
  - Reverse proxy for the domains
- cloudflared
  - Argo tunnel for secure access to the servers without opening firewall ports
- Samba
  - File sharing between my local network devices
