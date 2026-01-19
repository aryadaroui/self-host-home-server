To run the local dev server:

```sh
deno install
deno task dev`
```

## truenas setup

It's expected that there be a dataset at `/mnt/marble/appdata/web-sites/` where the code will be cloned to and run from.

The `pull-deploy` service clones, or if already existing, pulls the latest code from this git repo.

After successful completion, it triggers the two web-sites services to build and run the sites.

Note that the deno adapter doesn't respect the standard `PORT` environment variable, so they're mapped accordingly.

