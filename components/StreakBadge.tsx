import type { Task } from "@/lib/types";

function toDateKey(iso: string) {
  return new Date(iso).toDateString();
}

export function StreakBadge({ tasks }: { tasks: Task[] }) {
  const completedDays = new Set(
    tasks.filter((t) => t.completed_at).map((t) => toDateKey(t.completed_at!)),
  );

  if (completedDays.size === 0) return null;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // Nếu hôm nay chưa hoàn thành việc nào, bắt đầu đếm từ hôm qua.
  if (!completedDays.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (completedDays.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  if (streak === 0) return null;

  return (
    <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs">
      🔥 <span className="text-foreground font-medium">{streak}</span>
      <span className="text-muted">ngày liên tiếp</span>
    </span>
  );
}
