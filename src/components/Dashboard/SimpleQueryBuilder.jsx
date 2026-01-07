// SimpleQueryBuilder.jsx
// Put this file in the same folder as your PanelConfigModal.jsx

import React, { useState, useEffect } from 'react';
import { Database, Clock, Filter } from 'lucide-react';

function SimpleQueryBuilder({ 
  table,           // Current selected table
  allTables,       // List of all tables
  onTableChange,   // What to do when table changes
  onQueryChange    // What to do when query is generated
}) {
  // State for building the query
  const [selectedTable, setSelectedTable] = useState(table || '');
  const [timeRange, setTimeRange] = useState('1'); // hours
  const [limit, setLimit] = useState(100);
  
  // When table changes, update parent and generate query
  useEffect(() => {
    if (selectedTable) {
      onTableChange(selectedTable);
      generateQuery();
    }
  }, [selectedTable, timeRange, limit]);
  
  // Simple function to create SQL query
  const generateQuery = () => {
    if (!selectedTable) return;
    
    const sql = `SELECT * FROM ${selectedTable} WHERE timestamp > dateadd('h', -${timeRange}, now()) ORDER BY timestamp DESC LIMIT ${limit}`;
    
    onQueryChange(sql);
  };

  return (
    <div style={{
      background: '#f9fafb',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: '#374151' }}>
        Query Builder (Easy Mode)
      </h3>
      
      {/* Step 1: Select Table */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '6px', 
          fontSize: '12px', 
          color: '#6b7280',
          fontWeight: '600'
        }}>
          <Database size={12} />
          1. Select Table
        </label>
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            color: '#111827',
            fontSize: '13px'
          }}
        >
          <option value="">Choose a table...</option>
          {allTables.map(tableName => (
            <option key={tableName} value={tableName}>{tableName}</option>
          ))}
        </select>
      </div>

      {/* Step 2: Time Range */}
      {selectedTable && (
        <div style={{ marginBottom: '12px' }}>
          <label style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px', 
            fontSize: '12px', 
            color: '#6b7280',
            fontWeight: '600'
          }}>
            <Clock size={12} />
            2. How far back?
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              color: '#111827',
              fontSize: '13px'
            }}
          >
            <option value="1">Last 1 hour</option>
            <option value="3">Last 3 hours</option>
            <option value="6">Last 6 hours</option>
            <option value="12">Last 12 hours</option>
            <option value="24">Last 24 hours</option>
            <option value="168">Last 7 days</option>
          </select>
        </div>
      )}

      {/* Step 3: Limit */}
      {selectedTable && (
        <div style={{ marginBottom: '12px' }}>
          <label style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px', 
            fontSize: '12px', 
            color: '#6b7280',
            fontWeight: '600'
          }}>
            <Filter size={12} />
            3. How many records?
          </label>
          <select
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              color: '#111827',
              fontSize: '13px'
            }}
          >
            <option value="50">50 records</option>
            <option value="100">100 records</option>
            <option value="200">200 records</option>
            <option value="500">500 records</option>
            <option value="1000">1000 records</option>
          </select>
        </div>
      )}
      
      {/* Info message */}
      {!selectedTable && (
        <div style={{
          padding: '12px',
          background: '#eff6ff',
          border: '1px solid #dbeafe',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#1e40af',
          marginTop: '12px'
        }}>
          💡 Select a table above to start building your query
        </div>
      )}
    </div>
  );
}

export default SimpleQueryBuilder;
