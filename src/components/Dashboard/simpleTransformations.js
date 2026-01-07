// simpleTransformations.js - COMPLETE VERSION
// Includes both basic and advanced transformations

class SimpleTransformations {
  
  // Helper: Get ALL numeric fields
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
  
  // ========== BASIC TRANSFORMATIONS ==========
  
  // 1. Moving Average
  static movingAverage(data, windowSize = 5) {
    if (!data || data.length === 0) return data;
    const fields = this.getNumericFields(data);
    if (fields.length === 0) return data;
    
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const window = data.slice(start, i + 1);
      const newItem = { ...data[i] };
      
      fields.forEach(field => {
        const sum = window.reduce((total, item) => total + (item[field] || 0), 0);
        newItem[field] = sum / window.length;
        newItem[`_original_${field}`] = data[i][field];
      });
      
      result.push(newItem);
    }
    
    console.log(`✅ Moving average (window: ${windowSize})`);
    return result;
  }
  
  // 2. Remove Outliers
  static removeOutliers(data) {
    if (!data || data.length === 0) return data;
    const fields = this.getNumericFields(data);
    if (fields.length === 0) return data;
    
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
    
    console.log(`✅ Removed ${data.length - filtered.length} outliers`);
    return filtered;
  }
  
  // 3. Fill Missing
  static fillMissing(data) {
    if (!data || data.length === 0) return data;
    const fields = this.getNumericFields(data);
    if (fields.length === 0) return data;
    
    const result = [...data];
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
    
    console.log(`✅ Filled missing values`);
    return result;
  }
  
  // 4. Scale
  static scale(data, multiplier = 1) {
    if (!data || data.length === 0) return data;
    const fields = this.getNumericFields(data);
    if (fields.length === 0) return data;
    
    const result = data.map(item => {
      const newItem = { ...item };
      fields.forEach(field => {
        newItem[field] = (item[field] || 0) * multiplier;
      });
      return newItem;
    });
    
    console.log(`✅ Scaled by ${multiplier}`);
    return result;
  }
  
  // 5. Offset
  static offset(data, amount = 0) {
    if (!data || data.length === 0) return data;
    const fields = this.getNumericFields(data);
    if (fields.length === 0) return data;
    
    const result = data.map(item => {
      const newItem = { ...item };
      fields.forEach(field => {
        newItem[field] = (item[field] || 0) + amount;
      });
      return newItem;
    });
    
    console.log(`✅ Offset by ${amount}`);
    return result;
  }
  
  // ========== ADVANCED TRANSFORMATIONS ==========
  
  // 6. Rate of Change
  static rateOfChange(data) {
    if (!data || data.length < 2) return data;
    const fields = this.getNumericFields(data);
    const result = [{ ...data[0] }];
    
    for (let i = 1; i < data.length; i++) {
      const newItem = { ...data[i] };
      fields.forEach(field => {
        newItem[field] = (data[i][field] || 0) - (data[i - 1][field] || 0);
        newItem[`_original_${field}`] = data[i][field];
      });
      result.push(newItem);
    }
    
    console.log(`✅ Calculated rate of change`);
    return result;
  }
  
  // 7. Percent Change
  static percentChange(data) {
    if (!data || data.length < 2) return data;
    const fields = this.getNumericFields(data);
    const result = [{ ...data[0] }];
    
    for (let i = 1; i < data.length; i++) {
      const newItem = { ...data[i] };
      fields.forEach(field => {
        const curr = data[i][field] || 0;
        const prev = data[i - 1][field] || 0;
        newItem[field] = prev !== 0 ? ((curr - prev) / prev) * 100 : 0;
        newItem[`_original_${field}`] = data[i][field];
      });
      result.push(newItem);
    }
    
    console.log(`✅ Calculated percent change`);
    return result;
  }
  
  // 8. Cumulative Sum
  static cumulativeSum(data) {
    if (!data || data.length === 0) return data;
    const fields = this.getNumericFields(data);
    const result = [];
    const sums = {};
    
    fields.forEach(field => { sums[field] = 0; });
    
    for (let i = 0; i < data.length; i++) {
      const newItem = { ...data[i] };
      fields.forEach(field => {
        sums[field] += data[i][field] || 0;
        newItem[field] = sums[field];
        newItem[`_original_${field}`] = data[i][field];
      });
      result.push(newItem);
    }
    
    console.log(`✅ Calculated cumulative sum`);
    return result;
  }
  
  // 9. Normalize (0-1)
  static normalize(data) {
    if (!data || data.length === 0) return data;
    const fields = this.getNumericFields(data);
    const ranges = {};
    
    fields.forEach(field => {
      const values = data.map(item => item[field]).filter(v => v != null);
      ranges[field] = {
        min: Math.min(...values),
        max: Math.max(...values)
      };
    });
    
    const result = data.map(item => {
      const newItem = { ...item };
      fields.forEach(field => {
        const { min, max } = ranges[field];
        const range = max - min;
        newItem[field] = range === 0 ? 0 : (item[field] - min) / range;
        newItem[`_original_${field}`] = item[field];
      });
      return newItem;
    });
    
    console.log(`✅ Normalized to 0-1 range`);
    return result;
  }
  
  // 10. Exponential Moving Average
  static exponentialMovingAverage(data, alpha = 0.3) {
    if (!data || data.length === 0) return data;
    const fields = this.getNumericFields(data);
    const result = [];
    const ema = {};
    
    fields.forEach(field => { ema[field] = data[0][field] || 0; });
    result.push({ ...data[0] });
    
    for (let i = 1; i < data.length; i++) {
      const newItem = { ...data[i] };
      fields.forEach(field => {
        const curr = data[i][field] || 0;
        ema[field] = alpha * curr + (1 - alpha) * ema[field];
        newItem[field] = ema[field];
        newItem[`_original_${field}`] = data[i][field];
      });
      result.push(newItem);
    }
    
    console.log(`✅ Applied EMA (alpha: ${alpha})`);
    return result;
  }
  
  // 11. Z-Score (Standardize)
  static zScore(data) {
    if (!data || data.length === 0) return data;
    const fields = this.getNumericFields(data);
    const stats = {};
    
    fields.forEach(field => {
      const values = data.map(item => item[field]).filter(v => v != null);
      const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
      const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
      stats[field] = { mean, stdDev: Math.sqrt(variance) };
    });
    
    const result = data.map(item => {
      const newItem = { ...item };
      fields.forEach(field => {
        const { mean, stdDev } = stats[field];
        newItem[field] = stdDev === 0 ? 0 : (item[field] - mean) / stdDev;
        newItem[`_original_${field}`] = item[field];
      });
      return newItem;
    });
    
    console.log(`✅ Calculated Z-scores`);
    return result;
  }
  
  // 12. Log Transform
  static logTransform(data, base = Math.E) {
    if (!data || data.length === 0) return data;
    const fields = this.getNumericFields(data);
    
    const result = data.map(item => {
      const newItem = { ...item };
      fields.forEach(field => {
        const value = item[field];
        newItem[field] = value > 0 ? Math.log(value) / Math.log(base) : 0;
        newItem[`_original_${field}`] = item[field];
      });
      return newItem;
    });
    
    console.log(`✅ Applied log transform`);
    return result;
  }
  
  // 13. Clip Values
  static clip(data, min = null, max = null) {
    if (!data || data.length === 0) return data;
    const fields = this.getNumericFields(data);
    
    const result = data.map(item => {
      const newItem = { ...item };
      fields.forEach(field => {
        let value = item[field];
        if (min !== null && value < min) value = min;
        if (max !== null && value > max) value = max;
        newItem[field] = value;
        newItem[`_original_${field}`] = item[field];
      });
      return newItem;
    });
    
    console.log(`✅ Clipped values (min: ${min}, max: ${max})`);
    return result;
  }
  
  // 14. Resample (Downsample)
  static resample(data, factor = 2) {
    if (!data || data.length === 0) return data;
    const result = [];
    for (let i = 0; i < data.length; i += factor) {
      result.push({ ...data[i] });
    }
    console.log(`✅ Resampled: ${data.length} → ${result.length} points`);
    return result;
  }
  
  // 15. Aggregate by Window
  static aggregateByWindow(data, windowSize = 5, method = 'avg') {
    if (!data || data.length === 0) return data;
    const fields = this.getNumericFields(data);
    const result = [];
    
    for (let i = 0; i < data.length; i += windowSize) {
      const window = data.slice(i, i + windowSize);
      const newItem = { ...data[i] };
      
      fields.forEach(field => {
        const values = window.map(item => item[field]).filter(v => v != null);
        if (values.length === 0) {
          newItem[field] = null;
        } else {
          switch (method) {
            case 'avg': newItem[field] = values.reduce((sum, v) => sum + v, 0) / values.length; break;
            case 'sum': newItem[field] = values.reduce((sum, v) => sum + v, 0); break;
            case 'min': newItem[field] = Math.min(...values); break;
            case 'max': newItem[field] = Math.max(...values); break;
            case 'first': newItem[field] = values[0]; break;
            case 'last': newItem[field] = values[values.length - 1]; break;
          }
        }
      });
      
      result.push(newItem);
    }
    
    console.log(`✅ Aggregated: ${data.length} → ${result.length} points (${method})`);
    return result;
  }
  
  // ========== MAIN FUNCTION ==========
  
  static applyTransformations(data, transformations) {
    let result = data;
    console.log('🔄 Starting transformations:', transformations);
    console.log('📊 Original data (first item):', result[0]);
    
    for (const transform of transformations) {
      switch (transform.type) {
        // Basic
        case 'movingAverage': result = this.movingAverage(result, transform.window || 5); break;
        case 'removeOutliers': result = this.removeOutliers(result); break;
        case 'fillMissing': result = this.fillMissing(result); break;
        case 'scale': result = this.scale(result, transform.multiplier || 1); break;
        case 'offset': result = this.offset(result, transform.amount || 0); break;
        
        // Advanced
        case 'rateOfChange': result = this.rateOfChange(result); break;
        case 'percentChange': result = this.percentChange(result); break;
        case 'cumulativeSum': result = this.cumulativeSum(result); break;
        case 'normalize': result = this.normalize(result); break;
        case 'exponentialMovingAverage': result = this.exponentialMovingAverage(result, transform.alpha || 0.3); break;
        case 'zScore': result = this.zScore(result); break;
        case 'logTransform': result = this.logTransform(result, transform.base || Math.E); break;
        case 'clip': result = this.clip(result, transform.min, transform.max); break;
        case 'resample': result = this.resample(result, transform.factor || 2); break;
        case 'aggregateByWindow': result = this.aggregateByWindow(result, transform.windowSize || 5, transform.method || 'avg'); break;
        
        default: console.warn(`⚠️ Unknown transformation: ${transform.type}`);
      }
    }
    
    console.log('📊 Final data (first item):', result[0]);
    console.log('✅ All transformations applied!');
    return result;
  }
}

export default SimpleTransformations;