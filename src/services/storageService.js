import { INITIAL_REPORTS } from '../constants/mockData';

const STORAGE_KEY = 'smart_issue_reports_v1';

export const storageService = {
  getReports: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Seed initial data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
        return INITIAL_REPORTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
      return INITIAL_REPORTS;
    }
  },

  saveReport: (report) => {
    try {
      const current = storageService.getReports();
      const updated = [report, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save report:', e);
      throw e;
    }
  },

  updateStatus: (reportId, newStatus, note = '') => {
    try {
      const current = storageService.getReports();
      const updated = current.map(item => {
        if (item.id === reportId) {
          const now = new Date();
          const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
          const newTimelineItem = {
            status: newStatus,
            time: timeStr,
            note: note || `Status updated to ${newStatus.replace('_', ' ')}.`
          };
          return {
            ...item,
            status: newStatus,
            timeline: [...(item.timeline || []), newTimelineItem]
          };
        }
        return item;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to update status:', e);
      return [];
    }
  },

  deleteReport: (reportId) => {
    try {
      const current = storageService.getReports();
      const updated = current.filter(item => item.id !== reportId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to delete report:', e);
      return [];
    }
  },

  resetDefaults: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
    return INITIAL_REPORTS;
  },

  generateTicketId: () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `SIR-${year}-${random}`;
  }
};
