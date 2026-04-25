#!/usr/bin/env bash
set -euo pipefail

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_TARGET="${1:-$HOME/.hermes/plugins/nightshift-ops}"
THEME_TARGET="${2:-$HOME/.hermes/dashboard-themes/nightshift-ops.yaml}"

mkdir -p "$(dirname "$PLUGIN_TARGET")" "$(dirname "$THEME_TARGET")"

if [ -e "$PLUGIN_TARGET" ] && [ ! -L "$PLUGIN_TARGET" ]; then
  echo "Refusing to replace existing non-symlink plugin target: $PLUGIN_TARGET" >&2
  echo "Remove it first or pass a different plugin target path." >&2
  exit 1
fi

ln -sfn "$SRC_DIR" "$PLUGIN_TARGET"
cp "$SRC_DIR/theme/nightshift-ops.yaml" "$THEME_TARGET"

echo "✓ Night Shift Ops plugin linked to: $PLUGIN_TARGET"
echo "✓ Night Shift Ops theme copied to: $THEME_TARGET"
echo "Next: run 'hermes dashboard', then choose 'Night Shift Ops' in the theme picker."
