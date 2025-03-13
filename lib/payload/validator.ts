import { CollectionSchema, FieldSchema, GlobalSchema, ConfigSchema } from './schemas';
import { z } from 'zod';

export type ValidationResult = {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
  suggestions?: {
    message: string;
    code?: string;
  }[];
  references?: {
    title: string;
    url: string;
  }[];
};

export type FileType = 'collection' | 'field' | 'global' | 'config';

// Common validation rules
const commonValidationRules = {
  namingConventions: (name: string): string[] => {
    const errors: string[] = [];
    if (name.includes(' ')) {
      errors.push(`Name "${name}" should not contain spaces. Use camelCase or snake_case instead.`);
    }
    if (name.match(/[A-Z]/) && name.match(/_/)) {
      errors.push(`Name "${name}" mixes camelCase and snake_case. Choose one convention.`);
    }
    return errors;
  },
  
  reservedWords: (name: string): string[] => {
    const reserved = ['constructor', 'prototype', '__proto__', 'toString', 'toJSON', 'valueOf'];
    return reserved.includes(name) 
      ? [`Name "${name}" is a reserved JavaScript word and should be avoided.`]
      : [];
  }
};

// Security validation rules
const securityValidationRules = {
  accessControl: (obj: any): string[] => {
    const warnings: string[] = [];
    if (!obj.access) {
      warnings.push('No access control defined. This might expose data to unauthorized users.');
    }
    return warnings;
  },
  
  authFields: (fields: any[]): string[] => {
    const warnings: string[] = [];
    const sensitiveFields = fields.filter(f => 
      f.name?.toLowerCase().includes('password') || 
      f.name?.toLowerCase().includes('token') ||
      f.name?.toLowerCase().includes('secret')
    );
    
    for (const field of sensitiveFields) {
      if (!field.access || !field.access.read) {
        warnings.push(`Sensitive field "${field.name}" should have explicit read access control.`);
      }
    }
    
    return warnings;
  }
};

// Performance validation rules
const performanceValidationRules = {
  indexedFields: (fields: any[]): string[] => {
    const warnings: string[] = [];
    const searchableFields = fields.filter(f => 
      f.type === 'text' || 
      f.type === 'email' || 
      f.type === 'textarea'
    );
    
    for (const field of searchableFields) {
      if (field.unique && !field.index) {
        warnings.push(`Field "${field.name}" is unique but not indexed. Consider adding 'index: true' for better performance.`);
      }
    }
    
    return warnings;
  }
};

/**
 * Validates a Payload CMS collection
 */
export const validateCollection = (code: string): ValidationResult => {
  try {
    // Parse the code to get a JavaScript object
    // This is a simplified approach - in a real implementation, you'd need to safely evaluate the code
    const collection = eval(`(${code})`);
    
    // Validate against schema
    CollectionSchema.parse(collection);
    
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: { message: string; code?: string }[] = [];
    
    // Check naming conventions
    if (collection.slug) {
      errors.push(...commonValidationRules.namingConventions(collection.slug));
      errors.push(...commonValidationRules.reservedWords(collection.slug));
    }
    
    // Check fields
    if (collection.fields) {
      for (const field of collection.fields) {
        if (field.name) {
          errors.push(...commonValidationRules.namingConventions(field.name));
          errors.push(...commonValidationRules.reservedWords(field.name));
        }
      }
      
      // Security checks
      warnings.push(...securityValidationRules.accessControl(collection));
      warnings.push(...securityValidationRules.authFields(collection.fields));
      
      // Performance checks
      warnings.push(...performanceValidationRules.indexedFields(collection.fields));
    }
    
    // Add suggestions
    if (!collection.admin?.useAsTitle) {
      suggestions.push({
        message: "Consider adding 'useAsTitle' to specify which field to use as the title in the admin UI.",
        code: `admin: { useAsTitle: 'title' }`
      });
    }
    
    if (!collection.timestamps) {
      suggestions.push({
        message: "Consider enabling timestamps to automatically track creation and update times.",
        code: `timestamps: true`
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      references: [
        {
          title: "Payload CMS Collections Documentation",
          url: "https://payloadcms.com/docs/configuration/collections"
        }
      ]
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
        references: [
          {
            title: "Payload CMS Collections Documentation",
            url: "https://payloadcms.com/docs/configuration/collections"
          }
        ]
      };
    }
    
    return {
      isValid: false,
      errors: [(error as Error).message],
      references: [
        {
          title: "Payload CMS Collections Documentation",
          url: "https://payloadcms.com/docs/configuration/collections"
        }
      ]
    };
  }
};

/**
 * Validates a Payload CMS field
 */
export const validateField = (code: string): ValidationResult => {
  try {
    // Parse the code to get a JavaScript object
    const field = eval(`(${code})`);
    
    // Validate against schema
    FieldSchema.parse(field);
    
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: { message: string; code?: string }[] = [];
    
    // Check naming conventions
    if (field.name) {
      errors.push(...commonValidationRules.namingConventions(field.name));
      errors.push(...commonValidationRules.reservedWords(field.name));
    }
    
    // Field-specific validations
    if (field.type === 'relationship' && !field.maxDepth) {
      warnings.push("Relationship field without maxDepth could lead to deep queries. Consider adding a maxDepth limit.");
      suggestions.push({
        message: "Add maxDepth to limit relationship depth",
        code: `maxDepth: 1`
      });
    }
    
    if (field.type === 'text' && field.required && !field.validate) {
      suggestions.push({
        message: "Consider adding validation for required text fields",
        code: `validate: (value) => {\n  if (!value || value.trim() === '') {\n    return 'This field is required';\n  }\n  return true;\n}`
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      references: [
        {
          title: "Payload CMS Fields Documentation",
          url: "https://payloadcms.com/docs/fields/overview"
        }
      ]
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
        references: [
          {
            title: "Payload CMS Fields Documentation",
            url: "https://payloadcms.com/docs/fields/overview"
          }
        ]
      };
    }
    
    return {
      isValid: false,
      errors: [(error as Error).message],
      references: [
        {
          title: "Payload CMS Fields Documentation",
          url: "https://payloadcms.com/docs/fields/overview"
        }
      ]
    };
  }
};

/**
 * Validates a Payload CMS global
 */
export const validateGlobal = (code: string): ValidationResult => {
  try {
    // Parse the code to get a JavaScript object
    const global = eval(`(${code})`);
    
    // Validate against schema
    GlobalSchema.parse(global);
    
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: { message: string; code?: string }[] = [];
    
    // Check naming conventions
    if (global.slug) {
      errors.push(...commonValidationRules.namingConventions(global.slug));
      errors.push(...commonValidationRules.reservedWords(global.slug));
    }
    
    // Check fields
    if (global.fields) {
      for (const field of global.fields) {
        if (field.name) {
          errors.push(...commonValidationRules.namingConventions(field.name));
          errors.push(...commonValidationRules.reservedWords(field.name));
        }
      }
      
      // Security checks
      warnings.push(...securityValidationRules.accessControl(global));
      warnings.push(...securityValidationRules.authFields(global.fields));
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      references: [
        {
          title: "Payload CMS Globals Documentation",
          url: "https://payloadcms.com/docs/configuration/globals"
        }
      ]
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
        references: [
          {
            title: "Payload CMS Globals Documentation",
            url: "https://payloadcms.com/docs/configuration/globals"
          }
        ]
      };
    }
    
    return {
      isValid: false,
      errors: [(error as Error).message],
      references: [
        {
          title: "Payload CMS Globals Documentation",
          url: "https://payloadcms.com/docs/configuration/globals"
        }
      ]
    };
  }
};

/**
 * Validates a Payload CMS config
 */
export const validateConfig = (code: string): ValidationResult => {
  try {
    // Parse the code to get a JavaScript object
    const config = eval(`(${code})`);
    
    // Validate against schema
    ConfigSchema.parse(config);
    
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: { message: string; code?: string }[] = [];
    
    // Config-specific validations
    if (!config.serverURL) {
      warnings.push("Missing serverURL in config. This is required for proper URL generation.");
      suggestions.push({
        message: "Add serverURL to your config",
        code: `serverURL: 'http://localhost:3000'`
      });
    }
    
    if (!config.admin) {
      suggestions.push({
        message: "Consider configuring the admin panel",
        code: `admin: {\n  user: 'users',\n  meta: {\n    titleSuffix: '- My Payload App',\n    favicon: '/favicon.ico',\n  }\n}`
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      references: [
        {
          title: "Payload CMS Configuration Documentation",
          url: "https://payloadcms.com/docs/configuration/overview"
        }
      ]
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
        references: [
          {
            title: "Payload CMS Configuration Documentation",
            url: "https://payloadcms.com/docs/configuration/overview"
          }
        ]
      };
    }
    
    return {
      isValid: false,
      errors: [(error as Error).message],
      references: [
        {
          title: "Payload CMS Configuration Documentation",
          url: "https://payloadcms.com/docs/configuration/overview"
        }
      ]
    };
  }
};

/**
 * Validates Payload CMS code based on the file type
 */
export const validatePayloadCode = (code: string, fileType: FileType): ValidationResult => {
  switch (fileType) {
    case 'collection':
      return validateCollection(code);
    case 'field':
      return validateField(code);
    case 'global':
      return validateGlobal(code);
    case 'config':
      return validateConfig(code);
    default:
      return {
        isValid: false,
        errors: [`Unknown file type: ${fileType}`],
      };
  }
}; 