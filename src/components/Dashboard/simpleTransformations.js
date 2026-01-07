// simpleTransformations.js
// Put this file in the same folder as your constants.js

// This file helps you transform (change) your data before showing it in charts

class SimpleTransformations {
  
  // 1. MOVING AVERAGE - Smooths out data
  // Example: [10, 20, 30] with window 2 → [10, 15, 25]
  static movingAverage(data, windowSize = 5) {
    if (!data || data.length === 0) return data;
    
    const result = [];
    
    for (let i = 0; i < data.length; i++) {
      // Get the window of data points
      const start = Math.max(0, i - windowSize + 1);
      const window = data.slice(start, i + 1);
      
      // Calculate average of the window
      const sum = window.reduce((total, item) => total + (item.value || 0), 0);
      const avg = sum / window.length;
      
      // Keep all original data, just change the value
      result.push({
        ...data[i],
        value: avg,
        _original: data[i].value // Keep original in case you want it
      });
    }
    
    return result;
  }
  
  // 2. REMOVE OUTLIERS - Remove crazy high/low values
  // Example: [10, 20, 15, 1000, 18] → [10, 20, 15, 18] (removes 1000)
  static removeOutliers(data) {
    if (!data || data.length === 0) return data;
    
    // Get all values
    const values = data.map(item => item.value).filter(v => v != null);
    
    // Calculate quartiles (25%, 75%)
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    
    // Define outlier boundaries
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    // Filter out outliers
    return data.filter(item => {
      const val = item.value;
      return val >= lowerBound && val <= upperBound;
    });
  }
  
  // 3. FILL MISSING VALUES - Replace null/undefined with average
  // Example: [10, null, 30, null] → [10, 20, 30, 30]
  static fillMissing(data) {
    if (!data || data.length === 0) return data;
    
    const result = [...data];
    
    for (let i = 0; i < result.length; i++) {
      if (result[i].value == null) {
        // Find previous valid value
        let prevValue = null;
        for (let j = i - 1; j >= 0; j--) {
          if (result[j].value != null) {
            prevValue = result[j].value;
            break;
          }
        }
        
        // Find next valid value
        let nextValue = null;
        for (let j = i + 1; j < result.length; j++) {
          if (result[j].value != null) {
            nextValue = result[j].value;
            break;
          }
        }
        
        // Fill with average of prev and next, or just one of them
        if (prevValue != null && nextValue != null) {
          result[i].value = (prevValue + nextValue) / 2;
        } else if (prevValue != null) {
          result[i].value = prevValue;
        } else if (nextValue != null) {
          result[i].value = nextValue;
        }
      }
    }
    
    return result;
  }
  
  // 4. SCALE VALUES - Multiply all values by a number
  // Example: [10, 20, 30] × 2 → [20, 40, 60]
  static scale(data, multiplier = 1) {
    if (!data || data.length === 0) return data;
    
    return data.map(item => ({
      ...item,
      value: item.value * multiplier
    }));
  }
  
  // 5. OFFSET VALUES - Add/subtract a number from all values
  // Example: [10, 20, 30] + 5 → [15, 25, 35]
  static offset(data, amount = 0) {
    if (!data || data.length === 0) return data;
    
    return data.map(item => ({
      ...item,
      value: item.value + amount
    }));
  }
  
  // MAIN FUNCTION: Apply multiple transformations in order
  static applyTransformations(data, transformations) {
    let result = data;
    
    // Apply each transformation one by one
    for (const transform of transformations) {
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
      }
    }
    
    return result;
  }
}

export default SimpleTransformations;
