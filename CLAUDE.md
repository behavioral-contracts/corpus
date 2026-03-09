# Behavioral Contracts Corpus

Open-source library of behavioral contracts for npm packages, published as `@behavioral-contracts/corpus`.

## Structure

```
packages/<name>/contract.yaml    # Behavioral contract (YAML)
packages/<name>/SOURCES.md       # Where behavioral claims come from (REQUIRED)
packages/<name>/fixtures/        # Test fixtures
schema/contract.schema.json      # JSON Schema for contract validation
```

Scoped packages use nested dirs: `packages/@prisma/client/`, `packages/@aws-sdk/client-s3/`.

## Contract Format

YAML files following the schema in `schema/`. Each contract defines `functions` with `preconditions`, `postconditions`, and `edge_cases`. Every postcondition that throws must have a `source` URL linking to official documentation. Contracts encode what docs say, not opinions.

## Fixture Requirements

Each package should have a `fixtures/` directory containing:
- `proper-error-handling.ts` -- correct usage, should produce 0 violations
- `missing-error-handling.ts` -- missing try-catch, should produce ERROR violations
- `instance-usage.ts` -- tests detection via class instances
- `tsconfig.json` -- TypeScript config to compile fixtures standalone

## Key Rules

- Every contract MUST have a `SOURCES.md` documenting where behavioral claims originate
- Contracts must validate against `schema/contract.schema.json`
- Accuracy over coverage: 10 precise contracts beat 100 noisy ones
- License: CC BY-SA 4.0 (open, share-alike)

## Related

- `../verify-cli/` -- CLI tool that validates TypeScript code against these contracts
- `../tools/` -- Automation scripts for contract generation and coverage analysis

## Testing a Contract

```bash
cd ../verify-cli && node dist/index.js \
  --tsconfig ../corpus/packages/<name>/fixtures/tsconfig.json \
  --corpus ../corpus
```
