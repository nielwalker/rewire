import type { ProcessedImage } from "../types/qr";

const MAX_WIDTH = 1600;

export async function processImageBlob(file: Blob): Promise<ProcessedImage> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(
      "This image format cannot be decoded by your browser. Try copying the QR as an image or screenshot.",
    );
  }

  if (bitmap.width === 0 || bitmap.height === 0) {
    bitmap.close();
    throw new Error("The pasted image is empty or invalid.");
  }
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
      "image/png",
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
