#!/usr/bin/env sh

set -u

if [ "${1-}" = "--" ]; then
  shift
fi

if [ "$#" -eq 0 ]; then
  echo "[graph-query] usage: pnpm graph:query -- \"<question>\"" >&2
  exit 2
fi

query="$*"

if ! command -v graphify >/dev/null 2>&1; then
  echo "[graph-query] error: graphify is not installed or not on PATH." >&2
  if [ -f "graphify-out/GRAPH_REPORT.md" ]; then
    echo "[graph-query] fallback: consult graphify-out/GRAPH_REPORT.md manually." >&2
  else
    echo "[graph-query] fallback unavailable: graphify-out/GRAPH_REPORT.md is missing." >&2
  fi
  exit 1
fi

echo "[graph-query] query: $query"
if graphify query "$query"; then
  exit 0
fi

status=$?
echo "[graph-query] warning: graphify query failed (exit $status)." >&2
if [ -f "graphify-out/GRAPH_REPORT.md" ]; then
  echo "[graph-query] fallback: consult graphify-out/GRAPH_REPORT.md manually." >&2
else
  echo "[graph-query] fallback unavailable: graphify-out/GRAPH_REPORT.md is missing. Run 'pnpm graph:build'." >&2
fi
exit "$status"
