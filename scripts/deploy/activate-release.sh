#!/usr/bin/env bash
# Usage: activate-release.sh DEPLOY_ROOT RELEASE_ID ARCHIVE_PATH
# Run remotely by GitHub Actions. DEPLOY_ROOT must be a dedicated directory.
set -euo pipefail

deploy_root=${1:?DEPLOY_ROOT is required}
release_id=${2:?RELEASE_ID is required}
archive_path=${3:?ARCHIVE_PATH is required}

if [[ $deploy_root != /* || $deploy_root == / ]]; then
  echo "DEPLOY_ROOT must be an absolute path other than /." >&2
  exit 2
fi

if [[ ! $release_id =~ ^[A-Za-z0-9._-]+$ ]]; then
  echo "RELEASE_ID contains unsupported characters." >&2
  exit 2
fi

if [[ ! -f $archive_path ]]; then
  echo "Release archive does not exist: $archive_path" >&2
  exit 2
fi

releases_dir="$deploy_root/releases"
release_dir="$releases_dir/$release_id"
mkdir -p -- "$releases_dir"

if [[ -e $release_dir ]]; then
  echo "Release already exists and will not be overwritten: $release_dir" >&2
  exit 3
fi

staging_dir=$(mktemp -d "$releases_dir/.staging-${release_id}.XXXXXX")
cleanup() {
  rm -rf -- "$staging_dir"
}
trap cleanup EXIT

tar --extract --gzip --file="$archive_path" --directory="$staging_dir" --no-same-owner
if [[ ! -f $staging_dir/index.html ]]; then
  echo "Archive is not a Vite static-site release: index.html is missing." >&2
  exit 4
fi

mv -- "$staging_dir" "$release_dir"
trap - EXIT

# Rename is atomic because both symlinks reside on the same filesystem.
ln -s -- "releases/$release_id" "$deploy_root/.current-next"
mv -Tf -- "$deploy_root/.current-next" "$deploy_root/current"
rm -f -- "$archive_path"

echo "Activated release $release_id at $deploy_root/current"
