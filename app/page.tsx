'use client'

import { useState, useEffect } from 'react'
import QRScanner from './components/QRScanner'
import OrderView from './components/OrderView'
import OrderPackedDialog from './components/OrderPackedDialog'
import { parseInvoiceQR, parseProductQR } from './utils/qrParser'
import type { OrderData, OrderItem, ScanRecord } from './types'

export default function Home() {
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null)
  const [scanRecords, setScanRecords] = useState<ScanRecord[]>([])
  const [packedOrderIds, setPackedOrderIds] = useState<Set<string>>(new Set())
  const [showPackedDialog, setShowPackedDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastOrderId, setLastOrderId] = useState<string>('')

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleQRScan = (qrContent: string) => {
    try {
      if (!currentOrder) {
        // First scan must be invoice
        const orderData = parseInvoiceQR(qrContent)
        if (orderData) {
          if (packedOrderIds.has(orderData.orderId)) {
            setError(`Order ${orderData.orderId} already packed!`)
            return
          }
          setCurrentOrder(orderData)
          addScanRecord(orderData.orderId, 'ORDER_START', 'Invoice scanned')
        } else {
          setError('Invalid invoice QR code')
        }
      } else {
        // Scan product QR
        const sku = parseProductQR(qrContent)
        if (sku) {
          const item = currentOrder.items.find(
            (it: OrderItem) => it.sku === sku && it.scannedCount < it.units
          )
          if (item) {
            item.scannedCount++
            setCurrentOrder({ ...currentOrder })
            addScanRecord(currentOrder.orderId, sku, 'SCANNED')

            // Check if order complete
            if (currentOrder.items.every((it: OrderItem) => it.scannedCount >= it.units)) {
              completeOrder()
            }
          } else {
            setError(`SKU ${sku} not in order or already complete`)
          }
        } else {
          setError('Invalid product QR code')
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error processing QR code')
    }
  }

  const addScanRecord = (orderId: string, sku: string, action: string) => {
    setScanRecords(prev => [
      ...prev,
      {
        orderId,
        timestamp: Date.now(),
        sku,
        action,
      },
    ])
  }

  const completeOrder = () => {
    if (!currentOrder) return

    setPackedOrderIds(prev => new Set([...prev, currentOrder.orderId]))
    setLastOrderId(currentOrder.orderId)
    setShowPackedDialog(true)

    // TTS
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Order ${currentOrder.orderId} packed successfully`
      )
      window.speechSynthesis.speak(utterance)
    }

    setCurrentOrder(null)
  }

  const exportCSV = () => {
    const csv = ['Order ID,Timestamp,SKU,Action']
    scanRecords.forEach(record => {
      const date = new Date(record.timestamp).toISOString()
      csv.push(`${record.orderId},${date},${record.sku},${record.action}`)
    })

    const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `scan_report_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Kitoko Packer</h1>
          <button style={styles.exportBtn} onClick={exportCSV}>
            Export CSV
          </button>
        </header>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <div style={styles.content}>
          <QRScanner onScan={handleQRScan} />
          <OrderView order={currentOrder} />
        </div>

        {showPackedDialog && (
          <OrderPackedDialog
            orderId={lastOrderId}
            onClose={() => setShowPackedDialog(false)}
          />
        )}
      </div>
    </main>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: '100vh',
    padding: '20px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  exportBtn: {
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  error: {
    background: '#ff4444',
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center' as const,
    fontWeight: '600',
    animation: 'slideDown 0.3s',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
}
