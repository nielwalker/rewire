# QR Rewire

QR Rewire is a browser-only React application for pasting or dropping an image of a QR code, decoding the QR payload locally, generating a new QR from the exact same content, and downloading the generated QR.

No server, database, login, storage, API routes, or file picker is used. Images never leave the browser.

## Features

- Paste images with Ctrl + V or Cmd + V
- Paste screenshots or copied image content
- Drag and drop PNG or JPEG images
- Resize source images locally to a maximum width of 1600px
- Compress processed image data with JPEG quality 0.9
- Decode QR content in the browser with `jsQR`
- Generate a new QR from the exact decoded payload with `qrcode`
- Copy decoded content
- Download the generated QR as PNG
- Clear with the Esc key
- Dark, responsive single-page interface with toast notifications

## Requirements

- Node.js 20 or newer
- npm

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Vite will print the local development URL, usually `http://localhost:5173`.

## Production Build

```bash
npm run build
```

The static production output is written to `dist/`.

## Preview Production Build

```bash
npm run preview
```

## Deploying to Vercel

This project includes `vercel.json` configured for Vite.

Vercel settings:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

No environment variables are required.

## Privacy Model

QR Rewire runs entirely in the browser:

- Pasted and dropped images are processed with browser APIs.
- QR decoding happens locally.
- Generated QR images are data URLs created locally.
- No uploaded files, accounts, or network API calls are part of the app flow.

## Supported Inputs

Accepted:

- `image/png`
- `image/jpeg`
- `image/jpg`

Rejected:

- Text clipboard content
- PDFs
- Unsupported file formats
- Traditional upload dialogs
