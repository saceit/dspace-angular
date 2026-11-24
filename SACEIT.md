# SACEIT fork of dspace-angular

The DSpace UI of the SACEIT institutional repository (`https://er.saceit.org.ua`).
Deployed from [kuzik/saceit-cluster-deploy](https://github.com/kuzik/saceit-cluster-deploy)
(`services/dspace/`), which pins the image version.

## Branches and tags

| What | Where |
|---|---|
| Our code | branch **`saceit`** (default branch of this fork) = an upstream release tag + our commits |
| Upstream | remote `upstream` = `DSpace/dspace-angular`; its release tags `dspace-X.Y` |
| A release of ours | git tag `vX.Y-saceit.N` on `saceit` → CI (`.github/workflows/saceit-image.yml`) → `ghcr.io/kuzik/dspace-angular:X.Y-saceit.N` |

`main` is untouched upstream history; nothing of ours goes there.

## Rules that keep upgrades cheap

- All look-and-feel changes live in **`src/themes/saceit/`** (and translation overrides).
  Do not edit `src/app/` or the `dspace`/`custom` base themes — every such edit becomes a merge
  conflict on the next upgrade.
- Runtime settings (REST URL, languages, …) are NOT baked in here: they come from
  `config.prod.yml` in saceit-cluster-deploy, mounted into the container.
- Upstream workflows are disabled in this fork (`gh workflow disable`), not deleted.

## Upgrade to a new DSpace release

```bash
git fetch upstream tag dspace-10.2 --no-tags
git switch saceit && git merge dspace-10.2      # conflicts only where we touched upstream files
npm ci && npm run build:prod                     # optional local check (~4 GB RAM)
git push && git tag v10.2-saceit.1 && git push origin v10.2-saceit.1
```

Then in saceit-cluster-deploy: bump the UI image **and** the backend/Solr images to the same
DSpace version in `services/dspace/versions.yml` (DSpace requires both upgraded together),
`make dspace-check`, backup, `make dspace-deploy`.
