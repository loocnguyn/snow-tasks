export type Filter = "all" | "active" | "done";

const options: { value: Filter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang làm" },
  { value: "done", label: "Hoàn thành" },
];

export function TaskFilter({
  value,
  onChange,
}: {
  value: Filter;
  onChange: (filter: Filter) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
            value === opt.value
              ? "bg-accent/90 text-background"
              : "text-muted glass hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
