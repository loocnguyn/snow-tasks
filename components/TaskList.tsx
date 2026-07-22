"use client";

import { useState } from "react";
import type { Priority, Task } from "@/lib/types";
import { TaskItem } from "./TaskItem";

export function TaskList({
  tasks,
  onToggle,
  onDelete,
  onRename,
  onChangePriority,
  onTogglePin,
  onChangeNotes,
  onReorder,
}: {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  onRename: (task: Task, title: string) => void;
  onChangePriority: (task: Task, priority: Priority) => void;
  onTogglePin: (task: Task) => void;
  onChangeNotes: (task: Task, notes: string) => void;
  onReorder?: (tasks: Task[]) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  if (tasks.length === 0) {
    return (
      <p className="text-muted py-10 text-center text-sm">
        Chưa có việc nào. Thêm việc đầu tiên ở trên nhé ⛄
      </p>
    );
  }

  function handleDrop(dropIndex: number) {
    if (dragIndex === null || !onReorder || dragIndex === dropIndex) return;
    const next = [...tasks];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, moved);
    onReorder(next);
    setDragIndex(null);
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onRename={onRename}
          onChangePriority={onChangePriority}
          onTogglePin={onTogglePin}
          onChangeNotes={onChangeNotes}
          draggable={!!onReorder}
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => onReorder && e.preventDefault()}
          onDrop={() => handleDrop(index)}
        />
      ))}
    </ul>
  );
}
