/**
 * Strict TypeScript types for enhanced type safety
 */

// Strict utility types
export type NonEmptyArray<T> = [T, ...T[]];
export type NonEmptyString = string & { __brand: 'NonEmptyString' };
export type PositiveNumber = number & { __brand: 'PositiveNumber' };
export type ValidUrl = string & { __brand: 'ValidUrl' };
export type ValidEmail = string & { __brand: 'ValidEmail' };
export type UUID = string & { __brand: 'UUID' };
export type Timestamp = string & { __brand: 'Timestamp' };

// Type guards
export function isNonEmptyString(value: string): value is NonEmptyString {
  return value.trim().length > 0;
}

export function isPositiveNumber(value: number): value is PositiveNumber {
  return value > 0 && !isNaN(value) && isFinite(value);
}

export function isValidUrl(value: string): value is ValidUrl {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function isValidEmail(value: string): value is ValidEmail {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export function isUUID(value: string): value is UUID {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

export function isValidTimestamp(value: string): value is Timestamp {
  return !isNaN(Date.parse(value));
}

// Branded type creators
export function createNonEmptyString(value: string): NonEmptyString {
  if (!isNonEmptyString(value)) {
    throw new Error(`Invalid non-empty string: "${value}"`);
  }
  return value;
}

export function createPositiveNumber(value: number): PositiveNumber {
  if (!isPositiveNumber(value)) {
    throw new Error(`Invalid positive number: ${value}`);
  }
  return value;
}

export function createValidUrl(value: string): ValidUrl {
  if (!isValidUrl(value)) {
    throw new Error(`Invalid URL: "${value}"`);
  }
  return value;
}

export function createValidEmail(value: string): ValidEmail {
  if (!isValidEmail(value)) {
    throw new Error(`Invalid email: "${value}"`);
  }
  return value;
}

export function createUUID(value: string): UUID {
  if (!isUUID(value)) {
    throw new Error(`Invalid UUID: "${value}"`);
  }
  return value;
}

export function createTimestamp(value: string): Timestamp {
  if (!isValidTimestamp(value)) {
    throw new Error(`Invalid timestamp: "${value}"`);
  }
  return value;
}

// Strict API response types
export interface StrictApiResponse<T> {
  readonly success: true;
  readonly data: T;
  readonly timestamp: Timestamp;
}

export interface StrictApiError {
  readonly success: false;
  readonly error: {
    readonly code: NonEmptyString;
    readonly message: NonEmptyString;
    readonly details?: Record<string, unknown>;
  };
  readonly timestamp: Timestamp;
}

export type StrictApiResult<T> = StrictApiResponse<T> | StrictApiError;

// Strict component props interfaces
export interface StrictComponentProps {
  readonly className?: string;
  readonly testId?: NonEmptyString;
  readonly 'aria-label'?: NonEmptyString;
  readonly 'aria-describedby'?: NonEmptyString;
}

export interface StrictModalProps extends StrictComponentProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: NonEmptyString;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface StrictButtonProps extends StrictComponentProps {
  readonly variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly onClick?: () => void | Promise<void>;
}

// Strict form validation
export interface StrictFieldError {
  readonly field: NonEmptyString;
  readonly message: NonEmptyString;
  readonly code: NonEmptyString;
}

export interface StrictFormState<T> {
  readonly data: T;
  readonly errors: readonly StrictFieldError[];
  readonly isSubmitting: boolean;
  readonly isValid: boolean;
  readonly isDirty: boolean;
  readonly touchedFields: readonly (keyof T)[];
}

// Strict event handlers
export type StrictEventHandler<T = unknown> = (event: T) => void | Promise<void>;
export type StrictAsyncEventHandler<T = unknown> = (event: T) => Promise<void>;

// Result type for operations that can fail
export type Result<T, E = Error> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

export function createSuccess<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function createError<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// Strict configuration types
export interface StrictEnvironmentConfig {
  readonly NODE_ENV: 'development' | 'test' | 'production';
  readonly API_BASE_URL: ValidUrl;
  readonly ENABLE_ANALYTICS: boolean;
  readonly DEBUG_MODE: boolean;
}

export interface StrictFeatureFlags {
  readonly ENABLE_DARK_MODE: boolean;
  readonly ENABLE_NOTEBOOKS: boolean;
  readonly ENABLE_TEMPLATES: boolean;
  readonly ENABLE_DATABASE_SOURCES: boolean;
}

// Immutable update helpers
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Exhaustiveness checking
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

// Safe JSON parsing
export function safeJsonParse<T>(json: string): Result<T, Error> {
  try {
    const data = JSON.parse(json);
    return createSuccess(data);
  } catch (error) {
    return createError(error instanceof Error ? error : new Error('JSON parse error'));
  }
}