// simpleTransformations.js - UPDATED VERSION
// This version works with ANY field, not just "value"

class SimpleTransformations {
  
  // Helper: Get the first numeric field from data
  static getNumericField(data) {
    if (!data || data.length === 0) return null;
    
    const firstItem = data[0];
    // Find first numeric field (skip timestamp fields)
    for (const key in firstItem) {
      if (typeof firstItem[key] === 'number' && 
          !key.includes('timestamp') && 
          !key.startsWith('_')) {
        return key;
      }
    }
    return null;
  }
  
  // 1. MOVING AVERAGE - Smooths out data
  static movingAverage(data, windowSize = 5, fieldName = null) {
    if (!data || data.length === 0) return data;
    
    // Auto-detect field if not provided
    const field = fieldName || this.getNumericField(data);
    if (!field) return data;
    
    const result = [];
    
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const window = data.slice(start, i + 1);
      
      const sum = window.reduce((total, item) => total + (item[field] || 0), 0);
      const avg = sum / window.length;
      
      result.push({
        ...data[i],
        [field]: avg,
        [`_original_${field}`]: data[i][field]
      });
    }
    
    return result;
  }
  
  // 2. REMOVE OUTLIERS - Remove crazy high/low values
  static removeOutliers(data, fieldName = null) {
    if (!data || data.length === 0) return data;
    
    const field = fieldName || this.getNumericField(data);
    if (!field) return data;
    
    const values = data.map(item => item[field]).filter(v => v != null);
    
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    return data.filter(item => {
      const val = item[field];
      return val >= lowerBound && val <= upperBound;
    });
  }
  
  // 3. FILL MISSING VALUES - Replace null/undefined with average
  static fillMissing(data, fieldName = null) {
    if (!data || data.length === 0) return data;
    
    const field = fieldName || this.getNumericField(data);
    if (!field) return data;
    
    const result = [...data];
    
    for (let i = 0; i < result.length; i++) {
      if (result[i][field] == null) {
        let prevValue = null;
        for (let j = i - 1; j >= 0; j--) {
          if (result[j][field] != null) {
            prevValue = result[j][field];
            break;
          }
        }
        
        let nextValue = null;
        for (let j = i + 1; j < result.length; j++) {
          if (result[j][field] != null) {
            nextValue = result[j][field];
            break;
          }
        }
        
        if (prevValue != null && nextValue != null) {
          result[i][field] = (prevValue + nextValue) / 2;
        } else if (prevValue != null) {
          result[i][field] = prevValue;
        } else if (nextValue != null) {
          result[i][field] = nextValue;
        }
      }
    }
    
    return result;
  }
  
  // 4. SCALE VALUES - Multiply all values by a number
  static scale(data, multiplier = 1, fieldName = null) {
    if (!data || data.length === 0) return data;
    
    const field = fieldName || this.getNumericField(data);
    if (!field) return data;
    
    return data.map(item => ({
      ...item,
      [field]: (item[field] || 0) * multiplier
    }));
  }
  
  // 5. OFFSET VALUES - Add/subtract a number from all values
  static offset(data, amount = 0, fieldName = null) {
    if (!data || data.length === 0) return data;
    
    const field = fieldName || this.getNumericField(data);
    if (!field) return data;
    
    console.log(`📊 Applying offset of ${amount} to field: ${field}`);
    
    return data.map(item => ({
      ...item,
      [field]: (item[field] || 0) + amount
    }));
  }
  
  // MAIN FUNCTION: Apply multiple transformations in order
  static applyTransformations(data, transformations) {
    let result = data;
    
    console.log('🔄 Starting transformations:', transformations);
    console.log('📊 Original data (first item):', result[0]);
    
    for (const transform of transformations) {
      const beforeCount = result.length;
      
      switch (transform.type) {
        case 'movingAverage':
          result = this.movingAverage(result, transform.window || 5, transform.field);
          console.log(`✅ Applied moving average (window: ${transform.window || 5})`);
          break;
        case 'removeOutliers':
          result = this.removeOutliers(result, transform.field);
          console.log(`✅ Removed outliers (${beforeCount - result.length} points removed)`);
          break;
        case 'fillMissing':
          result = this.fillMissing(result, transform.field);
          console.log(`✅ Filled missing values`);
          break;
        case 'scale':
          result = this.scale(result, transform.multiplier || 1, transform.field);
          console.log(`✅ Scaled by ${transform.multiplier || 1}`);
          break;
        case 'offset':
          result = this.offset(result, transform.amount || 0, transform.field);
          console.log(`✅ Offset by ${transform.amount || 0}`);
          break;
      }
    }
    
    console.log('📊 Final data (first item):', result[0]);
    
    return result;
  }
}

export default SimpleTransformations;