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
- Upstream files we had to touch (the only expected merge conflicts): `angular.json` (theme
  bundle), `src/themes/eager-themes-components.ts`, `src/app/app.menus.ts` (one import + one
  line: `SaceitLinksMenuProvider` in `MenuID.ADMIN`).
- Admin sidebar links (`src/themes/saceit/app/shared/menu/providers/saceit-links.menu.ts`):
  the code only renders them; text/target/icon come from `saceit.adminMenuLinks` in
  `config.prod.yml`, shown to site and collection admins. Nothing configured → nothing shown.

## Protection (GitHub settings, 2026-11-24)

The repository is public (a fork of a public repo cannot be private), so:

| What | Rule |
|---|---|
| branch `saceit` (default) | ruleset "protect saceit branch": no deletion, no force push; changes only through a PR with 1 approval (stale approvals dismissed, the last pusher cannot approve their own push). Org/repo admins may bypass. |
| tags `v*` | ruleset "release tags: admins only": create/move/delete — admins only (a tag builds a release image) |
| Actions | workflows from fork PRs need approval for **every** outside contributor; `GITHUB_TOKEN` read-only by default (`saceit-image.yml` asks for `packages: write` itself and runs only on tags) |

Last line of defence: production runs only the image pinned in
saceit-cluster-deploy `services/dspace/versions.yml` — nothing merged or tagged
here reaches er.saceit.org.ua until that pin is changed there.

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
