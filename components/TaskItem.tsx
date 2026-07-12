"use client";

import type { Task } from "@/lib/types";

export function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <li className="glass group flex items-center gap-3 rounded-xl px-4 py-3">
      <button
        onClick={() => onToggle(task)}
        aria-label={task.is_done ? "Bỏ hoàn thành" : "Đánh dấu hoàn thành"}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
          task.is_done
            ? "border-accent bg-accent text-background"
            : "border-white/25 hover:border-accent"
        }`}
      >
        {task.is_done && "✓"}
      </button>

      <span
        className={`flex-1 text-sm ${
          task.is_done ? "text-muted line-through" : "text-foreground"
        }`}
      >
        {task.title}
      </span>

      <button
        onClick={() => onDelete(task)}
        aria-label="Xoá việc"
        className="text-muted opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
      >
        ✕
      </button>
    </li>
  );
}
