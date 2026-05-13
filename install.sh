#!/usr/bin/env bash
set -euo pipefail

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_TARGET="${1:-$HOME/.hermes/plugins/nightshift-ops}"
THEME_TARGET="${2:-$HOME/.hermes/dashboard-themes}"

mkdir -p "$(dirname "$PLUGIN_TARGET")"
if [[ "$THEME_TARGET" == *.yaml ]]; then
  mkdir -p "$(dirname "$THEME_TARGET")"
else
  mkdir -p "$THEME_TARGET"
fi

if [ -e "$PLUGIN_TARGET" ] && [ ! -L "$PLUGIN_TARGET" ]; then
  echo "Refusing to replace existing non-symlink plugin target: $PLUGIN_TARGET" >&2
  echo "Remove it first or pass a different plugin target path." >&2
  exit 1
fi

ln -sfn "$SRC_DIR" "$PLUGIN_TARGET"
if [[ "$THEME_TARGET" == *.yaml ]]; then
  cp "$SRC_DIR/theme/nightshift-ops.yaml" "$THEME_TARGET"
  cp "$SRC_DIR/theme/askclaw-adhd.yaml" "$(dirname "$THEME_TARGET")/askclaw-adhd.yaml"
  THEME_REPORT="$(dirname "$THEME_TARGET")"
else
  cp "$SRC_DIR"/theme/*.yaml "$THEME_TARGET"/
  THEME_REPORT="$THEME_TARGET"
fi

echo "✓ Night Shift Ops plugin linked to: $PLUGIN_TARGET"
echo "✓ Dashboard themes copied to: $THEME_REPORT"
echo "Next: run 'hermes dashboard', then choose 'Night Shift Ops' or 'AskClaw ADHD' in the theme picker."
