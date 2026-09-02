import { useCallback, useEffect, useRef, useState } from "react";
import { ActionButton } from "./components/ActionButton";
import { PasteQRZone } from "./components/PasteQRZone";
import { PreviewPanel } from "./components/PreviewPanel";
import { ToastStack } from "./components/ToastStack";
import { useToasts } from "./hooks/useToasts";
import type { AppStatus, ProcessedImage } from "./types/qr";
import { copyPreviewImage } from "./utils/copyPreviewImage";
import { processImageBlob } from "./utils/image";
import { decodeQrFromBlob, generateQrDataUrl } from "./utils/qr";

function App() {
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<AppStatus>("idle");
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [decodedContent, setDecodedContent] = useState("");
  const [generatedQrUrl, setGeneratedQrUrl] = useState("");
  const [error, setError] = useState("");
  const { toasts, pushToast, dismissToast } = useToasts();

  const canDownload = generatedQrUrl.length > 0;

  const clear = useCallback(() => {
    setStatus("idle");
    setDecodedContent("");
    setGeneratedQrUrl("");
    setError("");
    setProcessedImage((current) => {
      if (current) {
        URL.revokeObjectURL(current.objectUrl);
      }
      return null;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clear]);

  useEffect(() => {
    return () => {
      if (processedImage) {
        URL.revokeObjectURL(processedImage.objectUrl);
      }
    };
  }, [processedImage]);

  const handleImage = useCallback(
    async (blob: Blob) => {
      try {
        setError("");
        setGeneratedQrUrl("");
        setDecodedContent("");
        setStatus("image-detected");

        const nextImage = await processImageBlob(blob);
        setProcessedImage((current) => {
          if (current) {
            URL.revokeObjectURL(current.objectUrl);
          }
          return nextImage;
        });

        setStatus("reading");
        const decoded = await decodeQrFromBlob(nextImage.blob);

        if (!decoded) {
          setStatus("no-qr");
          setError("No QR code was detected in that image.");
          pushToast("No QR detected. Try a sharper screenshot.", "error");
          return;
        }

        setDecodedContent(decoded);
        pushToast("QR decoded locally.", "success");
        setStatus("generating");
        const dataUrl = await generateQrDataUrl(decoded);
        setGeneratedQrUrl(dataUrl);
        setStatus("ready");
        pushToast("New QR generated from the exact decoded content.", "success");
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : "Unable to process this image.";
        setStatus("error");
        setError(message);
        pushToast(message, "error");
      }
    },
    [pushToast],
  );

  const rejectInput = useCallback(
    (message: string) => {
      setError(message);
      setStatus("error");
      pushToast(message, "error");
    },
    [pushToast],
  );

  const copyImage = useCallback(async () => {
    if (!generatedQrUrl || !previewPanelRef.current) {
      return;
    }

    try {
      await copyPreviewImage(previewPanelRef.current);
      pushToast("HD preview image copied.", "success");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to copy preview image.";
      pushToast(message, "error");
    }
  }, [generatedQrUrl, pushToast]);

  return (
    <main className="grid min-h-screen place-items-center px-4 py-6 sm:px-6 lg:px-8">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6">
        <PasteQRZone
          onImage={handleImage}
          onReject={rejectInput}
          disabled={status === "reading" || status === "generating"}
        />

        {error ? (
          <div className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <section className="flex w-full flex-col justify-center gap-4 lg:flex-row lg:items-stretch">
          <PreviewPanel
            ref={previewPanelRef}
            title="Generated QR"
            imageUrl={generatedQrUrl}
            emptyText="Paste or drop a QR image anywhere on the page."
            alt="Generated QR"
            contain
            compactQr
          />

          <div className="flex w-full flex-col justify-center rounded-md border border-white/10 bg-white/[0.055] p-4 lg:w-80">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Actions</h3>
            <div className="mt-4 grid gap-3">
              <ActionButton type="button" onClick={copyImage} disabled={!canDownload}>
                Copy Image
              </ActionButton>
              <ActionButton type="button" variant="danger" onClick={clear}>
                Clear
              </ActionButton>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
