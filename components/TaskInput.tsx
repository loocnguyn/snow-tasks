"use client";

import { useState } from "react";

export function TaskInput({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const title = value.trim();
    if (!title) return;
    onAdd(title);
    setValue("");
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Hôm nay cần làm gì?"
        className="glass flex-1 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent/60"
      />
      <button
        type="submit"
        className="rounded-xl bg-accent/90 px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Thêm
      </button>
    </form>
  );
}
