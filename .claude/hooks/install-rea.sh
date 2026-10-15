#!/usr/bin/env bash
# Instala REA (Reverse Engineer Anything, https://github.com/morluto/rea):
# la CLI `rea`, su servidor MCP para Claude Code y la skill
# `reverse-engineer-anything`. Es idempotente: si ya está instalada, solo
# actualiza a la última versión y vuelve a registrar la integración.
#
# Uso en tu Terminal (macOS/Linux), una sola vez:
#   bash .claude/hooks/install-rea.sh
set -euo pipefail

log() { echo "[rea] $*" >&2; }

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  log "Necesitas Node.js y npm (Node 22.19+, 24.11+ o 26+). Instálalos desde https://nodejs.org"
  exit 1
fi

# rea-agents exige Node ^22.19.0 || ^24.11.0 || >=26.0.0
node -e '
  const [maj, min] = process.versions.node.split(".").map(Number);
  const ok = (maj === 22 && min >= 19) || (maj === 24 && min >= 11) || maj >= 26;
  if (!ok) { console.error("[rea] Node " + process.versions.node + " no es compatible (requiere 22.19+, 24.11+ o 26+)"); process.exit(1); }
'

if command -v rea >/dev/null 2>&1; then
  log "REA $(rea --version) ya instalada; buscando actualizaciones..."
else
  log "Instalando rea-agents con npm..."
fi
npm install --global rea-agents@latest --no-fund --no-audit --loglevel=error >&2

log "Registrando el MCP y la skill de REA en Claude Code..."
rea setup --client claude_code --yes >/dev/null

log "Listo: REA $(rea --version) instalada. Reinicia Claude Code para cargar el MCP."
