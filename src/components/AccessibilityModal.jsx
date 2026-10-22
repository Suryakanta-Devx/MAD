import React from 'react';
import { 
  X, 
  Eye, 
  Type, 
  Volume2, 
  WifiOff, 
  Globe, 
  Check,
  Sparkles
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../services/i18nService';

export default function AccessibilityModal({
  isOpen,
  onClose,
  highContrast,
  onToggleHighContrast,
  largeFont,
  onToggleLargeFont,
  ttsEnabled,
  onToggleTts,
  isOfflineSimulated,
  onToggleOfflineSimulated,
  currentLanguage,
  onChangeLanguage
}) {
  if (!isOpen) return null;

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
        maxWidth: '420px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        animation: 'scaleUp 0.2s ease-out'
      }}>
        {/* Header */}
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
              background: '#F0FDF4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16A34A'
            }}>
              <Eye size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                Accessibility & Language
              </h3>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Inclusive design & futuristic tooling
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

        {/* Content Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          
          {/* Multilingual Selector */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Globe size={15} color="#2563EB" />
              <span>Language & Localization</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => onChangeLanguage(lang.code)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? '#1D4ED8' : '#334155'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                    {isSelected && <Check size={14} color="#2563EB" />}
                  </button>
                );
              })}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '4px 0' }} />

          {/* Accessibility Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
              Visual & Audio Aids
            </span>

            {/* High Contrast */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Eye size={18} color="#0F172A" />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                    High Contrast Display
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Darker borders & sharp contrast for bright sunlight
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={onToggleHighContrast}
                style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
              />
            </div>

            {/* Large Font */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Type size={18} color="#2563EB" />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                    Large Text / Readability
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Increases interface font scaling for easy reading
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={largeFont}
                onChange={onToggleLargeFont}
                style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
              />
            </div>

            {/* Text-to-Speech */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Volume2 size={18} color="#16A34A" />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                    Voice Assistance (TTS)
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Audio readout of ticket statuses & reports
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={ttsEnabled}
                onChange={onToggleTts}
                style={{ width: '18px', height: '18px', accentColor: '#16A34A', cursor: 'pointer' }}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '4px 0' }} />

          {/* Offline Testing Simulation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <WifiOff size={15} color="#DC2626" />
              <span>Offline Reporting Simulator</span>
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              borderRadius: '12px',
              background: isOfflineSimulated ? '#FEF2F2' : '#F8FAFC',
              border: isOfflineSimulated ? '1px solid #FECACA' : '1px solid #E2E8F0'
            }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: isOfflineSimulated ? '#DC2626' : '#0F172A' }}>
                  Simulate Network Disconnection
                </div>
                <div style={{ fontSize: '11px', color: isOfflineSimulated ? '#B91C1C' : '#64748B' }}>
                  Test offline queueing and background auto-sync
                </div>
              </div>
              <input
                type="checkbox"
                checked={isOfflineSimulated}
                onChange={onToggleOfflineSimulated}
                style={{ width: '18px', height: '18px', accentColor: '#DC2626', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
