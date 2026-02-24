/**
 * Type definitions for behavioral contracts fixture testing
 *
 * These types define the expected output format for fixture regression tests.
 * Each fixture file should have a corresponding .expected.ts file that exports
 * an ExpectedViolations object.
 */
export type Severity = 'error' | 'warning' | 'info';
/**
 * Defines an expected violation pattern in a fixture file
 */
export interface ViolationExpectation {
    /** Unique identifier for this expectation */
    id: string;
    /** Human-readable description of what this expectation tests */
    description: string;
    /** Function name where the violation occurs (optional) */
    functionName?: string;
    /** Minimum number of violations expected (usually 1) */
    minViolations: number;
    /** Maximum number of violations expected (defaults to minViolations) */
    maxViolations?: number;
    /** Contract clause IDs that should be triggered (from contract.yaml postconditions) */
    expectedClauses: string[];
    /** Severity level of expected violations */
    severity: Severity;
    /** Approximate line range where violations should occur (±5 line tolerance) */
    approximateLines?: [number, number];
    /** Mark as pending analyzer support (won't cause test failure) */
    pending?: boolean;
    /** Reason why this expectation is pending */
    pendingReason?: string;
}
/**
 * Summary of expected violation counts
 */
export interface ViolationSummaryExpectation {
    /** Expected error-level violation count range */
    expectedErrorCount: {
        min: number;
        max: number;
    };
    /** Expected warning-level violation count range */
    expectedWarningCount: {
        min: number;
        max: number;
    };
    /** Expected info-level violation count range */
    expectedInfoCount: {
        min: number;
        max: number;
    };
}
/**
 * Complete expected output specification for a fixture file
 *
 * Export this from *.expected.ts files alongside fixture files.
 */
export interface ExpectedViolations {
    /** Fixture filename (e.g., "missing-error-handling.ts") */
    fixtures: string;
    /** List of expected violation patterns */
    expectations: ViolationExpectation[];
    /** Summary of expected violation counts by severity */
    summary: ViolationSummaryExpectation;
    /** Mark entire fixture as pending analyzer support */
    pending?: boolean;
    /** Reason why this fixture is pending */
    pendingReason?: string;
}
/**
 * Result of validating actual violations against expectations
 */
export interface FixtureTestResult {
    /** Fixture file that was tested */
    fixtureFile: string;
    /** Whether validation passed */
    passed: boolean;
    /** Number of actual violations found */
    actualViolations: number;
    /** Number of expected violation patterns */
    expectedViolations: number;
    /** List of discrepancies between actual and expected */
    discrepancies: ViolationDiscrepancy[];
}
/**
 * Represents a mismatch between expected and actual violations
 */
export interface ViolationDiscrepancy {
    /** Type of discrepancy */
    type: 'missing' | 'unexpected' | 'wrong-severity' | 'wrong-line' | 'count-mismatch';
    /** The expectation that wasn't met (if applicable) */
    expectation?: ViolationExpectation;
    /** The actual violation that caused the discrepancy (if applicable) */
    actualViolation?: any;
    /** Human-readable description of the discrepancy */
    message: string;
}
/**
 * Configuration for running fixture regression tests
 */
export interface FixtureTestConfig {
    /** Only test specific package (optional) */
    packageName?: string;
    /** Update mode - regenerate expected outputs */
    updateMode: boolean;
    /** Verbose output */
    verbose: boolean;
    /** Corpus path */
    corpusPath?: string;
}
/**
 * Summary results from running all fixture tests
 */
export interface FixtureTestSummary {
    /** Total number of tests run */
    total: number;
    /** Number of tests that passed */
    passed: number;
    /** Number of tests that failed */
    failed: number;
    /** Number of tests skipped (pending) */
    skipped: number;
    /** Individual test results */
    results: FixtureTestResult[];
}
//# sourceMappingURL=index.d.ts.map