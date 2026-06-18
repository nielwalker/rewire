import { forwardRef } from "react";

type PreviewPanelProps = {
  title: string;
  imageUrl?: string | null;
  emptyText: string;
  alt: string;
  contain?: boolean;
  compactQr?: boolean;
};

export const PreviewPanel = forwardRef<HTMLDivElement, PreviewPanelProps>(function PreviewPanel(
  { title, imageUrl, emptyText, alt, contain = false, compactQr = false },
  ref,
) {
  if (compactQr) {
    return (
      <div
        ref={ref}
        className="relative flex min-h-[96px] w-[min(920px,100%)] min-w-0 items-center justify-between gap-4 overflow-hidden bg-cover bg-center p-4"
        style={{
          backgroundImage: "url('/dc.png')",
          fontFamily: '"gg Sans", "Noto Sans", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div className="absolute inset-0 bg-slate-950/45" />
        <div className="relative min-w-0">
          <p
            className="font-semibold uppercase text-slate-100"
            style={{
              fontSize: "28px",
            }}
          >
            CONNECTING PROCESS
          </p>
          <p
            className="mt-2 leading-6 text-slate-300"
            style={{
              fontSize: "16px",
            }}
          >
            Please Scan the QR code with your Bank/E-wallet to Finish the Connection. By connecting, you agree to comply with our guidelines and policies as outlined in the documentation.
          </p>
          <p
            className="mt-2 italic leading-6 text-red-500"
            style={{
              fontSize: "13px",
            }}
          >
            *Failure to comply may result in account suspension or termination. Please ensure you understand and adhere to the guidelines outlined in the documentation to avoid any disruptions to your service.*
          </p>
        </div>
        <div className="relative grid h-[245px] w-[245px] shrink-0 place-items-center overflow-hidden rounded bg-white">
          {imageUrl ? (
            <img src={imageUrl} alt={alt} className="h-[245px] w-[245px] object-contain" />
          ) : (
            <span className="px-1 text-center text-[8px] leading-tight text-slate-500">{emptyText}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <section ref={ref} className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">{title}</h3>
      <div className="mt-4 grid aspect-square place-items-center overflow-hidden rounded-md bg-slate-950/55">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={alt}
            className={`h-full w-full ${contain ? "object-contain p-5" : "object-cover"}`}
          />
        ) : (
          <p className="px-6 text-center text-sm text-slate-500">{emptyText}</p>
        )}
      </div>
    </section>
  );
});
