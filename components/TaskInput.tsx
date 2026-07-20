"use client";

import { useEffect, useRef, useState } from "react";

export function TaskInput({
  onAdd,
  existingTitles,
}: {
  onAdd: (title: string, tag: string | null) => void;
  existingTitles: string[];
}) {
  const [value, setValue] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && target === inputRef.current) {
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const title = value.trim();
    if (!title) return;

    const isDuplicate = existingTitles.some(
      (t) => t.toLowerCase() === title.toLowerCase(),
    );
    if (isDuplicate) {
      setError("Việc này đã có trong danh sách rồi");
      return;
    }

    setError(null);
    onAdd(title, tag.trim() || null);
    setValue("");
    setTag("");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Hôm nay cần làm gì? (nhấn / để focus)"
          className="glass flex-1 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent/60"
        />
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Nhãn"
          className="glass w-24 rounded-xl px-3 py-3 text-sm outline-none placeholder:text-muted focus:border-accent/60"
        />
        <button
          type="submit"
          className="rounded-xl bg-accent/90 px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Thêm
        </button>
      </div>
      {error && <p className="px-1 text-xs text-red-400">{error}</p>}
    </form>
  );
}
