import type { ButtonHTMLAttributes, ReactNode } from "react";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
};

const variants = {
  primary: "border-teal-300/50 bg-teal-300 text-slate-950 hover:bg-teal-200",
  secondary: "border-white/12 bg-white/8 text-white hover:bg-white/12",
  danger: "border-rose-300/35 bg-rose-400/12 text-rose-50 hover:bg-rose-400/18",
};

export function ActionButton({ children, variant = "secondary", className = "", ...props }: ActionButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-11 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
