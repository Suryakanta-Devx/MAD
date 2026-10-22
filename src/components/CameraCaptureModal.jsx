import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, Sparkles } from 'lucide-react';
import { SAMPLE_EVIDENCE_PRESETS } from '../constants/mockData';

export default function CameraCaptureModal({ isOpen, onClose, onPhotoCaptured }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [isInitializing, setIsInitializing] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setIsInitializing(true);
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera hardware access is not supported in this browser context.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera stream could not start:', err);
      setCameraError(err.message || 'Camera permission denied or camera device in use.');
    } finally {
      setIsInitializing(false);
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      onPhotoCaptured(capturedImage, 'Live Camera Capture');
      setCapturedImage(null);
      onClose();
    }
  };

  const handleSelectSample = (preset) => {
    onPhotoCaptured(preset.url, `Sample: ${preset.name}`);
    setCapturedImage(null);
    onClose();
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleClose = () => {
    setCapturedImage(null);
    setCameraError(null);
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: '#0F172A',
        color: '#F8FAFC',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '460px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '92vh'
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1E293B'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={19} color="#38BDF8" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Issue Evidence Camera</h3>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: '#1E293B',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewfinder View */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured evidence"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : cameraError ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#CBD5E1' }}>
              <AlertCircle size={36} color="#F87171" style={{ margin: '0 auto 12px' }} />
              <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 600 }}>Webcam or Device Camera Unavailable</p>
              <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#94A3B8' }}>{cameraError}</p>
              <div style={{ fontSize: '12px', color: '#38BDF8', marginBottom: '12px' }}>
                Tip: You can use one of these realistic evidence photos below for testing:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {SAMPLE_EVIDENCE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectSample(preset)}
                    style={{
                      background: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '8px',
                      color: '#F8FAFC',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Sparkles size={12} color="#FBBF24" />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Viewfinder Target Reticle */}
              <div style={{
                position: 'absolute',
                width: '60%',
                height: '60%',
                border: '2px dashed rgba(255, 255, 255, 0.45)',
                borderRadius: '16px',
                pointerEvents: 'none'
              }} />

              {/* Flip camera button */}
              <button
                type="button"
                onClick={toggleFacingMode}
                title="Switch Camera"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <RefreshCw size={17} />
              </button>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#0F172A',
          borderTop: '1px solid #1E293B'
        }}>
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                style={{
                  padding: '10px 18px',
                  background: '#1E293B',
                  border: '1px solid #334155',
                  color: '#E2E8F0',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={15} />
                Retake
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                style={{
                  padding: '10px 22px',
                  background: '#2563EB',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
                }}
              >
                <Check size={16} />
                Attach Photo
              </button>
            </>
          ) : !cameraError ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleCaptureSnapshot}
                disabled={isInitializing}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '4px solid #38BDF8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#EF4444' }} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
