import type { OrderData, OrderItem } from '../types'

export function parseInvoiceQR(qrContent: string): OrderData | null {
  try {
    if (qrContent.startsWith('PKG1:')) {
      const base64Part = qrContent.substring(5)
      const decoded = atob(base64Part.replace(/-/g, '+').replace(/_/g, '/'))
      const json = JSON.parse(decoded)

      const items: OrderItem[] = json.i.map((item: [string, number]) => ({
        sku: item[0],
        units: item[1],
        scannedCount: 0,
      }))

      return {
        orderId: json.o,
        items,
      }
    }
    return null
  } catch (e) {
    console.error('Error parsing invoice QR:', e)
    return null
  }
}

export function parseProductQR(qrContent: string): string | null {
  try {
    if (qrContent.startsWith('PKT1:')) {
      const base64Part = qrContent.substring(5)
      const decoded = atob(base64Part.replace(/-/g, '+').replace(/_/g, '/'))
      const json = JSON.parse(decoded)
      return json.s
    } else if (/^[A-Z0-9]+$/.test(qrContent)) {
      return qrContent
    }
    return null
  } catch (e) {
    console.error('Error parsing product QR:', e)
    return null
  }
}
