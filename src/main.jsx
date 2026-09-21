import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('NEXUS-01 System Runtime Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          background: '#040711',
          color: '#38bdf8',
          fontFamily: 'Space Mono, monospace',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            border: '1px solid rgba(56, 189, 248, 0.4)',
            padding: '2.5rem',
            background: 'rgba(8, 14, 28, 0.9)',
            borderRadius: '4px',
            maxWidth: '650px',
            boxShadow: '0 0 30px rgba(56, 189, 248, 0.15)'
          }}>
            <h2 style={{ color: '#ef4444', marginBottom: '1rem', letterSpacing: '2px' }}>
              // NEXUS-01 FLIGHT COMPUTER MALFUNCTION //
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              {this.state.error?.message || 'An unexpected telemetry error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.75rem',
                fontFamily: 'inherit',
                fontWeight: 'bold',
                cursor: 'pointer',
                letterSpacing: '1px',
                borderRadius: '2px'
              }}
            >
              REBOOT FLIGHT SYSTEM
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

