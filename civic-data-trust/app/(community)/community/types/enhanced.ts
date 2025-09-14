/**
 * Enhanced type definitions with strict type safety
 */
import type {
  NonEmptyString,
  PositiveNumber,
  ValidUrl,
  UUID,
  Timestamp,
  DeepReadonly,
  StrictComponentProps,
} from './strict';

// Enhanced workflow types with strict validation
export interface StrictWorkflowNode {
  readonly id: UUID;
  readonly type: NonEmptyString;
  readonly name: NonEmptyString;
  readonly position: {
    readonly x: number;
    readonly y: number;
  };
  readonly dimensions: {
    readonly width: PositiveNumber;
    readonly height: PositiveNumber;
  };
  readonly color: NonEmptyString; // Should be valid CSS color
  readonly inputs: readonly StrictWorkflowInput[];
  readonly outputs: readonly StrictWorkflowOutput[];
  readonly parameters: DeepReadonly<Record<string, unknown>>;
  readonly data: DeepReadonly<Record<string, unknown>>;
  readonly metadata: {
    readonly createdAt: Timestamp;
    readonly updatedAt: Timestamp;
    readonly version: PositiveNumber;
  };
}

export interface StrictWorkflowInput {
  readonly id: UUID;
  readonly type: NonEmptyString;
  readonly label: NonEmptyString;
  readonly connected: boolean;
  readonly required: boolean;
  readonly dataType: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any';
}

export interface StrictWorkflowOutput {
  readonly id: UUID;
  readonly type: NonEmptyString;
  readonly label: NonEmptyString;
  readonly connected: boolean;
  readonly dataType: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any';
}

export interface StrictWorkflowConnection {
  readonly id: UUID;
  readonly sourceNodeId: UUID;
  readonly targetNodeId: UUID;
  readonly sourceOutputId: UUID;
  readonly targetInputId: UUID;
  readonly metadata: {
    readonly createdAt: Timestamp;
    readonly dataType: string;
  };
}

export interface StrictWorkflowState {
  readonly nodes: readonly StrictWorkflowNode[];
  readonly connections: readonly StrictWorkflowConnection[];
  readonly viewport: {
    readonly x: number;
    readonly y: number;
  };
  readonly zoom: PositiveNumber;
  readonly metadata: {
    readonly lastModified: Timestamp;
    readonly version: PositiveNumber;
    readonly isValid: boolean;
  };
}

// Enhanced notebook types
export interface StrictNotebookState {
  readonly status: 'idle' | 'starting' | 'running' | 'stopping' | 'stopped' | 'error';
  readonly url: ValidUrl | null;
  readonly loading: boolean;
  readonly showCleanupModal: boolean;
  readonly error: {
    readonly message: NonEmptyString;
    readonly code: NonEmptyString;
    readonly timestamp: Timestamp;
  } | null;
}

export interface StrictNotebookFileInfo {
  readonly hasFiles: boolean;
  readonly fileCount: number;
  readonly files: readonly {
    readonly name: NonEmptyString;
    readonly size: PositiveNumber;
    readonly lastModified: Timestamp;
    readonly type: string;
  }[];
  readonly totalSize: PositiveNumber;
}

// Enhanced data source types
export type StrictDataSourceType = 'image' | 'json' | 'csv' | 'database';

export interface StrictDataSourceConfig {
  readonly type: StrictDataSourceType;
  readonly name: NonEmptyString;
  readonly description: NonEmptyString;
  readonly icon: NonEmptyString;
  readonly color: NonEmptyString;
  readonly enabled: boolean;
  readonly metadata: {
    readonly supportedFormats: readonly NonEmptyString[];
    readonly maxFileSize: PositiveNumber;
    readonly requiresProcessing: boolean;
  };
}

export interface StrictCsvInfo {
  readonly shape: readonly [PositiveNumber, PositiveNumber]; // [rows, columns]
  readonly columns: readonly NonEmptyString[];
  readonly summary: DeepReadonly<Record<string, number>>;
  readonly dataTypes: DeepReadonly<Record<string, 'string' | 'number' | 'boolean' | 'date'>>;
  readonly hasHeaders: boolean;
  readonly encoding: NonEmptyString;
  readonly fileSize: PositiveNumber;
}

export interface StrictStoredCsvData {
  readonly content: NonEmptyString;
  readonly filename: NonEmptyString;
  readonly timestamp: Timestamp;
  readonly info: StrictCsvInfo;
  readonly checksum: NonEmptyString; // For integrity verification
}

// Enhanced component props with strict validation
export interface StrictDataSourceCardProps extends StrictComponentProps {
  readonly type: StrictDataSourceType;
  readonly config: StrictDataSourceConfig;
  readonly isSelected: boolean;
  readonly isDarkMode: boolean;
  readonly onSelect: () => void | Promise<void>;
  readonly disabled?: boolean;
}

export interface StrictLayoutProps extends StrictComponentProps {
  readonly isDarkMode: boolean;
  readonly onDarkModeToggle: () => void;
}

export interface StrictSidebarProps extends StrictLayoutProps {
  readonly collapsed?: boolean;
  readonly onToggleCollapse?: () => void;
}

export interface StrictCanvasProps extends StrictLayoutProps {
  readonly isMounted: boolean;
  readonly draggedNode: unknown;
  readonly onNodeDrop: (event: DragEvent) => void;
}

// Enhanced API types with strict validation
export interface StrictApiEndpoint {
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  readonly url: ValidUrl;
  readonly timeout: PositiveNumber;
  readonly retries: number;
}

export interface StrictApiConfig {
  readonly baseUrl: ValidUrl;
  readonly timeout: PositiveNumber;
  readonly retries: number;
  readonly endpoints: DeepReadonly<Record<string, StrictApiEndpoint>>;
}

// Enhanced error types
export interface StrictErrorInfo {
  readonly message: NonEmptyString;
  readonly code: NonEmptyString;
  readonly timestamp: Timestamp;
  readonly context: DeepReadonly<Record<string, unknown>>;
  readonly stack?: NonEmptyString;
  readonly userAgent?: NonEmptyString;
  readonly url?: ValidUrl;
}

export interface StrictComponentErrorInfo extends StrictErrorInfo {
  readonly componentName: NonEmptyString;
  readonly componentStack: NonEmptyString;
  readonly props: DeepReadonly<Record<string, unknown>>;
}

// Enhanced performance monitoring types
export interface StrictPerformanceMetric {
  readonly name: NonEmptyString;
  readonly value: PositiveNumber;
  readonly unit: 'ms' | 'bytes' | 'count';
  readonly timestamp: Timestamp;
  readonly context: DeepReadonly<Record<string, unknown>>;
}

export interface StrictRenderPerformance {
  readonly componentName: NonEmptyString;
  readonly renderTime: PositiveNumber;
  readonly updateCount: number;
  readonly timestamp: Timestamp;
  readonly props: DeepReadonly<Record<string, unknown>>;
}

// Type predicates for runtime validation
export function isStrictWorkflowNode(value: unknown): value is StrictWorkflowNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'type' in value &&
    'name' in value &&
    typeof (value as any).id === 'string' &&
    typeof (value as any).type === 'string' &&
    typeof (value as any).name === 'string'
  );
}

export function isStrictNotebookState(value: unknown): value is StrictNotebookState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    'loading' in value &&
    'showCleanupModal' in value &&
    typeof (value as any).loading === 'boolean' &&
    typeof (value as any).showCleanupModal === 'boolean'
  );
}

export function isStrictDataSourceType(value: string): value is StrictDataSourceType {
  return ['image', 'json', 'csv', 'database'].includes(value);
}

// Advanced utility types
export type StrictEventMap<T> = {
  readonly [K in keyof T]: T[K] extends (...args: any[]) => any
    ? T[K]
    : never;
};

export type StrictMutationFn<TData, TVariables = void> = TVariables extends void
  ? () => Promise<TData>
  : (variables: TVariables) => Promise<TData>;

export type StrictQueryResult<TData, TError = Error> =
  | { readonly loading: true; readonly data: undefined; readonly error: undefined }
  | { readonly loading: false; readonly data: TData; readonly error: undefined }
  | { readonly loading: false; readonly data: undefined; readonly error: TError };

// Enhanced configuration with environment-specific overrides
export interface StrictAppConfig {
  readonly environment: 'development' | 'staging' | 'production';
  readonly api: StrictApiConfig;
  readonly features: DeepReadonly<Record<string, boolean>>;
  readonly ui: {
    readonly theme: {
      readonly defaultMode: 'light' | 'dark' | 'system';
      readonly allowModeToggle: boolean;
    };
    readonly layout: {
      readonly sidebarWidth: PositiveNumber;
      readonly headerHeight: PositiveNumber;
    };
  };
  readonly analytics: {
    readonly enabled: boolean;
    readonly trackingId?: NonEmptyString;
    readonly sampleRate: number; // 0-1
  };
}