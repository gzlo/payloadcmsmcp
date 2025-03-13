import { FileType } from './validator';

export type ValidationRule = {
  id: string;
  description: string;
  type: FileType;
  category: 'security' | 'performance' | 'best-practice' | 'naming';
  severity: 'error' | 'warning' | 'suggestion';
  documentation: string;
};

// Define validation rules for Payload CMS
const validationRules: ValidationRule[] = [
  // Collection rules
  {
    id: 'collection-naming',
    description: 'Collection slugs should follow consistent naming conventions',
    type: 'collection',
    category: 'naming',
    severity: 'error',
    documentation: 'Collection slugs should use camelCase or snake_case consistently and avoid spaces or special characters.',
  },
  {
    id: 'collection-access-control',
    description: 'Collections should define access control',
    type: 'collection',
    category: 'security',
    severity: 'warning',
    documentation: 'Define access control for collections to prevent unauthorized access to data.',
  },
  {
    id: 'collection-timestamps',
    description: 'Collections should enable timestamps',
    type: 'collection',
    category: 'best-practice',
    severity: 'suggestion',
    documentation: 'Enable timestamps to automatically track creation and update times for documents.',
  },
  {
    id: 'collection-use-as-title',
    description: 'Collections should specify useAsTitle',
    type: 'collection',
    category: 'best-practice',
    severity: 'suggestion',
    documentation: 'Specify which field to use as the title in the admin UI for better usability.',
  },
  
  // Field rules
  {
    id: 'field-naming',
    description: 'Field names should follow consistent naming conventions',
    type: 'field',
    category: 'naming',
    severity: 'error',
    documentation: 'Field names should use camelCase or snake_case consistently and avoid spaces or special characters.',
  },
  {
    id: 'field-sensitive-access-control',
    description: 'Sensitive fields should have explicit access control',
    type: 'field',
    category: 'security',
    severity: 'warning',
    documentation: 'Fields containing sensitive information like passwords or tokens should have explicit read access control.',
  },
  {
    id: 'field-relationship-max-depth',
    description: 'Relationship fields should specify maxDepth',
    type: 'field',
    category: 'performance',
    severity: 'warning',
    documentation: 'Specify maxDepth for relationship fields to prevent deep queries that could impact performance.',
  },
  {
    id: 'field-text-validation',
    description: 'Required text fields should have validation',
    type: 'field',
    category: 'best-practice',
    severity: 'suggestion',
    documentation: 'Add validation for required text fields to ensure they contain valid data.',
  },
  {
    id: 'field-unique-index',
    description: 'Unique fields should be indexed',
    type: 'field',
    category: 'performance',
    severity: 'warning',
    documentation: 'Fields marked as unique should also be indexed for better query performance.',
  },
  
  // Global rules
  {
    id: 'global-naming',
    description: 'Global slugs should follow consistent naming conventions',
    type: 'global',
    category: 'naming',
    severity: 'error',
    documentation: 'Global slugs should use camelCase or snake_case consistently and avoid spaces or special characters.',
  },
  {
    id: 'global-access-control',
    description: 'Globals should define access control',
    type: 'global',
    category: 'security',
    severity: 'warning',
    documentation: 'Define access control for globals to prevent unauthorized access to data.',
  },
  
  // Config rules
  {
    id: 'config-server-url',
    description: 'Config should specify serverURL',
    type: 'config',
    category: 'best-practice',
    severity: 'warning',
    documentation: 'Specify serverURL in the config for proper URL generation.',
  },
  {
    id: 'config-admin-settings',
    description: 'Config should configure admin panel',
    type: 'config',
    category: 'best-practice',
    severity: 'suggestion',
    documentation: 'Configure the admin panel for better usability and branding.',
  },
];

/**
 * Query validation rules based on search term and file type
 */
export const queryValidationRules = (
  query: string,
  fileType?: FileType
): ValidationRule[] => {
  const searchTerms = query.toLowerCase().split(/\s+/);
  
  return validationRules.filter(rule => {
    // Filter by file type if specified
    if (fileType && rule.type !== fileType) {
      return false;
    }
    
    // Check if all search terms match
    return searchTerms.every(term => 
      rule.id.toLowerCase().includes(term) ||
      rule.description.toLowerCase().includes(term) ||
      rule.category.toLowerCase().includes(term) ||
      rule.severity.toLowerCase().includes(term) ||
      rule.documentation.toLowerCase().includes(term)
    );
  });
};

/**
 * Execute an SQL-like query against validation rules
 */
export const executeSqlQuery = (sqlQuery: string): any[] => {
  // This is a very simplified SQL parser
  // In a real implementation, you'd use a proper SQL parser
  
  const selectMatch = sqlQuery.match(/SELECT\s+(.*?)\s+FROM\s+(.*?)(?:\s+WHERE\s+(.*?))?(?:\s+ORDER\s+BY\s+(.*?))?(?:\s+LIMIT\s+(\d+))?$/i);
  
  if (!selectMatch) {
    throw new Error('Invalid SQL query format');
  }
  
  const [, selectClause, fromClause, whereClause, orderByClause, limitClause] = selectMatch;
  
  // Check if we're querying validation_rules
  if (fromClause.trim().toLowerCase() !== 'validation_rules') {
    throw new Error('Only validation_rules table is supported');
  }
  
  // Process SELECT clause
  const selectAll = selectClause.trim() === '*';
  const selectedFields = selectAll 
    ? ['id', 'description', 'type', 'category', 'severity', 'documentation']
    : selectClause.split(',').map(f => f.trim());
  
  // Process WHERE clause
  let filteredRules = [...validationRules];
  if (whereClause) {
    // Very simple WHERE parser that handles basic conditions
    const conditions = whereClause.split(/\s+AND\s+/i);
    
    filteredRules = filteredRules.filter(rule => {
      return conditions.every(condition => {
        const equalityMatch = condition.match(/(\w+)\s*=\s*['"]?(.*?)['"]?$/i);
        const likeMatch = condition.match(/(\w+)\s+LIKE\s+['"]%(.*?)%['"]/i);
        
        if (equalityMatch) {
          const [, field, value] = equalityMatch;
          return rule[field as keyof ValidationRule]?.toString().toLowerCase() === value.toLowerCase();
        } else if (likeMatch) {
          const [, field, value] = likeMatch;
          return rule[field as keyof ValidationRule]?.toString().toLowerCase().includes(value.toLowerCase());
        }
        
        return true;
      });
    });
  }
  
  // Process ORDER BY clause
  if (orderByClause) {
    const [field, direction] = orderByClause.split(/\s+/);
    const isDesc = direction?.toUpperCase() === 'DESC';
    
    filteredRules.sort((a, b) => {
      const aValue = a[field.trim() as keyof ValidationRule];
      const bValue = b[field.trim() as keyof ValidationRule];
      
      if (aValue < bValue) return isDesc ? 1 : -1;
      if (aValue > bValue) return isDesc ? -1 : 1;
      return 0;
    });
  }
  
  // Process LIMIT clause
  if (limitClause) {
    filteredRules = filteredRules.slice(0, parseInt(limitClause, 10));
  }
  
  // Project selected fields
  return filteredRules.map(rule => {
    const result: Record<string, any> = {};
    selectedFields.forEach(field => {
      result[field] = rule[field as keyof ValidationRule];
    });
    return result;
  });
}; 