import { useEffect } from "react";

type PasteQRZoneProps = {
  disabled?: boolean;
  onImage: (blob: Blob) => void;
  onReject: (message: string) => void;
};

export function PasteQRZone({ disabled = false, onImage, onReject }: PasteQRZoneProps) {
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (disabled || !event.clipboardData?.items) {
        return;
      }

      const imageItem = Array.from(event.clipboardData.items).find((item) =>
        item.type.startsWith("image/"),
      );

      if (!imageItem) {
        if (event.clipboardData.items.length > 0) {
          onReject("Paste a PNG or JPEG image. Text, PDFs, and other formats are not supported.");
        }
        return;
      }

      event.preventDefault();
      const blob = imageItem.getAsFile();
      if (blob) {
        onImage(blob);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [disabled, onImage, onReject]);

  useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();

      if (disabled) {
        return;
      }

      const file = Array.from(event.dataTransfer?.files ?? []).find((item) =>
        item.type.startsWith("image/"),
      );

      if (file) {
        onImage(file);
        return;
      }

      onReject("Drop a PNG or JPEG image. File picker uploads are intentionally not used.");
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [disabled, onImage, onReject]);

  return null;
}
