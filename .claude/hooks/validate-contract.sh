#!/bin/bash
# Post-tool-use hook: hint when contract YAML files are edited without fixtures
# Location: corpus/.claude/hooks/validate-contract.sh
#
# Fires after Write or Edit on contract.yaml files.
# Checks if the corresponding fixtures/ directory exists and warns if not.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')

# Only trigger for contract.yaml files
if [[ "$FILE_PATH" =~ /packages/.*/contract\.yaml$ ]]; then
  # Extract package directory from file path
  PACKAGE_DIR=$(dirname "$FILE_PATH")
  FIXTURES_DIR="${PACKAGE_DIR}/fixtures"
  SOURCES_FILE="${PACKAGE_DIR}/SOURCES.md"

  WARNINGS=()

  if [ ! -d "$FIXTURES_DIR" ]; then
    WARNINGS+=("⚠️  No fixtures/ directory found — run: mkdir -p ${FIXTURES_DIR}")
  fi

  if [ ! -f "$SOURCES_FILE" ]; then
    WARNINGS+=("⚠️  No SOURCES.md found — every contract needs documentation sources")
  fi

  if [ ${#WARNINGS[@]} -gt 0 ]; then
    echo "📋 [contract-validator] Checklist for $(basename $PACKAGE_DIR):"
    for w in "${WARNINGS[@]}"; do
      echo "  $w"
    done
  fi
fi

exit 0
