#!/bin/bash
# Check what will be published and its size

echo "═══════════════════════════════════════════════════════════════"
echo "  Corpus Package Size Analysis"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "Files that will be published:"
echo "────────────────────────────────────────────────────────────────"

# Count by type
YAML_COUNT=$(find packages -name "*.yaml" | wc -l | tr -d ' ')
SOURCES_COUNT=$(find packages -name "SOURCES.md" | wc -l | tr -d ' ')
TOTAL_FILES=$((YAML_COUNT + SOURCES_COUNT + 3))  # +3 for index.js, index.d.ts, schema

echo "  Contract files (*.yaml): $YAML_COUNT"
echo "  Documentation (SOURCES.md): $SOURCES_COUNT"
echo "  Support files: 3 (index.js, index.d.ts, schema/)"
echo "  Total files: $TOTAL_FILES"
echo ""

echo "Size breakdown:"
echo "────────────────────────────────────────────────────────────────"

# Calculate sizes
YAML_SIZE=$(find packages -name "*.yaml" -exec du -ch {} + 2>/dev/null | tail -1 | awk '{print $1}')
SOURCES_SIZE=$(find packages -name "SOURCES.md" -exec du -ch {} + 2>/dev/null | tail -1 | awk '{print $1}')
SCHEMA_SIZE=$(du -sh schema 2>/dev/null | awk '{print $1}')
INDEX_SIZE=$(du -sh index.js index.d.ts 2>/dev/null | tail -1 | awk '{print $1}')

echo "  Contracts (*.yaml): $YAML_SIZE"
echo "  Documentation (SOURCES.md): $SOURCES_SIZE"
echo "  Schema: $SCHEMA_SIZE"
echo "  Index files: $INDEX_SIZE"
echo ""

# Total publishable size
TOTAL_SIZE=$(find packages -name "*.yaml" -o -name "SOURCES.md" | xargs du -ch 2>/dev/null | tail -1 | awk '{print $1}')

echo "  📦 Total package size: $TOTAL_SIZE"
echo ""

# Check against limits
TOTAL_BYTES=$(find packages -name "*.yaml" -o -name "SOURCES.md" | xargs du -c 2>/dev/null | tail -1 | awk '{print $1}')
TOTAL_MB=$((TOTAL_BYTES / 1024))

if [ $TOTAL_MB -lt 1024 ]; then
  echo "  ✅ Size: ${TOTAL_MB}KB - Excellent!"
elif [ $TOTAL_MB -lt 10240 ]; then
  TOTAL_SIZE_MB=$((TOTAL_MB / 1024))
  echo "  ✅ Size: ${TOTAL_SIZE_MB}MB - Good"
elif [ $TOTAL_MB -lt 102400 ]; then
  TOTAL_SIZE_MB=$((TOTAL_MB / 1024))
  echo "  ⚠️  Size: ${TOTAL_SIZE_MB}MB - Getting large"
else
  TOTAL_SIZE_MB=$((TOTAL_MB / 1024))
  echo "  ❌ Size: ${TOTAL_SIZE_MB}MB - Too large!"
fi

echo ""
echo "Files that will be EXCLUDED:"
echo "────────────────────────────────────────────────────────────────"

# Count excluded
FIXTURE_COUNT=$(find packages -name "fixtures" -type d | wc -l | tr -d ' ')
NODE_MODULES_COUNT=$(find packages -name "node_modules" -type d 2>/dev/null | wc -l | tr -d ' ')

echo "  ❌ fixtures/ directories: $FIXTURE_COUNT (development only)"
echo "  ❌ node_modules/ directories: $NODE_MODULES_COUNT (never include)"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "  Ready to publish!"
echo "═══════════════════════════════════════════════════════════════"
