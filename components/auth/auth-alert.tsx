type AuthAlertProps = {
  message: string;
  tone?: "error" | "success" | "info";
};

const toneStyles = {
  error: "border-rose-200 bg-rose-50 text-rose-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
};

export function AuthAlert({
  message,
  tone = "info",
}: AuthAlertProps) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${toneStyles[tone]}`}>
      {message}
    </div>
  );
}
