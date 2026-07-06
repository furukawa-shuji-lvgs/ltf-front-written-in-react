#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Error: tag name is required"
  echo "Usage: $0 <on-staging|on-production>"
  exit 1
fi

tag_name="$1"

case "$tag_name" in
  on-staging|on-production)
    ;;
  *)
    echo "Error: invalid tag name: $tag_name"
    echo "Allowed tag names: on-staging, on-production"
    exit 1
    ;;
esac

git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

if git tag -l | grep -q "^${tag_name}$"; then
  git tag -d "$tag_name"
fi

if git push --delete origin "$tag_name" 2>&1; then
  echo "Deleted remote tag: $tag_name"
elif git ls-remote --tags origin | grep -q "refs/tags/${tag_name}$"; then
  echo "Warning: failed to delete remote tag: $tag_name"
else
  echo "Remote tag did not exist: $tag_name"
fi

git tag "$tag_name"
git push -f origin "$tag_name"

echo "Updated deployment tag: $tag_name"
