# CI/CD: GitHub Actions → VPS

This repository deploys only after the `main` push has passed type checking,
tests, and a production Vite build. Pull requests run the same verification but
never receive SSH credentials or deploy. No private key is stored in Git.

## Fill in these placeholders before the first deployment

| Placeholder | Where it is used | Value to provide |
| --- | --- | --- |
| `YOUR_DOMAIN` | `deploy/nginx-inner-architect.conf.example` | The purchased domain, for example `example.com` |
| `/var/www/inner-architect` | Nginx config and `DEPLOY_ROOT` | A dedicated absolute directory owned by the deploy user |
| `DEPLOY_HOST` | GitHub Actions secret | VPS IP address or SSH hostname |
| `DEPLOY_PORT` | GitHub Actions secret | SSH port, normally `22` |
| `DEPLOY_USER` | GitHub Actions secret | Restricted Linux deployment account |
| contact URLs | GitHub Actions secrets | Approved public Zalo and Facebook URLs |

Do not edit the workflow with real values. Add them as repository secrets in
**GitHub → Settings → Secrets and variables → Actions → Secrets**:

- `DEPLOY_HOST`
- `DEPLOY_PORT`
- `DEPLOY_USER`
- `DEPLOY_ROOT` (for example `/var/www/inner-architect`)
- `DEPLOY_SSH_PRIVATE_KEY` (the private half of a dedicated ED25519 key)
- `DEPLOY_SSH_KNOWN_HOSTS` (the exact `ssh-keyscan -H VPS_HOST` output obtained
  from a trusted connection)
- `VITE_CONTACT_ZALO_URL`
- `VITE_CONTACT_FACEBOOK_URL`

`VITE_*` values are intentionally public after the frontend is built; only put
public destination URLs there. The `.env.example` file is a local reference,
not a credential store.

## VPS setup (Ubuntu/Debian template)

Replace the placeholders locally before running commands. These commands are
instructions only; the workflow does not create users, change DNS, or configure
the VPS automatically.

```bash
sudo adduser --disabled-password --gecos '' deploy
sudo install -d -o deploy -g deploy -m 0755 /var/www/inner-architect/releases
sudo -u deploy mkdir -p /var/www/inner-architect/releases
sudo install -d -o root -g root -m 0755 /etc/nginx/sites-available
```

Create a dedicated key on your own machine, then append only its public key to
`/home/deploy/.ssh/authorized_keys` on the VPS:

```bash
ssh-keygen -t ed25519 -C 'github-actions-inner-architect' -f ./inner-architect-deploy
```

For the first certificate only, copy
`deploy/nginx-inner-architect.http.conf.example` to
`/etc/nginx/sites-available/inner-architect`, replace `YOUR_DOMAIN` and the
root if needed, then enable and validate this HTTP-only file:

```bash
sudo ln -s /etc/nginx/sites-available/inner-architect /etc/nginx/sites-enabled/inner-architect
sudo nginx -t
sudo systemctl reload nginx
```

Point the domain DNS A/AAAA record to the VPS first. Then create HTTPS
certificates (the initial port-80 server must be reachable):

```bash
sudo apt-get update && sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d YOUR_DOMAIN -d www.YOUR_DOMAIN
```

If `www.YOUR_DOMAIN` has no DNS record, remove it from both `server_name`
lines and from the Certbot command. Once Certbot has created the certificate,
replace the HTTP-only file with `deploy/nginx-inner-architect.conf.example`
(using the same domain and root), then run `sudo nginx -t && sudo systemctl
reload nginx`. Confirm automatic renewal with `sudo certbot renew --dry-run`.

## Caching

Both Nginx templates set the same cache policy:

| Response | `Cache-Control` | Why |
| --- | --- | --- |
| `index.html` (and the history fallback) | `no-cache` | Revalidated on every visit, so a switch of `current` to a new release is seen immediately |
| `/assets/<name>-<hash>.js` / `.css` (Vite bundles) | `public, max-age=31536000, immutable` | The hash changes whenever the content changes |
| Images and icons copied from `public/` | `public, max-age=604800` | Stable, unhashed names; a replaced image may take up to 7 days to refresh |

Text responses are gzip-compressed. If a visitor keeps an old tab open across a
release, its old lazy chunk no longer exists; the app reloads the page once to
pick up the new `index.html`. The templates have not yet been validated with
`nginx -t`; run `sudo nginx -t` on the VPS before reloading Nginx.

## Deployment and rollback

A successful `main` run uploads a tarball, extracts it into
`$DEPLOY_ROOT/releases/<git-sha>`, checks for `index.html`, and atomically
switches `$DEPLOY_ROOT/current` to that release. Nginx always serves `current`,
so it never observes a half-extracted directory. Existing releases are kept;
their cleanup should be a deliberate operational decision.

To roll back from a VPS shell, choose a release ID listed under `releases` and
run the tracked rollback script (after copying it to the VPS, or by piping it
over a trusted SSH connection):

```bash
bash rollback-release.sh /var/www/inner-architect PREVIOUS_GIT_SHA
```

The Nginx `try_files` rule supports direct navigation to client-side routes;
hash-based routes do not reach the server and continue to work unchanged.

## First-run checklist

1. Add the DNS record and verify it resolves to the VPS.
2. Create the restricted `deploy` user and directory with the exact ownership
   above.
3. Add the public key and add the eight GitHub secrets listed above.
4. Install and validate Nginx, then obtain HTTPS with Certbot.
5. In GitHub, optionally protect `main` and require the `Verify` check.
6. Push an approved commit to `main`; the `production` GitHub Environment can
   be configured with required reviewers to make deployment approval explicit.
