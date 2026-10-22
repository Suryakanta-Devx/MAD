import React from 'react';
import { 
  ShieldAlert, 
  RotateCcw, 
  Smartphone, 
  Monitor, 
  Bell, 
  Sliders, 
  WifiOff 
} from 'lucide-react';
import { i18n } from '../services/i18nService';

export default function HeaderBar({ 
  isDeviceFrame, 
  onToggleFrame, 
  onResetDemo, 
  onRefresh,
  unreadCount = 0,
  onOpenNotifications,
  onOpenAccessibility,
  isOnline = true,
  currentLanguage = 'en'
}) {
  const handleReload = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      width: '100%',
      background: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1000,
      gap: '8px',
      flexShrink: 0,
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      <button
        type="button"
        onClick={handleReload}
        title="Click to refresh application"
        className="logo-btn"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textAlign: 'left',
          minWidth: 0
        }}
      >
        <div 
          className="logo-shield"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 3px 8px rgba(37, 99, 235, 0.35)',
            flexShrink: 0
          }}
        >
          <ShieldAlert size={18} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h1 style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.3px',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {i18n.t('appTitle', currentLanguage)}
            </h1>
            
            {isOnline ? (
              <span style={{
                background: '#DCFCE7',
                color: '#15803D',
                fontSize: '9px',
                fontWeight: 800,
                padding: '1px 5px',
                borderRadius: '6px',
                flexShrink: 0
              }}>
                GPS ON
              </span>
            ) : (
              <span style={{
                background: '#FEE2E2',
                color: '#DC2626',
                fontSize: '9px',
                fontWeight: 800,
                padding: '1px 5px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                flexShrink: 0
              }}>
                <WifiOff size={9} />
                OFFLINE
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: '10px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {i18n.t('campusSubTitle', currentLanguage)}
          </p>
        </div>
      </button>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
        
        {/* Notification Bell */}
        <button
          type="button"
          onClick={onOpenNotifications}
          title="Notifications & Updates"
          style={{
            background: unreadCount > 0 ? '#EFF6FF' : '#F8FAFC',
            border: unreadCount > 0 ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            color: unreadCount > 0 ? '#1D4ED8' : '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              background: '#EF4444',
              color: '#FFFFFF',
              fontSize: '9px',
              fontWeight: 800,
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(239, 68, 68, 0.4)'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Accessibility & Settings Toggle */}
        <button
          type="button"
          onClick={onOpenAccessibility}
          title="Accessibility, Multilingual & Offline Settings"
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            color: '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Sliders size={14} />
        </button>

        {/* Reset Demo Data button */}
        <button
          type="button"
          onClick={onResetDemo}
          title="Reset to Sample Reports"
          style={{
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 7px',
            color: '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '11px',
            fontWeight: 500
          }}
        >
          <RotateCcw size={12} />
          <span style={{ display: 'none' }}>Reset</span>
        </button>

        {/* Frame Toggle */}
        <button
          type="button"
          onClick={onToggleFrame}
          title={isDeviceFrame ? 'Switch to Full Screen View' : 'Switch to Android Phone View'}
          style={{
            background: isDeviceFrame ? '#EFF6FF' : '#F1F5F9',
            border: isDeviceFrame ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '6px 7px',
            color: isDeviceFrame ? '#1D4ED8' : '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '11px',
            fontWeight: 600
          }}
        >
          {isDeviceFrame ? <Monitor size={12} /> : <Smartphone size={12} />}
        </button>
      </div>
    </header>
  );
}
