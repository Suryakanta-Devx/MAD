import React, { useState } from 'react';
import { CheckCircle, Copy, Check, ArrowRight } from 'lucide-react';
import { ISSUE_CATEGORIES } from '../constants/categories';

export default function SuccessSubmitModal({ report, onClose, onViewReports }) {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const categoryObj = ISSUE_CATEGORIES.find(c => c.id === report.category) || {
    name: 'General Issue',
    color: '#2563EB',
    bgColor: '#EFF6FF'
  };

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(report.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '420px',
        padding: '24px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'scaleUp 0.25s ease-out'
      }}>
        {/* Animated Success Badge */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: '#DCFCE7',
          color: '#16A34A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 0 0 10px rgba(220, 252, 231, 0.5)'
        }}>
          <CheckCircle size={42} strokeWidth={2.3} />
        </div>

        <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
          Issue Reported Successfully!
        </h3>
        <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748B' }}>
          Your report has been logged and assigned to the local municipal engineering department.
        </p>

        {/* Ticket Reference Box */}
        <div style={{
          background: '#F8FAFC',
          border: '1.5px dashed #CBD5E1',
          borderRadius: '14px',
          padding: '14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block', fontWeight: 600 }}>
              TRACKING TICKET ID
            </span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', letterSpacing: '0.5px' }}>
              {report.id}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyTicket}
            style={{
              background: copied ? '#DCFCE7' : '#EFF6FF',
              color: copied ? '#15803D' : '#2563EB',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Brief Details */}
        <div style={{
          background: '#F1F5F9',
          borderRadius: '12px',
          padding: '12px',
          textAlign: 'left',
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748B' }}>Category:</span>
            <span style={{ fontWeight: 600, color: categoryObj.color }}>{categoryObj.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748B' }}>Location:</span>
            <span style={{ fontWeight: 600, color: '#0F172A', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {report.location?.address || 'Pinned Location'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748B' }}>Status:</span>
            <span style={{
              background: '#EFF6FF',
              color: '#2563EB',
              padding: '2px 8px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '11px'
            }}>
              Submitted & Queued
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            onClick={onViewReports}
            style={{
              width: '100%',
              padding: '12px',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <span>Track in "My Reports"</span>
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '10px',
              background: '#F8FAFC',
              color: '#475569',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Report Another Issue
          </button>
        </div>
      </div>
    </div>
  );
}
