export type Priority = "low" | "normal" | "high";

export type Task = {
  id: string;
  title: string;
  is_done: boolean;
  position: number;
  priority: Priority;
  created_at: string;
};
