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

      const items = Array.from(event.clipboardData.items);
      const imageItem =
        items.find((item) => item.kind === "file" && item.type.startsWith("image/")) ??
        items.find((item) => item.kind === "file");

      if (!imageItem) {
        if (event.clipboardData.items.length > 0) {
          onReject("No image was found in the clipboard. Copy the QR image or take a screenshot, then paste it.");
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

      const files = Array.from(event.dataTransfer?.files ?? []);
      const file = files.find((item) => item.type.startsWith("image/")) ?? files[0];

      if (file) {
        onImage(file);
        return;
      }

      onReject("No image file was found in the dropped content.");
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
