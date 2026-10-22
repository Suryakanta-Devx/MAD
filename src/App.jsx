import React, { useState, useEffect, useCallback } from 'react';
import AndroidFrame from './components/AndroidFrame';
import HeaderBar from './components/HeaderBar';
import BottomNavBar from './components/BottomNavBar';
import ReportIssueForm from './components/ReportIssueForm';
import MyReportsList from './components/MyReportsList';
import CityIssuesMap from './components/CityIssuesMap';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SuccessSubmitModal from './components/SuccessSubmitModal';
import IssueDetailModal from './components/IssueDetailModal';
import NotificationCenterModal from './components/NotificationCenterModal';
import NotificationToast from './components/NotificationToast';
import AccessibilityModal from './components/AccessibilityModal';
import { storageService } from './services/storageService';
import { notificationService } from './services/notificationService';
import { offlineService } from './services/offlineService';
import { i18n } from './services/i18nService';
import { RefreshCw, WifiOff } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentTab, setCurrentTab] = useState('report');
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [lastSubmittedReport, setLastSubmittedReport] = useState(null);
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);

  // Innovation & Notification States
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  // Accessibility States
  const [currentLanguage, setCurrentLanguage] = useState(i18n.getCurrentLanguage());
  const [highContrast, setHighContrast] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  // Offline Engine States
  const [isOnline, setIsOnline] = useState(offlineService.isOnline());
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load initial reports and notifications
  useEffect(() => {
    const loadedReports = storageService.getReports();
    setReports(loadedReports);

    const loadedNotifs = notificationService.getNotifications();
    setNotifications(loadedNotifs);

    setOfflineQueueCount(offlineService.getQueuedReports().length);

    // Auto-detect if screen is already a small mobile device (< 500px)
    if (window.innerWidth < 500) {
      setIsDeviceFrame(false);
    }
  }, []);

  // Subscribe to Notification Service updates
  useEffect(() => {
    const unsubscribeNotifs = notificationService.subscribe((updatedList, latest) => {
      setNotifications(updatedList);
      if (latest && !latest.read) {
        setActiveToast(latest);
      }
    });

    const unsubscribeOffline = offlineService.subscribe((onlineStatus, queueLen) => {
      setIsOnline(onlineStatus);
      setOfflineQueueCount(queueLen);
    });

    return () => {
      unsubscribeNotifs();
      unsubscribeOffline();
    };
  }, []);

  // Handle language change
  const handleChangeLanguage = (newLang) => {
    i18n.setLanguage(newLang);
    setCurrentLanguage(newLang);
  };

  // Handle report submission (supports both online submission and offline queueing)
  const handleReportSubmitted = (formData, isAutoSync = false) => {
    if (!isOnline && !isAutoSync) {
      // Offline queueing
      const queuedItem = offlineService.queueReport(formData);
      setOfflineQueueCount(prev => prev + 1);
      
      const notif = notificationService.addNotification({
        issueId: queuedItem.id,
        title: 'Draft Saved Offline',
        message: `Issue "${formData.title}" is saved locally. It will auto-sync when network returns.`,
        type: 'SUBMITTED'
      });

      alert(`Report saved to Offline Queue (${queuedItem.id}). Will sync automatically when connection restores.`);
      return queuedItem;
    }

    // Online submission
    const newReport = {
      ...formData,
      id: storageService.generateTicketId(),
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'SUBMITTED',
          time: new Date().toLocaleString(),
          note: 'Issue successfully logged into smart dispatch registry.'
        }
      ]
    };

    const updated = storageService.saveReport(newReport);
    setReports(updated);

    if (!isAutoSync) {
      setLastSubmittedReport(newReport);
    }

    // Dispatch confirmation notification
    notificationService.addNotification({
      issueId: newReport.id,
      title: `Report Logged: ${newReport.id}`,
      message: `Your report "${newReport.title}" has been registered in the municipal intake system.`,
      type: 'SUBMITTED'
    });

    return newReport;
  };

  // Handle sync of offline queue
  const handleSyncOfflineReports = async () => {
    setIsSyncing(true);
    try {
      await offlineService.syncQueue((cleanReport) => handleReportSubmitted(cleanReport, true));
      setOfflineQueueCount(0);
      notificationService.addNotification({
        title: 'Offline Sync Completed',
        message: 'All pending offline reports have been synchronized with the live city database.',
        type: 'RESOLVED'
      });
      alert('All queued offline reports synced successfully!');
    } catch (e) {
      console.error('Offline sync error:', e);
      alert('Sync encountered an issue. Retrying...');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle simulated offline toggle
  const handleToggleOfflineSimulated = () => {
    const nextVal = !isOfflineSimulated;
    setIsOfflineSimulated(nextVal);
    offlineService.setSimulatedOffline(nextVal);
  };

  // Handle status advance
  const handleUpdateStatus = (reportId, newStatus) => {
    const updated = storageService.updateStatus(reportId, newStatus);
    setReports(updated);
    if (selectedReport && selectedReport.id === reportId) {
      const fresh = updated.find(r => r.id === reportId);
      setSelectedReport(fresh || null);
    }
  };

  // Handle delete
  const handleDeleteReport = (reportId) => {
    if (window.confirm('Are you sure you want to remove this reported issue?')) {
      const updated = storageService.deleteReport(reportId);
      setReports(updated);
      setSelectedReport(null);
    }
  };

  // Reset to initial mock data
  const handleResetDemo = () => {
    if (window.confirm('Reset all issues to default mock sample data?')) {
      const reset = storageService.resetDefaults();
      setReports(reset);
      alert('Reports reset to initial demonstration samples.');
    }
  };

  // Export reports to JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `smart_issues_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Refresh Application & Return to Home
  const handleRefresh = () => {
    window.location.reload();
  };

  // Select ticket from notification click
  const handleSelectTicketFromNotif = (issueId) => {
    const found = reports.find(r => r.id === issueId);
    if (found) {
      setSelectedReport(found);
    } else {
      setCurrentTab('my_reports');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`app-container ${highContrast ? 'high-contrast' : ''} ${largeFont ? 'large-font' : ''}`}>
      <AndroidFrame isDeviceFrame={isDeviceFrame}>
        
        {/* App Top Bar */}
        <HeaderBar
          isDeviceFrame={isDeviceFrame}
          onToggleFrame={() => setIsDeviceFrame(!isDeviceFrame)}
          onResetDemo={handleResetDemo}
          onRefresh={handleRefresh}
          unreadCount={unreadCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenAccessibility={() => setIsAccessibilityOpen(true)}
          isOnline={isOnline}
          currentLanguage={currentLanguage}
        />

        {/* Offline Sync Banner if pending offline reports exist */}
        {offlineQueueCount > 0 && isOnline && (
          <div style={{
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #F59E0B',
            fontSize: '11px',
            color: '#92400E',
            zIndex: 25
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <WifiOff size={13} color="#D97706" />
              <span><strong>{offlineQueueCount}</strong> offline report(s) ready to sync</span>
            </div>
            <button
              type="button"
              onClick={handleSyncOfflineReports}
              disabled={isSyncing}
              style={{
                background: '#D97706',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <RefreshCw size={10} className={isSyncing ? 'spin-animation' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        )}

        {/* Heads-Up Notification Toast */}
        {activeToast && (
          <NotificationToast
            notification={activeToast}
            onClose={() => setActiveToast(null)}
            onClick={(n) => {
              if (n.issueId) handleSelectTicketFromNotif(n.issueId);
            }}
          />
        )}

        {/* Tab Content Body */}
        <main className="main-content-scroll">
          {currentTab === 'report' && (
            <ReportIssueForm 
              onSubmitReport={handleReportSubmitted} 
              existingReports={reports}
              isOnline={isOnline}
              currentLanguage={currentLanguage}
            />
          )}

          {currentTab === 'my_reports' && (
            <MyReportsList
              reports={reports}
              onSelectReport={(r) => setSelectedReport(r)}
              onExportJSON={handleExportJSON}
            />
          )}

          {currentTab === 'city_map' && (
            <CityIssuesMap
              reports={reports}
              onSelectReport={(r) => setSelectedReport(r)}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsDashboard 
              reports={reports} 
              currentLanguage={currentLanguage}
            />
          )}
        </main>

        {/* Bottom Android Navigation */}
        <BottomNavBar
          currentTab={currentTab}
          onSelectTab={(tabId) => setCurrentTab(tabId)}
          reportsCount={reports.filter(r => r.status !== 'RESOLVED').length}
          currentLanguage={currentLanguage}
        />
      </AndroidFrame>

      {/* Success Modal */}
      {lastSubmittedReport && (
        <SuccessSubmitModal
          report={lastSubmittedReport}
          onClose={() => setLastSubmittedReport(null)}
          onViewReports={() => {
            setLastSubmittedReport(null);
            setCurrentTab('my_reports');
          }}
        />
      )}

      {/* Issue Details Sheet */}
      {selectedReport && (
        <IssueDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteReport}
        />
      )}

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onSelectTicket={handleSelectTicketFromNotif}
        onRefreshNotifications={() => setNotifications(notificationService.getNotifications())}
        reports={reports}
      />

      {/* Accessibility & Localization Settings Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        largeFont={largeFont}
        onToggleLargeFont={() => setLargeFont(!largeFont)}
        ttsEnabled={ttsEnabled}
        onToggleTts={() => setTtsEnabled(!ttsEnabled)}
        isOfflineSimulated={isOfflineSimulated}
        onToggleOfflineSimulated={handleToggleOfflineSimulated}
        currentLanguage={currentLanguage}
        onChangeLanguage={handleChangeLanguage}
      />
    </div>
  );
}
