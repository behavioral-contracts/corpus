# Analyzer Integration: How Corpus and Analyzer Work Together

**Last Updated:** 2026-02-25
**Version:** 1.0.0

This document explains how the behavioral contracts corpus integrates with the verify-cli analyzer to detect violations in real-world codebases.

---

## Overview

The corpus defines **what** to check (contracts), and the analyzer determines **how** to detect violations in code. They communicate through:

1. **contract.yaml** - Defines behavioral contracts and detection rules
2. **Type System** - Maps package types/classes to contracts
3. **Pattern Matching** - Identifies package usage in code

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Codebase                         │
│  (TypeScript files using packages like @octokit/rest)       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ TypeScript AST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      Verify-CLI Analyzer                      │
│                                                               │
│  1. Parse TypeScript → AST                                   │
│  2. Load contracts from corpus                               │
│  3. Detect package instances (new Octokit(), etc.)          │
│  4. Match expressions against contracts                      │
│  5. Check error handling requirements                        │
│  6. Generate violations                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Loads contracts from
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Corpus (Contracts)                         │
│                                                               │
│  packages/@octokit/rest/contract.yaml                        │
│  packages/stripe/contract.yaml                               │
│  packages/axios/contract.yaml                                │
│  ...                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Contract Structure

### contract.yaml Schema

```yaml
package: string                    # npm package name
semver: string                     # Supported version range
contract_version: string           # Contract schema version
maintainer: string                 # Maintainer contact
last_verified: string              # Date (YYYY-MM-DD)

# NEW: Detection rules for analyzer
detection:
  class_names: string[]            # Constructor names (e.g., ["Octokit"])
  type_names: string[]             # TypeScript type names (e.g., ["Octokit"])
  factory_methods: string[]        # Factory functions (e.g., ["createClient"])
  await_patterns: string[]         # Await expression patterns (e.g., [".repos."])

functions:
  - name: string                   # Function/method name
    import_path: string            # Package import path
    description: string            # What the function does

    postconditions:
      - id: string                 # Unique identifier
        condition: string          # When this applies
        throws: string             # What errors are thrown
        severity: error|warning|info
        description: string        # Detailed explanation
        detector: string           # How to detect this pattern
        required_handling: string  # What developers must do
        source: string             # Documentation URL

tags: string[]                     # Searchable tags
related_packages: string[]         # Related packages
```

---

## Detection Pipeline

### Phase 1: Instance Detection

The analyzer identifies package instances in the codebase:

#### 1a. Class Instantiation
```typescript
// User code:
const octokit = new Octokit({ auth: token });

// Analyzer matches:
detection.class_names: ["Octokit"]
// Maps: variable "octokit" → package "@octokit/rest"
```

#### 1b. Type Declarations
```typescript
// User code:
private client: Octokit;

// Analyzer matches:
detection.type_names: ["Octokit"]
// Maps: property "client" → package "@octokit/rest"
```

#### 1c. Factory Methods
```typescript
// User code:
const supabase = createClient(url, key);

// Analyzer matches:
detection.factory_methods: ["createClient"]
// Maps: variable "supabase" → package "@supabase/supabase-js"
```

**Current Implementation:** Hardcoded in analyzer.ts
**Proposed:** Load from `detection.class_names`, `detection.type_names`, `detection.factory_methods`

---

### Phase 2: Expression Matching

The analyzer detects when packages are called:

#### 2a. Method Calls (Instance-Based)
```typescript
// User code:
await octokit.repos.get({ owner, repo })

// Analyzer checks:
// 1. "octokit" is tracked as @octokit/rest instance
// 2. Expression matches contract function name "repos.get"
// 3. Check if await is protected by try-catch
```

#### 2b. Await Pattern Matching
```typescript
// User code:
await client.repos.get({ owner, repo })

// Analyzer checks:
detection.await_patterns: [".repos.", ".pulls.", ".issues."]
// Expression contains ".repos." → matches @octokit/rest
// Look up contract for repos.get
```

**Current Implementation:** Hardcoded in `detectPackageFromAwaitText()`
**Proposed:** Load from `detection.await_patterns`

---

### Phase 3: Violation Detection

The analyzer checks if error handling requirements are met:

```typescript
// User code (VIOLATION):
async function fetchRepo() {
  const repo = await octokit.repos.get({ owner, repo }); // ❌ No try-catch
}

// Analyzer:
// 1. Detects: await octokit.repos.get()
// 2. Package: @octokit/rest
// 3. Function: repos.get
// 4. Contract: github-repo-get-no-try-catch
// 5. Postcondition: Requires try-catch
// 6. No try-catch found → VIOLATION
```

---

## Migration Plan: From Hardcoded to Data-Driven

### Current State (Hardcoded)

**analyzer.ts** has 3 hardcoded mappings:

```typescript
// Location 1: Line ~142
const typeToPackage: Record<string, string> = {
  'AxiosInstance': 'axios',
  'PrismaClient': '@prisma/client',
  'Twilio': 'twilio',
  'S3Client': '@aws-sdk/client-s3',
  'Octokit': '@octokit/rest',  // ← Just added
};

// Location 2: Line ~168 (duplicate)
const typeToPackage: Record<string, string> = { ... };

// Location 3: Line ~927
const classToPackage: Record<string, string> = {
  'PrismaClient': '@prisma/client',
  'Stripe': 'stripe',
  'OpenAI': 'openai',
  'Twilio': 'twilio',
  'S3Client': '@aws-sdk/client-s3',
  'Octokit': '@octokit/rest',  // ← Just added
};

// Location 4: Line ~300+ (detectPackageFromAwaitText)
if (lowerText.includes('.repos.') ||
    lowerText.includes('.pulls.') ||
    lowerText.includes('.issues.')) {
  return '@octokit/rest';
}
```

**Problem:** Each new package requires updating 3-4 locations in analyzer.ts.

---

### Proposed State (Data-Driven)

#### Step 1: Extend contract.yaml

Add detection section to each contract:

```yaml
# corpus/packages/@octokit/rest/contract.yaml
package: "@octokit/rest"
semver: ">=19.0.0 <23.0.0"

detection:
  class_names: ["Octokit"]
  type_names: ["Octokit"]
  await_patterns: [".repos.", ".pulls.", ".issues.", ".git."]

functions:
  - name: repos.get
    ...
```

#### Step 2: Update Types

```typescript
// verify-cli/src/types.ts
export interface PackageContract {
  package: string;
  semver: string;
  contract_version: string;
  maintainer?: string;
  last_verified?: string;

  // NEW: Detection rules
  detection?: {
    class_names?: string[];      // For new expressions
    type_names?: string[];        // For type declarations
    factory_methods?: string[];   // For factory functions
    await_patterns?: string[];    // For await detection
  };

  functions: ContractFunction[];
  tags?: string[];
  related_packages?: string[];
}
```

#### Step 3: Build Detection Maps Dynamically

```typescript
// verify-cli/src/analyzer.ts

class Analyzer {
  private contracts: Map<string, PackageContract>;

  // NEW: Built dynamically from contracts
  private typeToPackage: Map<string, string>;
  private classToPackage: Map<string, string>;
  private awaitPatternsToPackage: Map<string, string>;

  constructor(config: AnalyzerConfig, contracts: Map<string, PackageContract>) {
    this.contracts = contracts;

    // Build detection maps from contract definitions
    this.buildDetectionMaps();

    // ... rest of constructor
  }

  private buildDetectionMaps(): void {
    this.typeToPackage = new Map();
    this.classToPackage = new Map();
    this.awaitPatternsToPackage = new Map();

    for (const [packageName, contract] of this.contracts.entries()) {
      const detection = contract.detection;
      if (!detection) continue;

      // Map type names
      for (const typeName of detection.type_names || []) {
        this.typeToPackage.set(typeName, packageName);
      }

      // Map class names
      for (const className of detection.class_names || []) {
        this.classToPackage.set(className, packageName);
      }

      // Map await patterns
      for (const pattern of detection.await_patterns || []) {
        this.awaitPatternsToPackage.set(pattern.toLowerCase(), packageName);
      }
    }
  }

  private detectPackageFromAwaitText(awaitText: string): string | null {
    const lowerText = awaitText.toLowerCase();

    // Check against all registered await patterns
    for (const [pattern, packageName] of this.awaitPatternsToPackage.entries()) {
      if (lowerText.includes(pattern)) {
        return packageName;
      }
    }

    return null;
  }
}
```

---

## Benefits of Data-Driven Approach

### 1. **Scalability**
- Onboard new packages by just adding contract.yaml
- No analyzer code changes needed
- Detection rules live with contract definitions

### 2. **Maintainability**
- Single source of truth per package
- No scattered mappings across codebase
- Easy to update detection rules

### 3. **Extensibility**
- Add new detection patterns without code changes
- Support complex patterns (regex, multi-level chains)
- Package-specific detection logic

### 4. **Transparency**
- Clear what patterns are detected
- Easy to debug ("why isn't this detected?")
- Self-documenting contracts

---

## Package Onboarding Checklist

### For Package Maintainers

When creating a new contract:

```yaml
# 1. Define basic contract info
package: "your-package"
semver: "^1.0.0"
contract_version: "1.0.0"

# 2. Add detection rules
detection:
  # How is this package instantiated?
  class_names: ["YourClient", "YourService"]
  type_names: ["YourClient", "YourInstance"]
  factory_methods: ["createYourClient", "initYour"]

  # What patterns identify usage?
  await_patterns: [".yourMethod.", ".yourResource."]

# 3. Define functions and postconditions
functions:
  - name: yourMethod
    postconditions:
      - id: your-method-no-try-catch
        condition: "Method called without try-catch"
        ...
```

### Validation

The corpus should validate contracts on load:
- All detection patterns are valid
- No conflicts with other packages
- Patterns match defined functions

---

## Future Enhancements

### 1. Advanced Pattern Matching
```yaml
detection:
  await_patterns:
    - pattern: ".repos."
      requires_instance: true  # Must be on tracked instance
    - pattern: "\.repos\.(get|create|update)"
      regex: true              # Use regex matching
```

### 2. Import-Based Detection
```yaml
detection:
  imports:
    - { from: "@octokit/rest", named: ["Octokit"] }
    - { from: "@octokit/rest", default: "Octokit" }
```

### 3. Multi-Level Chains
```yaml
detection:
  chain_patterns:
    - depth: 2
      pattern: "{instance}.repos.{method}"
    - depth: 3
      pattern: "{instance}.chat.completions.{method}"
```

---

## Migration Timeline

### Phase 1: Add Detection to Existing Contracts (Week 1)
- Update @octokit/rest contract with detection section
- Update 5-10 high-priority contracts
- Validate schema

### Phase 2: Update Analyzer to Load Dynamically (Week 1-2)
- Extend PackageContract type
- Implement buildDetectionMaps()
- Update detectPackageFromAwaitText()
- Keep hardcoded mappings as fallback

### Phase 3: Migrate All Contracts (Week 2-3)
- Add detection to all 24 existing contracts
- Remove hardcoded mappings
- Full data-driven detection

### Phase 4: Documentation & Validation (Week 3-4)
- Update onboarding guides
- Add contract validation
- Create migration guide for external contributors

---

## Related Documents

- **SCHEMA.md** - Contract YAML schema definition
- **CONTRIBUTING.md** - How to create contracts
- **dev-notes/ANALYZER_ARCHITECTURE.md** - Analyzer internals
- **package-onboarding/** - Step-by-step onboarding guides

---

## Questions & Answers

### Q: What if two packages have the same class name?
A: Use namespaced detection or prioritize by import resolution. Example:
```yaml
detection:
  class_names: ["Client"]
  import_namespace: "@your-package"  # Only match if imported from here
```

### Q: How do we handle version-specific detection?
A: Detection rules can vary by semver:
```yaml
detection:
  v1:
    semver: "^1.0.0"
    class_names: ["OldClient"]
  v2:
    semver: "^2.0.0"
    class_names: ["NewClient"]
```

### Q: Can we detect non-async violations?
A: Yes! Detection rules can specify synchronous patterns:
```yaml
detection:
  sync_patterns: [".verifySync("]  # For non-async calls
```

---

## Glossary

- **Contract**: Behavioral specification for a package
- **Postcondition**: A requirement that must be met after calling a function
- **Detection Rule**: Pattern that identifies package usage in code
- **Instance Tracking**: Mapping variables to package types
- **Violation**: Code that doesn't meet contract requirements
- **Analyzer**: Static analysis tool that detects violations

---

## Changelog

### v1.0.0 (2026-02-25)
- Initial documentation
- Defined data-driven architecture
- Outlined migration plan from hardcoded to corpus-driven detection
