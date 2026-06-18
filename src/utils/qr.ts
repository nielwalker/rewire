import jsQR from "jsqr";
import QRCode from "qrcode";
import { blobToImageData } from "./image";

export async function decodeQrFromBlob(blob: Blob): Promise<string | null> {
  const imageData = await blobToImageData(blob);
  const result = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "attemptBoth",
  });

  return result?.data?.trim() || null;
}

export async function generateQrDataUrl(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 2,
    scale: 8,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
