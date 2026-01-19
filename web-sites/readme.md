For local testing with colima:

```sh
❯ colima start --runtime docker -p docker

❯ colima list -p docker
PROFILE    STATUS     ARCH       CPUS    MEMORY    DISK      RUNTIME    ADDRESS
docker     Running    aarch64    2       2GiB      100GiB    docker

❯ docker compose -f web-sites/docker-compose.yml up --build
```

There's already an `appdata/web-sites/` dataset in trueNAS for this hosting. Just `cp` the files over there and run the 