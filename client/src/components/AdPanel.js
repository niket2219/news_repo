import React from 'react';

export default function AdPanel({ width = '100%', height = 250, label = 'Advertisement' }) {
  return (
    <div className="ad-panel" style={{ width, height, minHeight: height }}>
      <span>📢</span>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 12 }}>{label}</div>
        <div style={{ fontSize: 11, marginTop: 4 }}>{width} × {height}</div>
        <div style={{ fontSize: 10, marginTop: 8, color: '#bbb' }}>Your ad here</div>
      </div>
    </div>
  );
}
