import type { AppStatus } from "../types/qr";

type StatusPillProps = {
  status: AppStatus;
};

const labels: Record<AppStatus, string> = {
  idle: "Idle",
  "image-detected": "Image detected",
  reading: "Reading QR...",
  decoded: "QR decoded",
  generating: "Generating...",
  ready: "Ready",
  "no-qr": "No QR detected",
  error: "Needs attention",
};

const styles: Record<AppStatus, string> = {
  idle: "border-slate-500/40 bg-slate-500/10 text-slate-200",
  "image-detected": "border-cyan-400/40 bg-cyan-400/10 text-cyan-100",
  reading: "border-amber-300/40 bg-amber-300/10 text-amber-100",
  decoded: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100",
  generating: "border-violet-300/40 bg-violet-300/10 text-violet-100",
  ready: "border-teal-300/50 bg-teal-300/10 text-teal-100",
  "no-qr": "border-rose-400/40 bg-rose-400/10 text-rose-100",
  error: "border-rose-400/40 bg-rose-400/10 text-rose-100",
};

export function StatusPill({ status }: StatusPillProps) {
  const isLoading = status === "reading" || status === "generating";

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {isLoading ? <span className="h-2 w-2 animate-pulse rounded-full bg-current" /> : null}
      {labels[status]}
    </div>
  );
}
