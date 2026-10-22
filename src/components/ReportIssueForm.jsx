import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  AlertTriangle, 
  Droplets, 
  Lightbulb, 
  Trash2, 
  Car, 
  TreePine, 
  Building2, 
  HelpCircle, 
  MapPin, 
  Crosshair, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Send, 
  ShieldCheck, 
  User, 
  Phone,
  FileText,
  Mic,
  MicOff,
  Bot,
  WifiOff,
  AlertCircle
} from 'lucide-react';
import { ISSUE_CATEGORIES, SEVERITY_LEVELS } from '../constants/categories';
import { SAMPLE_EVIDENCE_PRESETS } from '../constants/mockData';
import { locationService } from '../services/locationService';
import { aiService } from '../services/aiService';
import { i18n } from '../services/i18nService';
import LocationPickerMap from './LocationPickerMap';
import CameraCaptureModal from './CameraCaptureModal';

export default function ReportIssueForm({ 
  onSubmitReport, 
  existingReports = [], 
  isOnline = true,
  currentLanguage = 'en'
}) {
  // Form State
  const [selectedCategory, setSelectedCategory] = useState('roads');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('high');

  // Location State
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.2090);
  const [address, setAddress] = useState('Central Avenue, Commercial District');
  const [landmark, setLandmark] = useState('');
  const [locationSource, setLocationSource] = useState('Default GPS');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(10);

  // Evidence State
  const [evidencePhoto, setEvidencePhoto] = useState(null);
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  // Reporter Info
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');

  // Innovation States: AI & Voice & Offline
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  // UI / Validation State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDetectGPS = useCallback(async (isInitial = false) => {
    setIsDetectingLocation(true);
    try {
      const coords = await locationService.getCurrentCoordinates();
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);
      setLocationAccuracy(coords.accuracy);
      setLocationSource(coords.isSimulated ? 'Simulated Local GPS' : 'Device GPS');

      // Reverse geocode
      const geoData = await locationService.reverseGeocode(coords.latitude, coords.longitude);
      if (geoData && geoData.formattedAddress) {
        setAddress(geoData.formattedAddress);
      }
    } catch (e) {
      console.warn('GPS detection failed:', e);
      if (!isInitial) {
        alert('Could not lock GPS. You can pin location manually on the map below.');
      }
    } finally {
      setIsDetectingLocation(false);
    }
  }, []);

  // Initial GPS detection on mount
  useEffect(() => {
    handleDetectGPS(true);
  }, [handleDetectGPS]);

  // Check for AI duplicate proximity
  useEffect(() => {
    const dup = aiService.detectDuplicates(latitude, longitude, selectedCategory, existingReports);
    setDuplicateWarning(dup);
  }, [latitude, longitude, selectedCategory, existingReports]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage === 'es' ? 'es-ES' : currentLanguage === 'fr' ? 'fr-FR' : currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
          if (!title) {
            setTitle(transcript.slice(0, 45) + (transcript.length > 45 ? '...' : ''));
          }
          // Trigger AI Smart Classification on speech text
          handleAiSmartScan(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [currentLanguage, title]);

  // Voice Toggle
  const toggleVoiceRecording = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  // Simulated Voice Input Fallback
  const simulateVoiceInput = () => {
    const voiceSamples = [
      "Severe water pipe leakage near campus library walkway flooding the pavement",
      "Dangerous deep pothole right in front of the engineering parking lot gate",
      "Multiple streetlights broken creating complete darkness behind student hostel",
      "Overflowing garbage dumpster outside campus cafeteria causing foul odor"
    ];
    const sample = voiceSamples[Math.floor(Math.random() * voiceSamples.length)];
    setIsListening(true);
    setTimeout(() => {
      setDescription(sample);
      setTitle(sample.slice(0, 45) + '...');
      setIsListening(false);
      handleAiSmartScan(sample);
    }, 1200);
  };

  // AI Smart Hazard Scan & Triage
  const handleAiSmartScan = async (overrideText = null) => {
    const textToScan = overrideText || `${title} ${description} ${evidencePhoto?.name || ''}`;
    setIsAiAnalyzing(true);
    try {
      const result = await aiService.analyzeIssue(textToScan);
      setAiAnalysisResult(result);
      if (result.category) {
        setSelectedCategory(result.category);
      }
      if (result.severity) {
        setSeverity(result.severity);
      }
      if (!title || overrideText) {
        setTitle(result.suggestedTitle);
      }
    } catch (err) {
      console.error('AI Scan error:', err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleMapLocationChange = async ({ latitude: lat, longitude: lng, source }) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocationSource(source || 'Interactive Map');
    
    // Auto-update address text from pinned point
    const geoData = await locationService.reverseGeocode(lat, lng);
    if (geoData && geoData.formattedAddress) {
      setAddress(geoData.formattedAddress);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const photoObj = {
        url: event.target?.result,
        name: file.name,
        timestamp: new Date().toISOString(),
        source: 'Gallery Upload'
      };
      setEvidencePhoto(photoObj);
      // Auto-trigger AI hazard analysis on new photo metadata
      handleAiSmartScan(`${file.name} ${title}`);
    };
    reader.readAsDataURL(file);
  };

  const handleUsePresetEvidence = (preset) => {
    const photoObj = {
      url: preset.url,
      name: preset.name,
      timestamp: new Date().toISOString(),
      source: 'Sample Evidence'
    };
    setEvidencePhoto(photoObj);
    if (!evidenceNotes) {
      setEvidenceNotes(preset.description);
    }
    // Auto-trigger AI classification on preset
    handleAiSmartScan(`${preset.name} ${preset.description}`);
  };

  const handleRemovePhoto = () => {
    setEvidencePhoto(null);
  };

  const handleAutoFillDemo = () => {
    const cat = ISSUE_CATEGORIES.find(c => c.id === selectedCategory) || ISSUE_CATEGORIES[0];
    setTitle(`Hazardous ${cat.name} Incident`);
    setDescription(`Immediate municipal attention requested for ${cat.name.toLowerCase()} at ${address || 'the pinned location'}. Safety hazard observed for pedestrians and vehicles.`);
    setSeverity('high');
    if (!evidencePhoto) {
      setEvidencePhoto({
        url: SAMPLE_EVIDENCE_PRESETS[0].url,
        name: SAMPLE_EVIDENCE_PRESETS[0].name,
        timestamp: new Date().toISOString(),
        source: 'Sample Evidence'
      });
    }
    setErrors({});
    handleAiSmartScan(`Hazardous ${cat.name} incident`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const catObj = ISSUE_CATEGORIES.find(c => c.id === selectedCategory) || ISSUE_CATEGORIES[0];
    const finalTitle = title.trim() || `${catObj.name} Hazard Report`;
    const finalDescription = (description.trim() && description.trim().length >= 5) 
      ? description.trim() 
      : `Citizen report for ${catObj.name.toLowerCase()} requiring municipal maintenance inspection at ${address || 'the pinned location'}.`;
    const finalAddress = address.trim() || 'Central Zone, Municipal District';

    setIsSubmitting(true);

    const reportData = {
      category: selectedCategory,
      title: finalTitle,
      description: finalDescription,
      severity,
      location: {
        address: finalAddress,
        landmark: landmark.trim(),
        latitude,
        longitude,
        accuracy: locationAccuracy,
        source: locationSource
      },
      evidence: {
        hasPhoto: !!evidencePhoto,
        imageUrl: evidencePhoto ? evidencePhoto.url : null,
        photoName: evidencePhoto ? evidencePhoto.name : null,
        timestamp: evidencePhoto ? evidencePhoto.timestamp : null,
        notes: evidenceNotes.trim()
      },
      reporter: {
        isAnonymous,
        name: isAnonymous ? 'Anonymous Citizen' : (reporterName.trim() || 'Citizen Reporter'),
        contact: isAnonymous ? '' : reporterContact.trim()
      },
      aiAssessment: aiAnalysisResult ? {
        confidence: aiAnalysisResult.confidence,
        department: aiAnalysisResult.department,
        campusImpact: aiAnalysisResult.campusImpact
      } : null
    };

    setTimeout(() => {
      onSubmitReport(reportData);
      setIsSubmitting(false);

      // Reset form
      setTitle('');
      setDescription('');
      setEvidencePhoto(null);
      setEvidenceNotes('');
      setLandmark('');
      setAiAnalysisResult(null);
      setErrors({});
    }, 300);
  };

  const getCategoryIcon = (iconName, color) => {
    switch (iconName) {
      case 'CarAlert': return <Car size={18} color={color} />;
      case 'Droplets': return <Droplets size={18} color={color} />;
      case 'Lightbulb': return <Lightbulb size={18} color={color} />;
      case 'Trash2': return <Trash2 size={18} color={color} />;
      case 'AlertTriangle': return <AlertTriangle size={18} color={color} />;
      case 'TreePine': return <TreePine size={18} color={color} />;
      case 'Building2': return <Building2 size={18} color={color} />;
      default: return <HelpCircle size={18} color={color} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Offline Mode Banner Alert if offline */}
      {!isOnline && (
        <div style={{
          background: '#FEF2F2',
          border: '1.5px solid #FCA5A5',
          borderRadius: '14px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#B91C1C'
        }}>
          <WifiOff size={18} color="#DC2626" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '12px', lineHeight: 1.4 }}>
            <strong>{i18n.t('offlineBanner', currentLanguage)}</strong>
          </div>
        </div>
      )}

      {/* Introduction Card */}
      <div style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        border: '1px solid #BFDBFE',
        borderRadius: '16px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <div style={{
          background: '#2563EB',
          color: '#ffffff',
          borderRadius: '10px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <FileText size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#1E3A8A' }}>
              {i18n.t('newReportTitle', currentLanguage)}
            </h2>
            <button
              type="button"
              onClick={handleAutoFillDemo}
              style={{
                background: '#FFFFFF',
                border: '1px solid #93C5FD',
                borderRadius: '8px',
                padding: '3px 8px',
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
              <span>{i18n.t('demoFill', currentLanguage)}</span>
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '11px', color: '#1E40AF', lineHeight: 1.4 }}>
            AI-assisted incident reporting with voice input, GPS calibration, and offline queueing.
          </p>
        </div>
      </div>

      {/* AI Proximity / Duplicate Warning Banner */}
      {duplicateWarning && (
        <div style={{
          background: '#FFFBEB',
          border: '1.5px solid #FDE68A',
          borderRadius: '14px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          color: '#92400E',
          boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)'
        }}>
          <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1, fontSize: '12px' }}>
            <div style={{ fontWeight: 700, marginBottom: '2px' }}>
              AI Duplicate Alert ({duplicateWarning.distanceMeters}m away)
            </div>
            <p style={{ margin: 0, lineHeight: 1.4, fontSize: '11px' }}>
              A similar issue <strong>"{duplicateWarning.matchedReport.title}"</strong> ({duplicateWarning.matchedReport.id}) was already reported nearby.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 1: Category Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{i18n.t('secCategory', currentLanguage)}</span>
            <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <span style={{ fontSize: '11px', color: '#64748B' }}>Tap to select</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px'
        }}>
          {ISSUE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: isSelected ? `2px solid ${cat.color}` : '1px solid #E2E8F0',
                  background: isSelected ? cat.bgColor : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'left',
                  boxShadow: isSelected ? `0 4px 12px ${cat.color}25` : 'none',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: isSelected ? '#FFFFFF' : cat.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getCategoryIcon(cat.icon, cat.color)}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: isSelected ? 800 : 600,
                    color: isSelected ? '#0F172A' : '#334155',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {i18n.t(`cat_${cat.id}`, currentLanguage)}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>
                    {cat.badge}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {errors.category && <span style={{ fontSize: '11px', color: '#EF4444' }}>{errors.category}</span>}
      </div>

      {/* SECTION 2: Description & Severity with AI & Voice Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{i18n.t('secDetails', currentLanguage)}</span>
            <span style={{ color: '#EF4444' }}>*</span>
          </label>

          {/* AI Smart Scan Action Button */}
          <button
            type="button"
            onClick={() => handleAiSmartScan()}
            disabled={isAiAnalyzing}
            style={{
              background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
              border: '1px solid #C4B5FD',
              borderRadius: '20px',
              padding: '4px 10px',
              color: '#6D28D9',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Bot size={13} color="#7C3AED" className={isAiAnalyzing ? 'spin-animation' : ''} />
            <span>{isAiAnalyzing ? i18n.t('aiAnalyzing', currentLanguage) : i18n.t('aiSmartAnalyze', currentLanguage)}</span>
          </button>
        </div>

        {/* AI Result Card */}
        {aiAnalysisResult && (
          <div style={{
            background: '#F5F3FF',
            border: '1px solid #DDD6FE',
            borderRadius: '12px',
            padding: '10px 12px',
            fontSize: '11px',
            color: '#5B21B6',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} color="#7C3AED" />
                AI Triage: {aiAnalysisResult.department}
              </span>
              <span style={{ background: '#7C3AED', color: '#FFFFFF', padding: '1px 6px', borderRadius: '8px', fontSize: '9px' }}>
                {aiAnalysisResult.confidence}% Confidence
              </span>
            </div>
            <div style={{ color: '#6D28D9' }}>
              <strong>Campus Impact:</strong> {aiAnalysisResult.campusImpact}
            </div>
          </div>
        )}

        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short Title (e.g., Deep pothole near school gate)"
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: '12px',
              border: errors.title ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#FFFFFF',
              color: '#0F172A',
              transition: 'border 0.2s ease'
            }}
          />
          {errors.title && <span style={{ fontSize: '11px', color: '#EF4444', display: 'block', marginTop: '4px' }}>{errors.title}</span>}
        </div>

        {/* Detailed Description with Voice Input Action */}
        <div style={{ position: 'relative' }}>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened, hazards to traffic or students, or tap Voice button to dictate..."
            style={{
              width: '100%',
              padding: '11px 14px 40px 14px',
              borderRadius: '12px',
              border: errors.description ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#FFFFFF',
              color: '#0F172A',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />

          {/* Voice Mic Button embedded inside description */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <button
              type="button"
              onClick={toggleVoiceRecording}
              title={isListening ? 'Stop listening' : 'Start voice-based hands-free reporting'}
              style={{
                background: isListening ? '#EF4444' : '#EFF6FF',
                border: isListening ? '1.5px solid #DC2626' : '1px solid #BFDBFE',
                borderRadius: '20px',
                padding: '4px 10px',
                color: isListening ? '#FFFFFF' : '#2563EB',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: isListening ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {isListening ? (
                <>
                  <MicOff size={13} className="spin-animation" />
                  <span>{i18n.t('listening', currentLanguage)}</span>
                </>
              ) : (
                <>
                  <Mic size={13} />
                  <span>{i18n.t('voiceInput', currentLanguage)}</span>
                </>
              )}
            </button>
          </div>
          {errors.description && <span style={{ fontSize: '11px', color: '#EF4444', display: 'block', marginTop: '4px' }}>{errors.description}</span>}
        </div>

        {/* Severity Selector */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
            Urgency Level:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {SEVERITY_LEVELS.map((sev) => {
              const isSelected = severity === sev.id;
              return (
                <button
                  key={sev.id}
                  type="button"
                  onClick={() => setSeverity(sev.id)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '10px',
                    border: isSelected ? `2px solid ${sev.color}` : '1px solid #E2E8F0',
                    background: isSelected ? `${sev.color}15` : '#FFFFFF',
                    color: isSelected ? sev.color : '#64748B',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {i18n.t(`sev_${sev.id}`, currentLanguage)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: Location Specification & Map */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{i18n.t('secLocation', currentLanguage)}</span>
            <span style={{ color: '#EF4444' }}>*</span>
          </label>
          
          <button
            type="button"
            onClick={() => handleDetectGPS(false)}
            disabled={isDetectingLocation}
            style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '20px',
              padding: '4px 10px',
              color: '#2563EB',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Crosshair size={13} className={isDetectingLocation ? 'spin-animation' : ''} />
            <span>{isDetectingLocation ? i18n.t('locating', currentLanguage) : i18n.t('detectGps', currentLanguage)}</span>
          </button>
        </div>

        {/* Address Input */}
        <div>
          <div style={{ position: 'relative' }}>
            <MapPin size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street name, road, sector, or area"
              style={{
                width: '100%',
                padding: '11px 14px 11px 36px',
                borderRadius: '12px',
                border: errors.address ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                background: '#FFFFFF',
                color: '#0F172A'
              }}
            />
          </div>
          {errors.address && <span style={{ fontSize: '11px', color: '#EF4444', display: 'block', marginTop: '4px' }}>{errors.address}</span>}
        </div>

        {/* Landmark Input */}
        <input
          type="text"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          placeholder="Nearby landmark (e.g., Near Library North Entrance, opposite Gate 2)"
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '12px',
            border: '1px solid #CBD5E1',
            fontSize: '12px',
            outline: 'none',
            boxSizing: 'border-box',
            background: '#FFFFFF',
            color: '#0F172A'
          }}
        />

        {/* GPS Coordinates readout */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#F8FAFC',
          borderRadius: '8px',
          padding: '6px 10px',
          fontSize: '11px',
          color: '#64748B'
        }}>
          <div>
            <strong>GPS:</strong> {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
            <span>Acc: ±{locationAccuracy}m</span>
          </div>
        </div>

        {/* Interactive Leaflet Location Map */}
        <LocationPickerMap
          latitude={latitude}
          longitude={longitude}
          onLocationChange={handleMapLocationChange}
          isDetecting={isDetectingLocation}
        />
      </div>

      {/* SECTION 4: Evidence Attachment */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{i18n.t('secEvidence', currentLanguage)}</span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>(Optional)</span>
          </label>
        </div>

        {evidencePhoto ? (
          /* Photo Preview Card */
          <div style={{
            position: 'relative',
            borderRadius: '14px',
            overflow: 'hidden',
            border: '1.5px solid #10B981',
            background: '#0F172A',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <img
              src={evidencePhoto.url}
              alt="Evidence preview"
              style={{ width: '100%', maxHeight: '180px', objectFit: 'cover' }}
            />
            <div style={{
              padding: '8px 12px',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                  {evidencePhoto.name || 'Evidence Attached'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemovePhoto}
                style={{
                  background: '#FEE2E2',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: '#EF4444',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <X size={13} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          /* Photo Upload/Camera Action Buttons */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {/* Live Camera Button */}
              <button
                type="button"
                onClick={() => setIsCameraModalOpen(true)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1.5px dashed #2563EB',
                  background: '#EFF6FF',
                  color: '#2563EB',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Camera size={22} />
                <span>{i18n.t('takePhoto', currentLanguage)}</span>
              </button>

              {/* Upload File Input */}
              <label style={{
                padding: '12px',
                borderRadius: '12px',
                border: '1.5px dashed #CBD5E1',
                background: '#F8FAFC',
                color: '#475569',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}>
                <Upload size={22} />
                <span>{i18n.t('uploadImage', currentLanguage)}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Quick Demo Presets */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: '10px',
              padding: '8px 10px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} color="#F59E0B" />
                <span>Quick Demo: Click to attach sample photo:</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {SAMPLE_EVIDENCE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleUsePresetEvidence(preset)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '10px',
                      color: '#334155',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Additional Evidence Notes */}
        <input
          type="text"
          value={evidenceNotes}
          onChange={(e) => setEvidenceNotes(e.target.value)}
          placeholder="Optional notes regarding evidence (e.g. photo taken from pavement)"
          style={{
            width: '100%',
            padding: '9px 12px',
            borderRadius: '10px',
            border: '1px solid #CBD5E1',
            fontSize: '12px',
            outline: 'none',
            boxSizing: 'border-box',
            background: '#FFFFFF',
            color: '#0F172A'
          }}
        />
      </div>

      {/* SECTION 5: Reporter Details / Anonymous option */}
      <div style={{
        background: '#F8FAFC',
        borderRadius: '14px',
        padding: '12px 14px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
            {i18n.t('secReporter', currentLanguage)}
          </span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', color: '#64748B' }}>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#2563EB' }}
            />
            <span>Report Anonymously</span>
          </label>
        </div>

        {!isAnonymous && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <User size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Your Name"
                style={{
                  width: '100%',
                  padding: '9px 10px 9px 30px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: '#FFFFFF'
                }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Phone size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
              <input
                type="text"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                placeholder="Phone or Email"
                style={{
                  width: '100%',
                  padding: '9px 10px 9px 30px',
                  borderRadius: '10px',
                  border: errors.contact ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: '#FFFFFF'
                }}
              />
            </div>
          </div>
        )}
        {errors.contact && <span style={{ fontSize: '11px', color: '#EF4444' }}>{errors.contact}</span>}
      </div>

      {/* SECTION 6: Functional Submission Button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '4px' }}>
        
        {/* Quick Auto-Fill Demo Button */}
        <button
          type="button"
          onClick={handleAutoFillDemo}
          title="Click to automatically fill title, description and attach sample evidence"
          style={{
            width: '100%',
            padding: '10px',
            background: '#FEF3C7',
            border: '1.5px dashed #F59E0B',
            borderRadius: '12px',
            color: '#B45309',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <Sparkles size={15} color="#D97706" />
          <span>⚡ Auto-Fill Sample for Quick Testing</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '14px',
            background: isSubmitting 
              ? '#94A3B8' 
              : !isOnline 
                ? 'linear-gradient(135deg, #475569 0%, #334155 100%)'
                : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            border: 'none',
            borderRadius: '14px',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 800,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            transition: 'all 0.15s ease',
            opacity: isSubmitting ? 0.8 : 1
          }}
        >
          {isOnline ? <Send size={18} /> : <WifiOff size={18} />}
          <span>
            {isSubmitting 
              ? i18n.t('recordingIssue', currentLanguage) 
              : !isOnline 
                ? 'Queue Offline Report' 
                : i18n.t('submitReport', currentLanguage)}
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748B', fontSize: '11px' }}>
          <ShieldCheck size={14} color="#10B981" />
          <span>
            {isOnline 
              ? 'Verified municipal intake. Tracking ID generated instantly.' 
              : 'Local offline storage active. Syncs on reconnection.'}
          </span>
        </div>
      </div>

      {/* Live Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onPhotoCaptured={(url, source) => {
          setEvidencePhoto({
            url,
            name: 'Camera Snapshot',
            timestamp: new Date().toISOString(),
            source
          });
          handleAiSmartScan('Camera Snapshot ' + title);
        }}
      />
    </form>
  );
}
