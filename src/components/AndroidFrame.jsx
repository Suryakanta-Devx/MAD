import React from 'react';
import AndroidStatusBar from './AndroidStatusBar';
import AndroidNavBar from './AndroidNavBar';

export default function AndroidFrame({ isDeviceFrame, children }) {
  if (!isDeviceFrame) {
    return (
      <div style={{
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
        height: '100vh',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Android Device Outer Chassis */}
      <div style={{
        width: '100%',
        maxWidth: '414px',
        height: '840px',
        background: '#0F172A',
        borderRadius: '48px',
        padding: '11px',
        boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.45), 0 0 0 2px rgba(255, 255, 255, 0.1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        {/* Hardware buttons simulation */}
        <div style={{
          position: 'absolute',
          right: '-3px',
          top: '120px',
          width: '3px',
          height: '48px',
          background: '#334155',
          borderRadius: '0 3px 3px 0'
        }} />
        <div style={{
          position: 'absolute',
          right: '-3px',
          top: '185px',
          width: '3px',
          height: '70px',
          background: '#334155',
          borderRadius: '0 3px 3px 0'
        }} />

        {/* Screen Bezel & Screen Interior */}
        <div style={{
          width: '100%',
          height: '100%',
          background: '#FFFFFF',
          borderRadius: '38px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Top Status Bar */}
          <AndroidStatusBar />

          {/* App Body Content */}
          <div style={{ flex: 1, overflowY: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {children}
          </div>

          {/* Bottom Android Gesture Bar */}
          <AndroidNavBar />
        </div>
      </div>
    </div>
  );
}
