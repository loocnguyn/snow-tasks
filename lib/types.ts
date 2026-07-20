export type Priority = "low" | "normal" | "high";

export type Task = {
  id: string;
  title: string;
  is_done: boolean;
  position: number;
  priority: Priority;
  pinned: boolean;
  tag: string | null;
  created_at: string;
};
