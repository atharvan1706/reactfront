import React, { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function RealtimeChart({ compact = false, color = "#3b82f6", label = "Value" }) {
  const [data, setData] = useState([]);
  const timer = useRef(null);

  useEffect(() => {
    const start = Array.from({ length: 20 }).map((_, i) => ({
      time: new Date(
        Date.now() - (19 - i) * 1000
      ).toLocaleTimeString('en-US', { hour12: false }),
      value: 40 + Math.random() * 20,
    }));
    setData(start); 

    timer.current = setInterval(() => {
      setData((prev) =>
        [
          ...prev,
          {
            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
            value:
              (prev[prev.length - 1]?.value || 50) +
              (Math.random() - 0.5) * 10,
          },
        ].slice(-50)
      );
    }, 1000);

    return () => clearInterval(timer.current);
  }, []);

  const currentValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || 0;
  const change = currentValue - previousValue;
  const changePercent = previousValue !== 0 ? ((change / previousValue) * 100).toFixed(1) : 0;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Stats Header */}
      <div style={{ 
        padding: "12px 16px", 
        display: "flex", 
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div>
          <div style={{ fontSize: "28px", fontWeight: "600", color: "#fff" }}>
            {currentValue.toFixed(1)}
          </div>
          <div style={{ 
            fontSize: "12px", 
            color: change >= 0 ? "#10b981" : "#ef4444",
            marginTop: "2px"
          }}>
            {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(2)} ({changePercent}%)
          </div>
        </div>
        <div style={{
          fontSize: "11px",
          color: "#94a3b8",
          textAlign: "right"
        }}>
          <div>Min: {Math.min(...data.map(d => d.value)).toFixed(1)}</div>
          <div>Max: {Math.max(...data.map(d => d.value)).toFixed(1)}</div>
          <div>Avg: {(data.reduce((a, b) => a + b.value, 0) / data.length).toFixed(1)}</div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0, padding: "8px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="time" 
              minTickGap={30}
              tick={{ fill: "#64748b", fontSize: 11 }}
              stroke="rgba(255,255,255,0.1)"
            />
            <YAxis 
              tick={{ fill: "#64748b", fontSize: 11 }}
              stroke="rgba(255,255,255,0.1)"
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "#fff"
              }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#gradient-${label})`}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}