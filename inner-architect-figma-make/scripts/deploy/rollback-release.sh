#!/usr/bin/env bash
# Usage: rollback-release.sh DEPLOY_ROOT RELEASE_ID
# Run this on the VPS to point current at a previously uploaded release.
set -euo pipefail

deploy_root=${1:?DEPLOY_ROOT is required}
release_id=${2:?RELEASE_ID is required}

if [[ $deploy_root != /* || $deploy_root == / ]]; then
  echo "DEPLOY_ROOT must be an absolute path other than /." >&2
  exit 2
fi

if [[ ! $release_id =~ ^[A-Za-z0-9._-]+$ ]]; then
  echo "RELEASE_ID contains unsupported characters." >&2
  exit 2
fi

release_dir="$deploy_root/releases/$release_id"
if [[ ! -f $release_dir/index.html ]]; then
  echo "A release with index.html was not found: $release_dir" >&2
  exit 3
fi

ln -s -- "releases/$release_id" "$deploy_root/.current-next"
mv -Tf -- "$deploy_root/.current-next" "$deploy_root/current"
echo "Rolled back to release $release_id"
