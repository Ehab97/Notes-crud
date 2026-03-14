#!/bin/bash
set -euo pipefail

# Only run in remote (cloud) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Install dependencies
bun install

# Initialize the database if it doesn't exist
if [ ! -f "data/app.db" ]; then
  mkdir -p data
  bun run db:init
fi
