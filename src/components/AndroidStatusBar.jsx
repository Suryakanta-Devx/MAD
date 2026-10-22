import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export default function AndroidStatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const formatted = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      height: '32px',
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      fontSize: '12px',
      fontWeight: 600,
      color: '#0F172A',
      userSelect: 'none',
      zIndex: 1002,
      letterSpacing: '0.2px',
      flexShrink: 0
    }}>
      {/* Time on left (Android standard) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>{time || '11:54'}</span>
      </div>

      {/* Camera punch-hole simulation */}
      <div style={{
        width: '12px',
        height: '12px',
        background: '#0F172A',
        borderRadius: '50%',
        boxShadow: 'inset 0 0 2px rgba(255,255,255,0.4)'
      }} />

      {/* Network / Battery status on right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Signal size={13} strokeWidth={2.5} />
        <Wifi size={13} strokeWidth={2.5} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '11px' }}>88%</span>
          <BatteryMedium size={15} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}
