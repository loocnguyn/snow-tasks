"use client";

import { useState } from "react";
import type { Priority, Task } from "@/lib/types";

const priorityOrder: Priority[] = ["low", "normal", "high"];

const priorityStyle: Record<Priority, string> = {
  low: "border-l-white/15",
  normal: "border-l-accent/50",
  high: "border-l-red-400",
};

const priorityLabel: Record<Priority, string> = {
  low: "Thấp",
  normal: "Bình thường",
  high: "Cao",
};

export function TaskItem({
  task,
  onToggle,
  onDelete,
  onRename,
  onChangePriority,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  onRename: (task: Task, title: string) => void;
  onChangePriority: (task: Task, priority: Priority) => void;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  function commit() {
    const title = draft.trim();
    setEditing(false);
    if (!title || title === task.title) {
      setDraft(task.title);
      return;
    }
    onRename(task, title);
  }

  return (
    <li
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`glass group flex items-center gap-3 rounded-xl border-l-4 px-4 py-3 ${
        priorityStyle[task.priority]
      } ${draggable ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
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

      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(task.title);
              setEditing(false);
            }
          }}
          className="flex-1 rounded-md bg-transparent text-sm outline-none"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={`flex-1 text-sm ${
            task.is_done ? "text-muted line-through" : "text-foreground"
          }`}
        >
          {task.title}
        </span>
      )}

      <button
        onClick={() => {
          const currentIndex = priorityOrder.indexOf(task.priority);
          const next = priorityOrder[(currentIndex + 1) % priorityOrder.length];
          onChangePriority(task, next);
        }}
        aria-label={`Độ ưu tiên: ${priorityLabel[task.priority]}`}
        title={`Độ ưu tiên: ${priorityLabel[task.priority]} (bấm để đổi)`}
        className="text-muted shrink-0 text-xs opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
      >
        {priorityLabel[task.priority]}
      </button>

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
