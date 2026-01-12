// src/services/realtimeService.js
class RealtimeService {
  constructor() {
    this.ws = null;
    this.subscriptions = new Map(); // queryId -> { sql, callback }
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.isConnected = false;
  }

  connect(token) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('Already connected to real-time service');
      return;
    }

    const wsUrl = `wss://reactback-production-6cd8.up.railway.app/ws/live?token=${token}`;
    
    console.log('🔌 Connecting to real-time service...');
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('✅ Real-time connection established');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Re-subscribe to all active queries
      for (const [queryId, sub] of this.subscriptions.entries()) {
        this.ws.send(JSON.stringify({
          type: 'SUBSCRIBE_QUERY',
          queryId: queryId,
          sql: sub.sql
        }));
      }
    };
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'QUERY_UPDATE') {
          const subscription = this.subscriptions.get(data.queryId);
          if (subscription && subscription.callback) {
            // Convert to same format as questDBService
            const formatted = this.formatData(data);
            subscription.callback(formatted, data.timestamp);
          }
        }
      } catch (err) {
        console.error('Error handling message:', err);
      }
    };
    
    this.ws.onclose = () => {
      console.log('❌ Real-time connection closed');
      this.isConnected = false;
      this.reconnect();
    };
    
    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };
  }
  
  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      this.reconnectAttempts++;
      
      console.log(`🔄 Reconnecting in ${delay/1000}s... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        const token = localStorage.getItem('token');
        if (token) {
          this.connect(token);
        }
      }, delay);
    } else {
      console.error('💀 Max reconnection attempts reached');
    }
  }
  
  /**
   * Subscribe to a SQL query for live updates
   * @param {string} sql - The SQL query
   * @param {function} callback - Callback function (data, timestamp) => void
   * @returns {string} queryId - Use this to unsubscribe later
   */
  subscribeToQuery(sql, callback) {
    const queryId = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.subscriptions.set(queryId, { sql, callback });
    
    // If already connected, subscribe immediately
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'SUBSCRIBE_QUERY',
        queryId: queryId,
        sql: sql
      }));
      
      console.log(`📡 Subscribed to query: ${queryId}`);
    }
    
    return queryId;
  }
  
  /**
   * Unsubscribe from a query
   * @param {string} queryId - The query ID from subscribeToQuery
   */
  unsubscribe(queryId) {
    this.subscriptions.delete(queryId);
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'UNSUBSCRIBE_QUERY',
        queryId: queryId
      }));
      
      console.log(`❌ Unsubscribed from: ${queryId}`);
    }
  }
  
  /**
   * Disconnect from real-time service
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  /**
   * Format data to match questDBService format
   */
  formatData(response) {
    const { columns, dataset } = response;
    
    if (!dataset || !columns) {
      return [];
    }
    
    return dataset.map(row => {
      const obj = {};
      columns.forEach((col, index) => {
        let value = row[index];
        
        // Handle timestamps
        if (col.type === 'TIMESTAMP') {
          value = this.formatTimestamp(value);
        }
        
        obj[col.name] = value;
      });
      return obj;
    });
  }

  /**
   * Format timestamp for display
   */
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

  /**
   * Format for charts (add display time)
   */
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

  /**
   * Get connection status
   */
  isReady() {
    return this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

export default new RealtimeService();
