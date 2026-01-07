// simpleTransformations.js - FINAL WORKING VERSION
// This transforms ALL numeric fields in your data

class SimpleTransformations {
  
  // Helper: Get ALL numeric fields from data
  static getNumericFields(data) {
    if (!data || data.length === 0) return [];
    
    const firstItem = data[0];
    const numericFields = [];
    
    for (const key in firstItem) {
      if (typeof firstItem[key] === 'number' && 
          !key.includes('timestamp') && 
          !key.startsWith('_')) {
        numericFields.push(key);
      }
    }
    
    return numericFields;
  }
  
  // 1. MOVING AVERAGE - Smooths out data
  static movingAverage(data, windowSize = 5) {
    if (!data || data.length === 0) return data;
    
    const fields = this.getNumericFields(data);
    if (fields.length === 0) return data;
    
    const result = [];
    
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const window = data.slice(start, i + 1);
      
      const newItem = { ...data[i] };
      
      // Apply moving average to ALL numeric fields
      fields.forEach(field => {
        const sum = window.reduce((total, item) => total + (item[field] || 0), 0);
        const avg = sum / window.length;
        newItem[field] = avg;
        newItem[`_original_${field}`] = data[i][field];
      });
      
      result.push(newItem);
    }
    
    console.log(`✅ Applied moving average to fields: ${fields.join(', ')}`);
    return result;
  }
  
  // 2. REMOVE OUTLIERS - Remove crazy high/low values
  static removeOutliers(data) {
    if (!data || data.length === 0) return data;
    
    const fields = this.getNumericFields(data);
    if (fields.length === 0) return data;
    
    // Use the first numeric field to detect outliers
    const field = fields[0];
    const values = data.map(item => item[field]).filter(v => v != null);
    
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    const filtered = data.filter(item => {
      const val = item[field];
      return val >= lowerBound && val <= upperBound;
    });
    
    console.log(`✅ Removed ${data.length - filtered.length} outliers based on ${field}`);
    return filtered;
  }
  
  // 3. FILL MISSING VALUES - Replace null/undefined with interpolated values
  static fillMissing(data) {
    if (!data || data.length === 0) return data;
    
    const fields = this.getNumericFields(data);
    if (fields.length === 0) return data;
    
    const result = [...data];
    
    // Fill missing values for each numeric field
    fields.forEach(field => {
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
    });
    
    console.log(`✅ Filled missing values in fields: ${fields.join(', ')}`);
    return result;
  }
  
  // 4. SCALE VALUES - Multiply ALL numeric values by a number
  static scale(data, multiplier = 1) {
    if (!data || data.length === 0) return data;
    
    const fields = this.getNumericFields(data);
    if (fields.length === 0) return data;
    
    console.log(`📊 Scaling fields: ${fields.join(', ')} by ${multiplier}`);
    
    const result = data.map(item => {
      const newItem = { ...item };
      
      // Scale ALL numeric fields
      fields.forEach(field => {
        newItem[field] = (item[field] || 0) * multiplier;
      });
      
      return newItem;
    });
    
    console.log(`✅ Scaled ${fields.length} fields by ${multiplier}`);
    return result;
  }
  
  // 5. OFFSET VALUES - Add/subtract a number from ALL numeric values
  static offset(data, amount = 0) {
    if (!data || data.length === 0) return data;
    
    const fields = this.getNumericFields(data);
    if (fields.length === 0) return data;
    
    console.log(`📊 Offsetting fields: ${fields.join(', ')} by ${amount}`);
    
    const result = data.map(item => {
      const newItem = { ...item };
      
      // Offset ALL numeric fields
      fields.forEach(field => {
        newItem[field] = (item[field] || 0) + amount;
      });
      
      return newItem;
    });
    
    console.log(`✅ Offset ${fields.length} fields by ${amount}`);
    return result;
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
          result = this.movingAverage(result, transform.window || 5);
          break;
        case 'removeOutliers':
          result = this.removeOutliers(result);
          break;
        case 'fillMissing':
          result = this.fillMissing(result);
          break;
        case 'scale':
          result = this.scale(result, transform.multiplier || 1);
          break;
        case 'offset':
          result = this.offset(result, transform.amount || 0);
          break;
        default:
          console.warn(`⚠️ Unknown transformation type: ${transform.type}`);
      }
    }
    
    console.log('📊 Final data (first item):', result[0]);
    console.log('✅ All transformations applied!');
    
    return result;
  }
}

export default SimpleTransformations;