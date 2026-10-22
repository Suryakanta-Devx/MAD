import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '24px',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            background: '#1E293B',
            borderRadius: '20px',
            padding: '32px 24px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid #334155',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertTriangle size={36} />
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700 }}>
              Application Render Issue
            </h3>

            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
              {this.state.error?.message || 'A temporary issue occurred while loading this view.'}
            </p>

            <button
              type="button"
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '12px',
                background: '#2563EB',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={16} />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
