import type { Task } from "@/lib/types";

const dayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function WeeklyStats({ tasks }: { tasks: Task[] }) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const counts = days.map((day) => {
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    return tasks.filter((t) => {
      if (!t.completed_at) return false;
      const completed = new Date(t.completed_at);
      return completed >= day && completed < next;
    }).length;
  });

  const max = Math.max(1, ...counts);
  const total = counts.reduce((sum, c) => sum + c, 0);

  if (total === 0) return null;

  return (
    <div className="glass rounded-xl px-4 py-3">
      <p className="text-muted mb-2 text-xs">
        Đã hoàn thành {total} việc trong 7 ngày qua
      </p>
      <div className="flex items-end justify-between gap-1.5">
        {counts.map((count, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-accent/70"
              style={{ height: `${Math.max(4, (count / max) * 40)}px` }}
              title={`${count} việc`}
            />
            <span className="text-muted text-[10px]">
              {dayLabels[days[i].getDay()]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
