"use client";

import type { Task } from "@/lib/types";
import { TaskItem } from "./TaskItem";

export function TaskList({
  tasks,
  onToggle,
  onDelete,
  onRename,
}: {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  onRename: (task: Task, title: string) => void;
}) {
  if (tasks.length === 0) {
    return (
      <p className="text-muted py-10 text-center text-sm">
        Chưa có việc nào. Thêm việc đầu tiên ở trên nhé ⛄
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
    </ul>
  );
}
