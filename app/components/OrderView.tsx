import type { OrderData } from '../types'

interface OrderViewProps {
  order: OrderData | null
}

export default function OrderView({ order }: OrderViewProps) {
  if (!order) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📦</div>
          <h2 style={styles.emptyTitle}>No Active Order</h2>
          <p style={styles.emptyText}>Scan an invoice QR code to start packing</p>
        </div>
      </div>
    )
  }

  const totalItems = order.items.reduce((sum, item) => sum + item.units, 0)
  const scannedItems = order.items.reduce((sum, item) => sum + item.scannedCount, 0)
  const progress = (scannedItems / totalItems) * 100

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Order: {order.orderId}</h2>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <p style={styles.progressText}>
          {scannedItems} / {totalItems} items scanned
        </p>
      </div>

      <div style={styles.itemsList}>
        {order.items.map((item, index) => {
          const itemProgress = (item.scannedCount / item.units) * 100
          const isComplete = item.scannedCount >= item.units

          return (
            <div key={index} style={styles.item}>
              <div style={styles.itemHeader}>
                <span style={styles.sku}>{item.sku}</span>
                <span style={{
                  ...styles.count,
                  color: isComplete ? '#10b981' : '#667eea',
                }}>
                  {item.scannedCount}/{item.units}
                </span>
              </div>
              <div style={styles.itemProgressBar}>
                <div style={{
                  ...styles.itemProgressFill,
                  width: `${itemProgress}%`,
                  background: isComplete ? '#10b981' : '#667eea',
                }} />
              </div>
              {isComplete && (
                <span style={styles.completeBadge}>✓ Complete</span>
              )}
            </div>
          )
        })}
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
    height: 'fit-content',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '10px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  progressBar: {
    width: '100%',
    height: '12px',
    background: '#e5e7eb',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s',
  },
  progressText: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '600',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  item: {
    padding: '15px',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  sku: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  },
  count: {
    fontSize: '16px',
    fontWeight: '700',
  },
  itemProgressBar: {
    width: '100%',
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  itemProgressFill: {
    height: '100%',
    transition: 'width 0.3s, background 0.3s',
  },
  completeBadge: {
    display: 'inline-block',
    marginTop: '8px',
    padding: '4px 8px',
    background: '#d1fae5',
    color: '#065f46',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '4px',
  },
}
