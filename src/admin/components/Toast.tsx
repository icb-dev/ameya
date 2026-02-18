import { useEffect } from "react";

type Props = {
  message: string;
  onClose: () => void;
  duration?: number;
};

export default function Toast({ message, onClose, duration = 3000 }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800 shadow-lg"
      role="alert"
    >
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
