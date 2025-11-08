export interface OrderItem {
  sku: string
  units: number
  scannedCount: number
}

export interface OrderData {
  orderId: string
  items: OrderItem[]
}

export interface ScanRecord {
  orderId: string
  timestamp: number
  sku: string
  action: string
}
