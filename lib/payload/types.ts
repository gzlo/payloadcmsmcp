/**
 * Types for Payload CMS MCP Server
 */

/**
 * File types that can be validated
 */
export type FileType = 'collection' | 'field' | 'global' | 'config';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validation error interface
 */
export interface ValidationError {
  message: string;
  path?: string;
  line?: number;
  column?: number;
}

/**
 * SQL Query result interface
 */
export interface SqlQueryResult {
  columns: string[];
  rows: any[];
}

/**
 * Validation rule interface
 */
export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  category: string;
  fileTypes: FileType[];
  examples: {
    valid: string[];
    invalid: string[];
  };
} 