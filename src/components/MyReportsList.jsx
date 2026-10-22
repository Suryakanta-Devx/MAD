import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Camera, 
  ChevronRight, 
  FileQuestion,
  Download
} from 'lucide-react';
import { ISSUE_CATEGORIES, STATUS_TYPES } from '../constants/categories';

export default function MyReportsList({ reports, onSelectReport, onExportJSON }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Filter logic
  const filteredReports = reports.filter((item) => {
    // Search query match
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location?.address || '').toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter match
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (statusKey) => {
    const s = STATUS_TYPES[statusKey] || { label: statusKey, color: '#64748B', bg: '#F1F5F9' };
    return (
      <span style={{
        background: s.bg,
        color: s.color,
        fontSize: '11px',
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: '6px',
        border: `1px solid ${s.color}30`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.color }} />
        {s.label}
      </span>
    );
  };

  const getCategoryDetails = (catId) => {
    return ISSUE_CATEGORIES.find(c => c.id === catId) || {
      name: 'General',
      color: '#64748B',
      bgColor: '#F1F5F9'
    };
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Top Bar with count and export */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
            Reported Issues
          </h2>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            {filteredReports.length} of {reports.length} recorded issues
          </span>
        </div>

        <button
          type="button"
          onClick={onExportJSON}
          title="Download report records as JSON"
          style={{
            background: '#F1F5F9',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#334155',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <Download size={13} />
          <span>Export Data</span>
        </button>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by ticket #, title, or road name..."
          style={{
            width: '100%',
            padding: '9px 12px 9px 36px',
            borderRadius: '12px',
            border: '1px solid #CBD5E1',
            fontSize: '12px',
            outline: 'none',
            boxSizing: 'border-box',
            background: '#FFFFFF',
            color: '#0F172A'
          }}
        />
      </div>

      {/* Status Filter Chips */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none'
      }}>
        {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'].map((st) => {
          const isActive = selectedStatus === st;
          const label = st === 'ALL' ? 'All' : STATUS_TYPES[st]?.label || st;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              style={{
                padding: '5px 12px',
                borderRadius: '20px',
                border: isActive ? '1px solid #2563EB' : '1px solid #E2E8F0',
                background: isActive ? '#2563EB' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#64748B',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Issues List */}
      {filteredReports.length === 0 ? (
        <div style={{
          padding: '48px 16px',
          textAlign: 'center',
          background: '#F8FAFC',
          borderRadius: '16px',
          border: '1px dashed #CBD5E1'
        }}>
          <FileQuestion size={40} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#334155' }}>No Issues Found</h4>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
            No recorded reports match your search query or active filters.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredReports.map((item) => {
            const cat = getCategoryDetails(item.category);
            return (
              <div
                key={item.id}
                onClick={() => onSelectReport(item)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '14px',
                  display: 'flex',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                {/* Evidence Thumbnail or Category Icon */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: cat.bgColor,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${cat.borderColor || '#E2E8F0'}`
                }}>
                  {item.evidence?.hasPhoto && item.evidence?.imageUrl ? (
                    <img
                      src={item.evidence.imageUrl}
                      alt="Report evidence"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <span style={{ fontSize: '18px' }}>📍</span>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: cat.color }}>
                        {cat.badge || 'REPORT'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', letterSpacing: '0.2px' }}>
                      {item.id}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>

                  <div style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0F172A',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.title}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B', fontSize: '11px' }}>
                    <MapPin size={12} color="#EF4444" style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.location?.address || 'Unknown address'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px', fontSize: '10px', color: '#94A3B8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={11} />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                    {item.evidence?.hasPhoto && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#059669', fontWeight: 600 }}>
                        <Camera size={11} />
                        Photo Evidence
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: '#CBD5E1' }}>
                  <ChevronRight size={18} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
