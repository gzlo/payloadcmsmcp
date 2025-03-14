import { validationRules } from './validator';
import { FileType, ValidationRule } from './types';

/**
 * Query validation rules based on a search term
 * @param query The search query
 * @param fileType Optional file type to filter by
 * @returns Matching validation rules
 */
export function queryValidationRules(query: string, fileType?: FileType): ValidationRule[] {
  // Normalize the query
  const normalizedQuery = query.toLowerCase().trim();
  
  // If the query is empty, return all rules (filtered by fileType if provided)
  if (!normalizedQuery) {
    return fileType 
      ? validationRules.filter(rule => rule.fileTypes.includes(fileType))
      : validationRules;
  }
  
  // Search for matching rules
  return validationRules.filter(rule => {
    // Filter by fileType if provided
    if (fileType && !rule.fileTypes.includes(fileType)) {
      return false;
    }
    
    // Check if the query matches any of the rule's properties
    return (
      rule.id.toLowerCase().includes(normalizedQuery) ||
      rule.name.toLowerCase().includes(normalizedQuery) ||
      rule.description.toLowerCase().includes(normalizedQuery) ||
      rule.category.toLowerCase().includes(normalizedQuery)
    );
  });
}

/**
 * Get a validation rule by ID
 * @param id The rule ID
 * @returns The validation rule or undefined if not found
 */
export function getValidationRuleById(id: string): ValidationRule | undefined {
  return validationRules.find(rule => rule.id === id);
}

/**
 * Get validation rules by category
 * @param category The category to filter by
 * @returns Validation rules in the specified category
 */
export function getValidationRulesByCategory(category: string): ValidationRule[] {
  return validationRules.filter(rule => rule.category === category);
}

/**
 * Get validation rules by file type
 * @param fileType The file type to filter by
 * @returns Validation rules applicable to the specified file type
 */
export function getValidationRulesByFileType(fileType: FileType): ValidationRule[] {
  return validationRules.filter(rule => rule.fileTypes.includes(fileType));
}

/**
 * Get all available categories
 * @returns Array of unique categories
 */
export function getCategories(): string[] {
  const categories = new Set<string>();
  validationRules.forEach(rule => categories.add(rule.category));
  return Array.from(categories);
}

/**
 * Get validation rules with examples
 * @param query Optional search query
 * @param fileType Optional file type to filter by
 * @returns Validation rules with examples
 */
export function getValidationRulesWithExamples(query?: string, fileType?: FileType): ValidationRule[] {
  return query ? queryValidationRules(query, fileType) : 
    fileType ? getValidationRulesByFileType(fileType) : validationRules;
}

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