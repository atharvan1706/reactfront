// src/services/questdb.js
import axios from 'axios';

const API_URL = 'https://reactback-production-6cd8.up.railway.app/api/questdb/query';
const PLANT_ID = 'plantA';

class QuestDBService {
  // Execute custom SQL query
  async query(sql) {
    try {
      const response = await axios.get(API_URL, {
        params: {
          sql,
          plantId: PLANT_ID
        }
      });
      return this.formatData(response.data);
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  // Get OPC tag data (using actual table name: opc_tag_data)
  async getOpcTags(limit = 100, timeRange = '1') {
    const sql = `
      SELECT timestamp, tag_name, value, quality
      FROM opc_tag_data
      ORDER BY timestamp DESC
      LIMIT 200;
    `;
    return await this.query(sql);
  }

  // Get OPCUA tag data
  async getOpcuaTags(limit = 100, timeRange = '1') {
    try {
      const sql = `SELECT timestamp, tag_name, value, quality, staleness_ms, device_id 
                   FROM opcua_tag_data 
                   WHERE timestamp > dateadd('h', -${parseInt(timeRange)}, now()) 
                   ORDER BY timestamp DESC 
                   LIMIT ${limit}`;
      return await this.query(sql);
    } catch (error) {
      console.error('Error fetching OPCUA tags:', error);
      throw error;
    }
  }

  // Get OPC cycle stats
  async getOpcStats(limit = 100, timeRange = '1') {
    try {
      const sql = `SELECT timestamp, bridge_id, device_id, cycle, 
                          total_tags, success_count, error_count, avg_latency_ms
                   FROM opc_cycle_stats 
                   WHERE timestamp > dateadd('h', -${parseInt(timeRange)}, now()) 
                   ORDER BY timestamp DESC 
                   LIMIT ${limit}`;
      return await this.query(sql);
    } catch (error) {
      console.error('Error fetching OPC stats:', error);
      throw error;
    }
  }

  // Get sensor data (using actual table name: sensor_data)
  async getSensors(limit = 100, timeRange = '1') {
    try {
      const sql = `SELECT timestamp, device_id, mqtt_topic, bridge_id, 
                          source_broker, payload_size_bytes, data
                   FROM sensor_data 
                   WHERE timestamp > dateadd('h', -${parseInt(timeRange)}, now()) 
                   ORDER BY timestamp DESC 
                   LIMIT ${limit}`;
      return await this.query(sql);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  }

  // Get available tables
  async getTables() {
    try {
      const sql = `SELECT table_name FROM tables()`;
      return await this.query(sql);
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw error;
    }
  }

  // Get latest values by tag name
  async getLatestValues(tagNames = []) {
    try {
      const tagFilter = tagNames.length > 0 
        ? `WHERE tag_name IN (${tagNames.map(t => `'${t}'`).join(',')})`
        : '';
      
      const sql = `SELECT tag_name, value, timestamp, quality, device_id
                   FROM opc_tag_data 
                   ${tagFilter}
                   LATEST ON timestamp PARTITION BY tag_name`;
      return await this.query(sql);
    } catch (error) {
      console.error('Error fetching latest values:', error);
      throw error;
    }
  }

  // Get aggregated tag data
  async getTagAggregates(tagName, timeRange = '1') {
    try {
      const sql = `SELECT 
                     timestamp,
                     tag_name,
                     avg(value) as avg_value,
                     min(value) as min_value,
                     max(value) as max_value,
                     count() as count
                   FROM opc_tag_data 
                   WHERE tag_name = '${tagName}'
                     AND timestamp > dateadd('h', -${parseInt(timeRange)}, now())
                   SAMPLE BY 5m ALIGN TO CALENDAR
                   ORDER BY timestamp DESC`;
      return await this.query(sql);
    } catch (error) {
      console.error('Error fetching tag aggregates:', error);
      throw error;
    }
  }

  // Format QuestDB response to array of objects
  // ✅ UPDATED: Now handles both array and object formats
  formatData(questdbResponse) {
  if (!questdbResponse || !questdbResponse.dataset || !questdbResponse.columns) {
    return [];
  }

  const columns = questdbResponse.columns;
  const dataset = questdbResponse.dataset;

  if (dataset.length === 0) {
    return [];
  }

  const firstRow = dataset[0];
  const isArrayFormat = Array.isArray(firstRow);
  
  // Numeric types that need coercion
  const numericTypes = ['DOUBLE', 'REAL', 'INTEGER', 'BIGINT', 'SMALLINT', 'FLOAT', 'NUMERIC', 'DECIMAL'];

  return dataset.map(row => {
    const obj = {};
    
    columns.forEach((col, index) => {
      let value = isArrayFormat ? row[index] : row[col.name];
      
      // Handle timestamps
      if (col.type === 'TIMESTAMP') {
        value = this.formatTimestamp(value);
      }
      
      // ✅ Coerce numeric types to actual numbers
      if (numericTypes.includes(col.type?.toUpperCase())) {
        if (typeof value === 'string' && value.trim() !== '') {
          const num = Number(value);
          value = isNaN(num) ? 0 : num;
        } else if (value === null || value === undefined || value === '') {
          value = 0;
        }
      }
      
      obj[col.name] = value;
    });
    
    return obj;
  });
}

  // Format timestamp for display
  formatTimestamp(timestamp) {
    if (!timestamp) return null;

    let date;
    
    // QuestDB returns timestamps as microseconds
    if (typeof timestamp === 'number') {
      if (timestamp > 1000000000000000) {
        // Microseconds
        date = new Date(timestamp / 1000);
      } else if (timestamp > 1000000000000) {
        // Milliseconds
        date = new Date(timestamp);
      } else {
        // Seconds
        date = new Date(timestamp * 1000);
      }
    } else {
      date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) {
      return timestamp;
    }

    return date.toISOString();
  }

  // Format for charts (add display time)
  formatForChart(data, timestampField = 'timestamp', valueField = 'value') {
    return data.map(item => {
      const timestamp = item[timestampField];
      let displayTime = 'N/A';

      if (timestamp) {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          displayTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });
        }
      }

      return {
        ...item,
        _time: displayTime,
        _timestamp: timestamp,
        _value: item[valueField] // Normalize value field
      };
    }).reverse(); // Reverse for chronological order
  }
}

export default new QuestDBService();
