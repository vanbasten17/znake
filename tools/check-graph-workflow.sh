#!/usr/bin/env sh

set -eu

failed=0

check_file() {
  file="$1"
  if [ ! -f "$file" ]; then
    echo "[graph-policy-check] missing file: $file" >&2
    failed=1
  fi
}

check_pattern() {
  file="$1"
  pattern="$2"
  label="$3"
  if ! rg -q "$pattern" "$file"; then
    echo "[graph-policy-check] missing: $label ($file)" >&2
    failed=1
  fi
}

check_file "AGENTS.md"
check_file "package.json"
check_file "tools/graph-query.sh"

if [ -f "tools/graph-query.sh" ] && [ ! -x "tools/graph-query.sh" ]; then
  echo "[graph-policy-check] tools/graph-query.sh is not executable" >&2
  failed=1
fi

check_pattern "AGENTS.md" "## Mandatory Graph Query Workflow" "mandatory graph workflow section"
check_pattern "AGENTS.md" "pnpm graph:query -- \"<question>\"" "local graph query command in agent protocol"
check_pattern "AGENTS.md" "openspec/specs/\\*\\*" "openspec-first behavior rule"

check_pattern "package.json" "\"graph:query\"" "graph:query package script"
check_pattern "package.json" "\"graph:build\"" "graph:build package script"

if [ "$failed" -ne 0 ]; then
  echo "[graph-policy-check] FAIL" >&2
  exit 1
fi

echo "[graph-policy-check] OK"
