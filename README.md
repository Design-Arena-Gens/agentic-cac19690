# Kitoko Packer

Ultra-fast scan-to-pack application for processing 1000+ orders per day.

🌐 **Live Web Demo**: https://agentic-cac19690.vercel.app

## Overview

Kitoko Packer is a scanning application designed for high-volume order fulfillment operations. This web-based demo simulates the full Android app workflow.

### Key Features

- ✅ **Invoice QR Scanning** → Product checklist → Packet QR scanning workflow
- ✅ **Order Validation** - Prevents re-scanning of already packed orders
- ✅ **"Order Packed" Overlay + TTS Feedback** - Audio confirmation when complete
- ✅ **CSV Export** - Generate scan reports for all packed orders
- ✅ **Real-time Progress Tracking** - Visual progress bars for each order

## Tech Stack

- **Framework**: Next.js 15.0.3 (React 18.3.1)
- **Language**: TypeScript 5
- **Deployment**: Vercel
- **Features**: Camera access, manual QR input, client-side processing

## QR Code Formats

### 1. Invoice QR (PKG1 Format)
```
PKG1:<base64url(json)>
```

**JSON Structure**:
```json
{
  "o": "ORDER_ID",
  "i": [
    ["SKU_1", units],
    ["SKU_2", units]
  ]
}
```

**Example**:
```
PKG1:eyJvIjoiT1JEMTIzIiwiaSI6W1siS1NMUDUwMCIsMl0sWyJLU0xQMTAwMCIsMV1dfQ
```
Decodes to: `{"o":"ORD123","i":[["KSLP500",2],["KSLP1000",1]]}`

### 2. Product QR

**Option A - Plain SKU**:
```
KSLP500
```

**Option B - PKT1 Format**:
```
PKT1:<base64url({"s":"SKU"})>
```

## Scan Rules

1. **First scan MUST be an Invoice QR** (PKG1 format)
2. Subsequent scans must be Product QRs matching items in the order
3. Each product must be scanned the number of times specified in units
4. Orders already marked as "packed" cannot be rescanned
5. When all items are complete → "Order Packed" overlay + TTS confirmation

## Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Development**:
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

3. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

4. **Deploy to Vercel**:
   ```bash
   vercel deploy --prod --token $VERCEL_TOKEN
   ```

## Usage Flow

1. **Scan Invoice QR** - Loads order with item checklist
2. **Scan Product QRs** - Progress tracked per item and overall
3. **Order Complete** - Shows "Order Packed" dialog with TTS announcement
4. **Export CSV** - Download scan report with timestamps

## Test QR Codes

Copy these into the web app's manual input or generate QR codes:

**Invoice**:
```
PKG1:eyJvIjoiT1JEMTIzIiwiaSI6W1siS1NMUDUwMCIsMl0sWyJLU0xQMTAwMCIsMV1dfQ
```

**Products**:
```
KSLP500
KSLP1000
```

## CSV Export Format

```csv
Order ID,Timestamp,SKU,Action
ORD123,2025-11-08T12:34:56.789Z,ORDER_START,Invoice scanned
ORD123,2025-11-08T12:35:01.234Z,KSLP500,SCANNED
ORD123,2025-11-08T12:35:05.678Z,KSLP500,SCANNED
ORD123,2025-11-08T12:35:09.123Z,KSLP1000,SCANNED
```

## Project Structure

```
.
├── app/                          # Next.js web app (App Router)
│   ├── components/
│   │   ├── QRScanner.tsx
│   │   ├── OrderView.tsx
│   │   └── OrderPackedDialog.tsx
│   ├── utils/
│   │   └── qrParser.ts
│   ├── types.ts
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── package.json
├── next.config.js
├── tsconfig.json
├── vercel.json
└── README.md
```

## Performance

- **Target**: Process 1000+ orders/day
- **Scan Speed**: ~1-2 seconds per item (with 1s cooldown to prevent duplicates)
- **Order Validation**: Instant (in-memory Set lookup)
- **CSV Export**: Client-side generation (no server required)

## Browser Compatibility

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (iOS 14+)
- ✅ Firefox
- ⚠️ Camera access requires HTTPS (provided by Vercel)

## License

Proprietary

---

**Built for high-volume order fulfillment operations**