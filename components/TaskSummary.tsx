export function TaskSummary({
  total,
  remaining,
}: {
  total: number;
  remaining: number;
}) {
  if (total === 0) return null;

  return (
    <p className="text-muted px-1 text-sm">
      {remaining === 0
        ? "Xong hết rồi! 🎉"
        : `Còn ${remaining}/${total} việc chưa xong`}
    </p>
  );
}
