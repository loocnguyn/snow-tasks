"use client";

import { useEffect } from "react";

export function Toast({
  message,
  onDone,
}: {
  message: string | null;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div className="glass animate-in fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl px-4 py-2.5 text-sm">
      {message}
    </div>
  );
}
