// Notification Service for Smart Issue Reporter
const NOTIF_STORAGE_KEY = 'smart_issue_notifications_v1';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-101',
    issueId: 'SIR-2026-4821',
    title: 'Crew Dispatched: Main Boulevard',
    message: 'Municipal Highway Works Division has assigned Maintenance Crew Alpha with asphalt patch machinery.',
    type: 'IN_PROGRESS',
    timestamp: '2026-09-26T09:30:00.000Z',
    read: false
  },
  {
    id: 'NOTIF-102',
    issueId: 'SIR-2026-3914',
    title: 'Under Review: Water Pipeline Burst',
    message: 'Water Supply & Sewerage Board (Division 3) has accepted the ticket and initiated an isolation valve review.',
    type: 'UNDER_REVIEW',
    timestamp: '2026-09-25T08:45:00.000Z',
    read: false
  },
  {
    id: 'NOTIF-103',
    issueId: 'SIR-2026-2105',
    title: 'Resolved: Sector 9 Streetlights',
    message: 'Technicians successfully replaced 4 circuit drivers. The dark zone has been illuminated and verified.',
    type: 'RESOLVED',
    timestamp: '2026-09-23T18:30:00.000Z',
    read: true
  }
];

class NotificationService {
  constructor() {
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners(notifications, latest = null) {
    this.listeners.forEach(cb => {
      try {
        cb(notifications, latest);
      } catch (err) {
        console.error('Error notifying listener:', err);
      }
    });
  }

  getNotifications() {
    try {
      const data = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  saveNotifications(list) {
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(list));
      this.notifyListeners(list);
    } catch (e) {
      console.error('Error saving notifications:', e);
    }
  }

  addNotification({ issueId, title, message, type = 'INFO' }) {
    const current = this.getNotifications();
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      issueId,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    const updated = [newNotif, ...current];
    this.saveNotifications(updated);
    this.notifyListeners(updated, newNotif);
    return newNotif;
  }

  markAsRead(notifId) {
    const current = this.getNotifications();
    const updated = current.map(n => n.id === notifId ? { ...n, read: true } : n);
    this.saveNotifications(updated);
    return updated;
  }

  markAllAsRead() {
    const current = this.getNotifications();
    const updated = current.map(n => ({ ...n, read: true }));
    this.saveNotifications(updated);
    return updated;
  }

  clearAll() {
    this.saveNotifications([]);
    return [];
  }

  getUnreadCount() {
    const list = this.getNotifications();
    return list.filter(n => !n.read).length;
  }

  simulateLiveUpdate(reports = []) {
    const samplePool = [
      {
        title: 'Dispatch Update: Campus Safety Rapid Response',
        message: 'A campus utility inspector has been dispatched to assess safety clearances on site.',
        type: 'IN_PROGRESS'
      },
      {
        title: 'Municipal Works: Materials Allocated',
        message: 'Repair supplies (LED modules, pipe connectors, cold-mix) allocated from central depot.',
        type: 'UNDER_REVIEW'
      },
      {
        title: 'Resolution Confirmed: Hazard Cleared',
        message: 'Field supervisor has verified hazard resolution. Public access safely restored.',
        type: 'RESOLVED'
      }
    ];

    const randomTemplate = samplePool[Math.floor(Math.random() * samplePool.length)];
    const targetReport = reports.length > 0 
      ? reports[Math.floor(Math.random() * reports.length)] 
      : { id: 'SIR-2026-LIVE' };

    return this.addNotification({
      issueId: targetReport.id,
      title: `${randomTemplate.title} (${targetReport.id})`,
      message: randomTemplate.message,
      type: randomTemplate.type
    });
  }
}

export const notificationService = new NotificationService();
