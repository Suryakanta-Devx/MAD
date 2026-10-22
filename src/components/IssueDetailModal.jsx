import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  User, 
  Camera, 
  Clock, 
  Trash2, 
  ArrowUpRight,
  ShieldCheck, 
  Check, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Bot
} from 'lucide-react';
import { ISSUE_CATEGORIES, STATUS_TYPES, SEVERITY_LEVELS } from '../constants/categories';
import { notificationService } from '../services/notificationService';

export default function IssueDetailModal({ 
  report, 
  onClose, 
  onUpdateStatus, 
  onDelete 
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!report) return null;

  const category = ISSUE_CATEGORIES.find(c => c.id === report.category) || {
    name: 'General Issue',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    badge: 'Civic'
  };

  const status = STATUS_TYPES[report.status] || {
    label: report.status,
    color: '#64748B',
    bg: '#F1F5F9',
    step: 1
  };

  const severity = SEVERITY_LEVELS.find(s => s.id === report.severity) || {
    label: report.severity || 'Medium',
    color: '#F59E0B'
  };

  const handleNextStatus = () => {
    let next = 'UNDER_REVIEW';
    let noteText = '';
    if (report.status === 'SUBMITTED') {
      next = 'UNDER_REVIEW';
      noteText = 'Municipal triage engineers evaluated the report priority.';
    } else if (report.status === 'UNDER_REVIEW') {
      next = 'IN_PROGRESS';
      noteText = 'Field maintenance crew dispatched with repair equipment.';
    } else if (report.status === 'IN_PROGRESS') {
      next = 'RESOLVED';
      noteText = 'Inspection completed and verified. Hazard cleared.';
    } else {
      return;
    }

    onUpdateStatus(report.id, next);

    // Dispatch automatic in-app notification update
    notificationService.addNotification({
      issueId: report.id,
      title: `Status Updated: ${report.id}`,
      message: `Issue "${report.title}" moved to ${next.replace('_', ' ')}. ${noteText}`,
      type: next
    });
  };

  // Text to Speech Read Aloud (Accessibility)
  const handleToggleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `Report ${report.id}. Category: ${category.name}. Status: ${status.label}. Severity: ${severity.label}. Title: ${report.title}. Location: ${report.location?.address || 'Pinned location'}. Description: ${report.description}.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
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
        maxWidth: '480px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
        animation: 'scaleUp 0.2s ease-out'
      }}>
        {/* Header Bar */}
        <div style={{
          padding: '16px 20px',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#1E293B' }}>
                {report.id}
              </span>
              <span style={{
                background: status.bg,
                color: status.color,
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {status.label}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              Logged on {new Date(report.createdAt).toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Read Aloud Button */}
            <button
              type="button"
              onClick={handleToggleSpeak}
              title={isSpeaking ? 'Stop voice readout' : 'Read ticket aloud (Accessibility)'}
              style={{
                background: isSpeaking ? '#EFF6FF' : '#FFFFFF',
                border: isSpeaking ? '1px solid #93C5FD' : '1px solid #E2E8F0',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: isSpeaking ? '#2563EB' : '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                onClose();
              }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div style={{ overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Title & Category Chips */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{
                background: category.bgColor,
                color: category.color,
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '8px',
                border: `1px solid ${category.borderColor || '#CBD5E1'}`
              }}>
                {category.name}
              </span>
              <span style={{
                background: `${severity.color}15`,
                color: severity.color,
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '8px'
              }}>
                Urgency: {severity.label}
              </span>
              {report.aiAssessment && (
                <span style={{
                  background: '#F5F3FF',
                  color: '#7C3AED',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid #DDD6FE'
                }}>
                  <Bot size={11} />
                  AI Verified ({report.aiAssessment.confidence}%)
                </span>
              )}
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
              {report.title}
            </h3>

            <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.5, background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
              {report.description}
            </p>
          </div>

          {/* AI Assessment info if present */}
          {report.aiAssessment && (
            <div style={{
              background: '#F5F3FF',
              borderRadius: '12px',
              padding: '10px 12px',
              border: '1px solid #DDD6FE',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              fontSize: '11px',
              color: '#5B21B6'
            }}>
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} color="#7C3AED" />
                <span>AI Automated Campus Triage:</span>
              </div>
              <div><strong>Department:</strong> {report.aiAssessment.department}</div>
              <div><strong>Campus Impact:</strong> {report.aiAssessment.campusImpact}</div>
            </div>
          )}

          {/* Evidence Photograph (if any) */}
          {report.evidence?.hasPhoto && report.evidence?.imageUrl && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={14} color="#059669" />
                Attached Evidence
              </span>
              <div style={{
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
                background: '#0F172A',
                maxHeight: '220px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={report.evidence.imageUrl}
                  alt="Evidence"
                  style={{ width: '100%', maxHeight: '220px', objectFit: 'contain' }}
                />
              </div>
              {report.evidence.notes && (
                <div style={{ fontSize: '11px', color: '#64748B', fontStyle: 'italic', padding: '2px 4px' }}>
                  Note: "{report.evidence.notes}"
                </div>
              )}
            </div>
          )}

          {/* Location Box */}
          <div style={{
            background: '#F8FAFC',
            borderRadius: '14px',
            padding: '14px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
              <MapPin size={15} color="#EF4444" />
              <span>Location Coordinates & Address</span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
              {report.location?.address}
            </div>
            {report.location?.landmark && (
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                <strong>Landmark:</strong> {report.location.landmark}
              </div>
            )}
            <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', gap: '12px' }}>
              <span>Lat: {report.location?.latitude?.toFixed(5)}</span>
              <span>Lng: {report.location?.longitude?.toFixed(5)}</span>
              <span>Source: {report.location?.source || 'GPS'}</span>
            </div>
          </div>

          {/* Lifecycle Stepper */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#2563EB" />
              Resolution Lifecycle
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', textAlign: 'center' }}>
              {[
                { key: 'SUBMITTED', label: 'Logged', step: 1 },
                { key: 'UNDER_REVIEW', label: 'Review', step: 2 },
                { key: 'IN_PROGRESS', label: 'Dispatched', step: 3 },
                { key: 'RESOLVED', label: 'Resolved', step: 4 },
              ].map((s) => {
                const isPassed = status.step >= s.step;
                const isCurrent = status.step === s.step;
                return (
                  <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: isPassed ? '#2563EB' : '#E2E8F0',
                      color: isPassed ? '#FFFFFF' : '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      boxShadow: isCurrent ? '0 0 0 3px rgba(37, 99, 235, 0.25)' : 'none'
                    }}>
                      {isPassed ? <Check size={14} /> : s.step}
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#2563EB' : '#64748B' }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline History entries */}
          {report.timeline && report.timeline.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                Action Logs
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {report.timeline.map((item, idx) => (
                  <div key={idx} style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: '#F1F5F9',
                    fontSize: '11px',
                    color: '#334155',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span style={{ color: '#2563EB' }}>{item.status.replace('_', ' ')}</span>
                      <span style={{ color: '#94A3B8' }}>{item.time}</span>
                    </div>
                    <div>{item.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reporter details */}
          <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
            <User size={13} />
            <span>Reported by: <strong>{report.reporter?.name || 'Anonymous'}</strong> {report.reporter?.contact ? `(${report.reporter.contact})` : ''}</span>
          </div>
        </div>

        {/* Footer actions for testing & demonstration */}
        <div style={{
          padding: '12px 20px',
          background: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <button
            type="button"
            onClick={() => onDelete(report.id)}
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid #FCA5A5',
              background: '#FEF2F2',
              color: '#DC2626',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>

          {report.status !== 'RESOLVED' ? (
            <button
              type="button"
              onClick={handleNextStatus}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                background: '#2563EB',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Advance Status</span>
              <ArrowUpRight size={14} />
            </button>
          ) : (
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={16} />
              Issue Resolved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
