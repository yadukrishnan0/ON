
// Helper function for validation
const validateRequiredParams = (obj, keys, objectName) => {
    for (const key of keys) {
      if (!obj[key]) {
        return `Missing required parameter: ${key} in ${objectName}`;
      }
    }
    return null;
  };
  module.exports = validateRequiredParams;