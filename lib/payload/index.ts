export * from './schemas';
export * from './validator';
export * from './query';

// Export a convenience function to check if a string is valid Payload CMS code
export const isValidPayloadCode = (code: string, fileType: 'collection' | 'field' | 'global' | 'config'): boolean => {
  try {
    const { validatePayloadCode } = require('./validator');
    const result = validatePayloadCode(code, fileType);
    return result.isValid;
  } catch (error) {
    return false;
  }
}; 