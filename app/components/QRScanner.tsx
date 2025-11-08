'use client'

import { useEffect, useRef, useState } from 'react'

interface QRScannerProps {
  onScan: (qrContent: string) => void
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [manualInput, setManualInput] = useState('')

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsScanning(true)
        }
      } catch (err) {
        console.error('Error accessing camera:', err)
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      onScan(manualInput.trim())
      setManualInput('')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={styles.video}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!isScanning && (
          <div style={styles.placeholder}>
            <p>Camera access required</p>
            <p style={styles.placeholderSub}>Please allow camera permissions</p>
          </div>
        )}
      </div>

      <form onSubmit={handleManualSubmit} style={styles.form}>
        <input
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="Or enter QR code manually..."
          style={styles.input}
        />
        <button type="submit" style={styles.submitBtn}>
          Scan
        </button>
      </form>

      <div style={styles.instructions}>
        <h3 style={styles.instructionsTitle}>How to use:</h3>
        <ol style={styles.instructionsList}>
          <li>First scan: Invoice QR (PKG1 format)</li>
          <li>Then scan: Product QR codes for each item</li>
          <li>Complete all items to pack order</li>
        </ol>
        <div style={styles.testData}>
          <p style={styles.testDataTitle}>Test QR codes:</p>
          <code style={styles.code}>
            PKG1:eyJvIjoiT1JEMTIzIiwiaSI6W1siS1NMUDUwMCIsMl0sWyJLU0xQMTAwMCIsMV1dfQ
          </code>
          <code style={styles.code}>KSLP500</code>
          <code style={styles.code}>KSLP1000</code>
        </div>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  videoContainer: {
    position: 'relative' as const,
    width: '100%',
    aspectRatio: '4/3',
    background: '#000',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '15px',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  placeholder: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as const,
    color: '#fff',
  },
  placeholderSub: {
    fontSize: '14px',
    opacity: 0.7,
    marginTop: '10px',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
  },
  submitBtn: {
    padding: '12px 24px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  instructions: {
    padding: '15px',
    background: '#f5f5f5',
    borderRadius: '8px',
  },
  instructionsTitle: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#333',
  },
  instructionsList: {
    paddingLeft: '20px',
    color: '#666',
    lineHeight: '1.8',
  },
  testData: {
    marginTop: '15px',
    padding: '10px',
    background: '#fff',
    borderRadius: '6px',
  },
  testDataTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#667eea',
  },
  code: {
    display: 'block',
    padding: '8px',
    background: '#f0f0f0',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    marginBottom: '5px',
    wordBreak: 'break-all' as const,
  },
}
