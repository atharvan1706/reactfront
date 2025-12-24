import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function QuestDBChart({
  query,
  valueKey = 'avg_latency_ms',
  label = 'QuestDB Chart',
  pollIntervalMs = 2000
}) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const convertQuestDb = (resData) => {
    if (!resData || !resData.dataset || !resData.columns) return [];
    const cols = resData.columns;
    
    // Find the timestamp column index
    const timestampIndex = cols.findIndex(col => 
      col.name.toLowerCase().includes('timestamp') || 
      col.name.toLowerCase().includes('time') || 
      col.name.toLowerCase() === 'ts'
    );
    
    return resData.dataset.map(row => {
      const obj = {};
      for (let i = 0; i < cols.length; i++) {
        obj[cols[i].name] = row[i];
      }
      
      // Get timestamp from the row using the column index
      let timestampValue = timestampIndex >= 0 ? row[timestampIndex] : null;
      
      // Also try named properties
      if (!timestampValue) {
        timestampValue = obj.timestamp || obj.ts || obj.time;
      }
      
      console.log('Raw timestamp value:', timestampValue, 'Type:', typeof timestampValue);
      
      if (timestampValue) {
        let date;
        
        // QuestDB often returns timestamps as microseconds (number)
        if (typeof timestampValue === 'number') {
          // If it's a very large number, it's likely microseconds
          if (timestampValue > 1000000000000000) {
            date = new Date(timestampValue / 1000); // Convert microseconds to milliseconds
          } else if (timestampValue > 1000000000000) {
            date = new Date(timestampValue); // Already in milliseconds
          } else {
            date = new Date(timestampValue * 1000); // Seconds to milliseconds
          }
        } else {
          // Try parsing as string
          date = new Date(timestampValue);
        }
        
        if (!isNaN(date.getTime())) {
          obj._time = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false 
          });
        } else {
          obj._time = String(timestampValue).substring(0, 10);
        }
      } else {
        obj._time = 'N/A';
      }
      
      if (obj[valueKey] !== undefined) obj[valueKey] = Number(obj[valueKey]);
      return obj;
    }).reverse();
  };

  const fetchOnce = async () => {
    try {
      setError(null);
      const res = await axios.get('/api/exec', {
        params: { query }
      });
      console.log('QuestDB response:', res.data);
      console.log('Columns:', res.data.columns);
      console.log('First row:', res.data.dataset[0]);
      const formatted = convertQuestDb(res.data);
      console.log('Formatted data (first 3):', formatted.slice(0, 3));
      setData(formatted);
    } catch (err) {
      console.error('QuestDB fetch error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    fetchOnce();
    timerRef.current = setInterval(fetchOnce, pollIntervalMs);
    return () => clearInterval(timerRef.current);
  }, [query, pollIntervalMs]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <div style={{ fontWeight: 600, padding: '6px 8px', background: '#f9f9f9' }}>
        {label} {data.length > 0 && `(${data.length} points)`}
      </div>
      {error && (
        <div style={{ padding: '10px', background: '#fee', color: '#c00', borderRadius: '4px', margin: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="_time" 
              minTickGap={20}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey={valueKey} 
              dot={false} 
              stroke="#8884d8" 
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}