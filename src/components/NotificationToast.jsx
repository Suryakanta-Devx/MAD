import React, { useEffect } from 'react';
import { Bell, X, ArrowRight } from 'lucide-react';

export default function NotificationToast({ notification, onClose, onClick }) {
  if (!notification) return null;

  useEffect(() => {
    // Vibrate device if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([80, 50, 80]);
      } catch (e) {
        console.warn('Vibration failed', e);
      }
    }

    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  return (
    <div 
      onClick={() => {
        if (onClick) onClick(notification);
        onClose();
      }}
      style={{
        position: 'absolute',
        top: '55px',
        left: '12px',
        right: '12px',
        zIndex: 9000,
        background: '#0F172A',
        color: '#FFFFFF',
        borderRadius: '16px',
        padding: '12px 14px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}
    >
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '10px',
        background: '#2563EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Bell size={16} color="#FFFFFF" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8' }}>
            STATUS UPDATE
          </span>
          {notification.issueId && (
            <span style={{ fontSize: '10px', color: '#94A3B8' }}>
              {notification.issueId}
            </span>
          )}
        </div>
        <div style={{
          fontSize: '12px',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {notification.title}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#94A3B8',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
}
