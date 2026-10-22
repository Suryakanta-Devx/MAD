import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Sparkles, 
  Clock, 
  ExternalLink, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { notificationService } from '../services/notificationService';

export default function NotificationCenterModal({ 
  isOpen, 
  onClose, 
  notifications, 
  onSelectTicket,
  onRefreshNotifications,
  reports = []
}) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    if (onRefreshNotifications) onRefreshNotifications();
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all notification history?')) {
      notificationService.clearAll();
      if (onRefreshNotifications) onRefreshNotifications();
    }
  };

  const handleSimulateUpdate = () => {
    notificationService.simulateLiveUpdate(reports);
    if (onRefreshNotifications) onRefreshNotifications();
  };

  const handleNotificationClick = (item) => {
    notificationService.markAsRead(item.id);
    if (onRefreshNotifications) onRefreshNotifications();
    if (item.issueId && onSelectTicket) {
      onSelectTicket(item.issueId);
      onClose();
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'RESOLVED':
        return { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' };
      case 'IN_PROGRESS':
        return { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' };
      case 'UNDER_REVIEW':
        return { color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' };
      default:
        return { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' };
    }
  };

  const formatTime = (iso) => {
    if (!iso) return 'Just now';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return iso;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '440px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        animation: 'scaleUp 0.2s ease-out'
      }}>
        {/* Top Header */}
        <div style={{
          padding: '16px 20px',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB'
            }}>
              <Bell size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                  Notifications & Updates
                </h3>
                {unreadCount > 0 && (
                  <span style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '10px'
                  }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Status tracking for your reported issues
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              cursor: 'pointer'
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Action Bar */}
        <div style={{
          padding: '10px 16px',
          background: '#FFFFFF',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={handleSimulateUpdate}
            title="Click to trigger a real-time municipal status update"
            style={{
              background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
              border: '1px solid #93C5FD',
              borderRadius: '8px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#1D4ED8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={12} color="#F59E0B" />
            <span>Simulate Live Push Alert</span>
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCheck size={13} />
                <span>Mark Read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Notifications List */}
        <div style={{
          padding: '12px 16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: 1
        }}>
          {notifications.length === 0 ? (
            <div style={{
              padding: '36px 16px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              color: '#94A3B8'
            }}>
              <AlertCircle size={36} color="#CBD5E1" />
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                No Notifications Yet
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', maxWidth: '240px' }}>
                You'll receive live notifications whenever municipal crews update your issue's progress.
              </p>
            </div>
          ) : (
            notifications.map((item) => {
              const typeStyle = getTypeStyle(item.type);
              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  style={{
                    padding: '12px',
                    borderRadius: '14px',
                    background: item.read ? '#FFFFFF' : '#F8FAFC',
                    border: item.read ? '1px solid #E2E8F0' : `1.5px solid ${typeStyle.border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                    boxShadow: item.read ? 'none' : '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {!item.read && (
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#2563EB',
                          flexShrink: 0
                        }} />
                      )}
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: typeStyle.color,
                        background: typeStyle.bg,
                        padding: '1px 6px',
                        borderRadius: '6px',
                        border: `1px solid ${typeStyle.border}`
                      }}>
                        {item.type}
                      </span>
                      {item.issueId && (
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#334155' }}>
                          {item.issueId}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: '#94A3B8' }}>
                      <Clock size={10} />
                      <span>{formatTime(item.timestamp)}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', fontWeight: item.read ? 600 : 700, color: '#0F172A', lineHeight: 1.3 }}>
                    {item.title}
                  </div>

                  <p style={{ margin: 0, fontSize: '11px', color: '#475569', lineHeight: 1.4 }}>
                    {item.message}
                  </p>

                  {item.issueId && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '10px',
                      color: '#2563EB',
                      fontWeight: 600,
                      marginTop: '2px'
                    }}>
                      <span>View issue details</span>
                      <ExternalLink size={10} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
