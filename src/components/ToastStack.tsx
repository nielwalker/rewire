import type { Toast } from "../types/qr";

type ToastStackProps = {
  toasts: Toast[];
  onDismiss: (id: number) => void;
};

const toastStyles: Record<Toast["type"], string> = {
  success: "border-emerald-400/40 bg-emerald-400/12 text-emerald-50",
  error: "border-rose-400/40 bg-rose-400/12 text-rose-50",
  info: "border-sky-400/40 bg-sky-400/12 text-sky-50",
};

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  return (
    <div className="fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => onDismiss(toast.id)}
          className={`rounded-md border px-4 py-3 text-left text-sm shadow-lg backdrop-blur transition hover:scale-[1.01] ${toastStyles[toast.type]}`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
