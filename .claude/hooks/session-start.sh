#!/bin/bash
set -euo pipefail

# Only run in Claude Code web sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

echo "Installing npm dependencies..."
npm install --no-audit --no-fund

echo "Installing Playwright browsers (best-effort)..."
npx --yes playwright install chromium || echo "Warning: Playwright browser install failed; e2e tests may not run."

echo "Session start hook complete."
