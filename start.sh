#!/usr/bin/env bash
# Launches the built label generator locally and opens it in your browser.
cd "$(dirname "$0")/docs" || exit 1

PORT="${PORT:-8765}"
URL="http://localhost:$PORT"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required to run this launcher." >&2
  exit 1
fi

echo "Starting label generator at $URL"
xdg-open "$URL" >/dev/null 2>&1 &
exec python3 -m http.server "$PORT" --bind 127.0.0.1