#!/usr/bin/env bash
# SessionStart hook: en las sesiones cloud de Claude Code el contenedor es
# efímero, así que instalamos REA al arrancar cada sesión.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

"$CLAUDE_PROJECT_DIR/.claude/hooks/install-rea.sh"
