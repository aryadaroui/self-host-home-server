# Mu

Generally, the server is composed of several SSDs and HDDS.
the device `marble` is an LVM group that contains several SSDs. and `amber` is just a single HDD (for now).

Marble is backed up on amber every night.

It's also a NAS with SMB.


# Setup
Sadly, there's a lot of setup that is difficult to automate. Here's what needs to be done:

## Storage

### SSDs

we need lvm2 to manage the storage devices.
```bash
sudo apt install lvm2
```

assuming the devices are `/dev/sdb`, `/dev/sdc`, `/dev/sdd`, and `/dev/sde`, we create physical volumes:

```bash
sudo pvcreate /dev/sdb /dev/sdc /dev/sdd /dev/sde
```

then we create a volume group called `marble_vg`:

```bash
sudo vgcreate marble_vg /dev/sdb /dev/sdc /dev/sdd /dev/sde
```

then we create a logical volume called `marble_lv` with 100% of the free space:

```bash
sudo lvcreate -l 100%FREE -n marble_lv marble_vg
```

Format the logical volume with ext4

```bash
sudo mkfs.ext4 /dev/marble_vg/marble_lv
```

Create a mount point and mount the logical volume:

```bash
sudo mkdir -p /mnt/marble
sudo mount /dev/marble_vg/marble /mnt/marble_lv
```

Label the device for easier mounting

```bash
sudo e2label /dev/marble_vg/marble_lv marble
```

Edit /etc/fstab for auto-mount at boot. This command appends the necessary line to the file:
```bash
echo '/dev/marble_vg/marble_lv /mnt/marble ext4 defaults 0 2' | sudo tee -a /etc/fstab
```

### HDDs

Assuming the HDD is `/dev/sda`, we want it to have a single partition `sda1` that takes up the whole disk. That can be done with fdisk or parted, but here we use `parted`:
```bash
sudo parted /dev/sda  mklabel gpt
sudo parted -a opt /dev/sda mkpart primary ext4 0% 100%
```

Then we format the partition with ext4 and label it `amber`:
```bash
sudo mkfs.ext4 /dev/sda1
sudo e2label /dev/sda1 amber
```

Then we create a mount point and mount the partition:
```bash
sudo mkdir -p /mnt/amber
sudo mount /dev/sda1 /mnt/amber
```

Edit /etc/fstab for auto-mount at boot. This command appends the necessary line to the file:
```bash
echo '/dev/sda1 /mnt/amber ext4 defaults 0 2' | sudo tee -a /etc/fstab
```

### Samba

make sure to install samba
```bash
sudo apt install samba
```

Then we need to edit the Samba configuration file `/etc/samba/smb.conf` to share the directories. A simple configuration to use presuming `aryadaroui` is the only user is available in this repo at `smb.conf`:

Then restart the Samba service to apply the changes:
```bash
sudo systemctl restart smbd
```

Then connect on macOS via `smb://mu`

### Backing up marble on amber

We want to back up the `marble` directory on `amber` every night. We can use `rsync` for this, which should already be installed. The script for this is available in this repo at `amber_nightly.sh`. You might have to make it executable:
```bash
chmod +x ./amber_nightly.sh
```

Set up a cron job to run the script every night at 2 AM:

```bash
sudo crontab -e
# Add the following line to the crontab file:
0 2 * * * /home/aryadaroui/amber_nightly.sh
```

## server account
A new account `server` to run the server. Its R/W access should be limited to `/mnt/marble/photo_database/`.

### Setting permissions

marble and amber should be owned by `aryadaroui`

```bash
sudo chown -R aryadaroui:aryadaroui /mnt/marble /mnt/amber
sudo chmod -R u+rwX,g+rwX,o-rwx /mnt/marble /mnt/amber
```

But we want the server account to have access to `/mnt/marble/photo_database/` only. So we create a new group `photodb` and add `aryadaroui` and `server` to it:

```bash
sudo groupadd photodb
sudo usermod -aG photodb aryadaroui
sudo usermod -aG photodb server
```

Then we change the ownership of the `photo_database` directory to the `photodb` group:

```bash
sudo chown -R aryadaroui:photodb /mnt/marble/photo_database
sudo chmod -R 2775 /mnt/marble/photo_database
```
The 2 at the start of 2775 sets the “setgid” bit, so new files/directories created inside will automatically inherit the photodb group — no future surprises!

## General setup

Set timezone to America/Los_Angeles

```bash
sudo timedatectl set-timezone America/Los_Angeles
```

### Reverse Proxy

We'll need to install Caddy for reverse proxying and serving the web apps. Instructions here: https://caddyserver.com/docs/install

Should be as simple as:

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### Cloudflare tunnel

Must install the `cloudflared` package. https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/; at time of writing it's recommended to download it / use instructions from https://pkg.cloudflare.com/index.html.

after doing that, run the following command to authenticate with Cloudflare:

```bash
cloudflared tunnel login
```

That'll want you to open a browser and log in to your Cloudflare account. After logging in, you'll be prompted to select a zone (domain) to use with the tunnel. Select the appropriate domain (even if you have multiple domains, you can use the same tunnel for all of them).


Then create a tunnel:
```bash
cloudflared tunnel create mu-tunnel
```
This outputs a tunnel UUID. You’ll use this in configs.

Then create a configuration file at `/usr/local/etc/cloudflared/config.yml`. Most guides seems to recommend `/etc/cloudflared/config.yml`, so that may work too, but I already had a directory in `/usr/local/etc/cloudflared/` so I used that. The file should look the one in this repo at `config.yml`, with the tunnel UUID filled in. I'm unsure if it's supposed to be `yml` or `yaml` extension.

This configuration file tells Cloudflare to route requests to port 443, which is where Caddy will be listening, for the specified hostnames. The `originServerName` is optional but can help with SSL/TLS verification. The hostname should be a DNS record you already have in Cloudflare.

Tell Cloudflare to route traffic for those hostnames to the tunnel:
```bash
cloudflared tunnel route dns mu-tunnel aryadee.dev
cloudflared tunnel route dns mu-tunnel nathaliektherapy.com
```

Then run the tunnel as a service:
```bash
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

### UPS

I have a APC UPS. There's an `apcupsd` package that can be installed to manage it. Install it with:
```bash
sudo apt install apcupsd
```

Then edit the configuration file `/etc/apcupsd/apcupsd.conf`. This was kind of magical, but the device was automatically detected via USB and the configuration file was set up except I had to set the `DEVICE` line to empty.

```bash
# /etc/apcupsd/apcupsd.conf
UPSTYPE usb
DEVICE
```

Then check the status of the UPS with:
```bash
apcaccess status
```
