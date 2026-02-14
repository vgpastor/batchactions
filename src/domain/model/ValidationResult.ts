/** Error codes produced by schema validation. */
export type ValidationErrorCode =
  | 'REQUIRED'
  | 'TYPE_MISMATCH'
  | 'PATTERN_MISMATCH'
  | 'CUSTOM_VALIDATION'
  | 'UNKNOWN_FIELD'
  | 'DUPLICATE_VALUE';

/** A single validation error for a specific field. */
export interface ValidationError {
  /** Name of the field that failed validation. */
  readonly field: string;
  /** Human-readable error message. */
  readonly message: string;
  /** Machine-readable error code. */
  readonly code: ValidationErrorCode;
  /** The value that caused the validation failure. */
  readonly value?: unknown;
}

/** Result of validating a single record against the schema. */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly ValidationError[];
}

/** Create a passing validation result. */
export function validResult(): ValidationResult {
  return { isValid: true, errors: [] };
}

/** Create a failing validation result with the given errors. */
export function invalidResult(errors: readonly ValidationError[]): ValidationResult {
  return { isValid: false, errors };
}
