import React from 'react';

export default function AndroidNavBar() {
  return (
    <div style={{
      height: '24px',
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      borderTop: '1px solid rgba(0,0,0,0.04)',
      zIndex: 1002,
      flexShrink: 0
    }}>
      {/* Android Gesture Bar */}
      <div style={{
        width: '120px',
        height: '4px',
        backgroundColor: '#94A3B8',
        borderRadius: '999px',
        opacity: 0.7
      }} />
    </div>
  );
}
