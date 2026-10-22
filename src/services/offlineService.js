// Offline Reporting and Background Sync Engine
const QUEUE_STORAGE_KEY = 'smart_issue_offline_queue_v1';

class OfflineService {
  constructor() {
    this.isSimulatedOffline = false;
    this.listeners = [];

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange());
      window.addEventListener('offline', () => this.handleNetworkChange());
    }
  }

  isOnline() {
    if (this.isSimulatedOffline) return false;
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  setSimulatedOffline(status) {
    this.isSimulatedOffline = status;
    this.handleNetworkChange();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  handleNetworkChange() {
    const online = this.isOnline();
    this.listeners.forEach(cb => {
      try {
        cb(online, this.getQueuedReports().length);
      } catch (err) {
        console.error(err);
      }
    });
  }

  getQueuedReports() {
    try {
      const data = localStorage.getItem(QUEUE_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  queueReport(report) {
    const queue = this.getQueuedReports();
    const offlineItem = {
      ...report,
      id: `OFFLINE-${Date.now().toString().slice(-4)}`,
      isOfflineDraft: true,
      savedAt: new Date().toISOString()
    };
    queue.push(offlineItem);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    this.handleNetworkChange();
    return offlineItem;
  }

  clearQueue() {
    localStorage.removeItem(QUEUE_STORAGE_KEY);
    this.handleNetworkChange();
  }

  async syncQueue(submitHandler) {
    const queue = this.getQueuedReports();
    if (queue.length === 0) return [];

    const syncedResults = [];
    for (const item of queue) {
      // Remove offline temporary flags
      const { isOfflineDraft, savedAt, ...cleanReport } = item;
      const synced = await submitHandler(cleanReport, true);
      syncedResults.push(synced);
    }

    this.clearQueue();
    return syncedResults;
  }
}

export const offlineService = new OfflineService();
