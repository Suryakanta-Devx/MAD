import React from 'react';
import { PlusCircle, ClipboardList, Map, BarChart3 } from 'lucide-react';
import { i18n } from '../services/i18nService';

export default function BottomNavBar({ currentTab, onSelectTab, reportsCount, currentLanguage = 'en' }) {
  const tabs = [
    { id: 'report', label: i18n.t('tabReport', currentLanguage), icon: PlusCircle },
    { id: 'my_reports', label: i18n.t('tabMyReports', currentLanguage), icon: ClipboardList, badge: reportsCount },
    { id: 'city_map', label: i18n.t('tabCityMap', currentLanguage), icon: Map },
    { id: 'analytics', label: i18n.t('tabAnalytics', currentLanguage), icon: BarChart3 },
  ];

  return (
    <nav style={{
      position: 'sticky',
      bottom: 0,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      background: '#FFFFFF',
      borderTop: '1px solid #E2E8F0',
      padding: '8px 12px 6px',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      flexShrink: 0
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: isActive ? '#2563EB' : '#64748B',
              position: 'relative',
              padding: '4px 10px',
              borderRadius: '16px',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
          >
            {/* Active Pill Indicator (Android Material 3) */}
            <div style={{
              position: 'relative',
              padding: '4px 14px',
              borderRadius: '16px',
              background: isActive ? '#EFF6FF' : 'transparent',
              transition: 'background 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />

              {tab.badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '4px',
                  background: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '10px',
                  minWidth: '16px',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(239, 68, 68, 0.4)'
                }}>
                  {tab.badge}
                </span>
              )}
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: isActive ? 700 : 500,
              letterSpacing: '0.1px'
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
