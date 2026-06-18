import type { ProcessedImage } from "../types/qr";

const ACCEPTED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/jpg"]);
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 0.9;

export function isAcceptedImage(type: string): boolean {
  return ACCEPTED_IMAGE_TYPES.has(type.toLowerCase());
}

export async function processImageBlob(file: Blob): Promise<ProcessedImage> {
  if (!isAcceptedImage(file.type)) {
    throw new Error("Unsupported image format. Paste or drop a PNG or JPEG image.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    bitmap.close();
    throw new Error("Unable to process this image.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
          return;
        }
        reject(new Error("Unable to prepare this image for QR decoding."));
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  });

  return {
    blob,
    objectUrl: URL.createObjectURL(blob),
    width,
    height,
  };
}

export async function blobToImageData(blob: Blob): Promise<ImageData> {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    bitmap.close();
    throw new Error("Unable to read pixels from this image.");
  }

  context.drawImage(bitmap, 0, 0);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  bitmap.close();

  return imageData;
}
