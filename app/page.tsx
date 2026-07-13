"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TaskInput } from "@/components/TaskInput";
import { TaskList } from "@/components/TaskList";
import { TaskSummary } from "@/components/TaskSummary";
import { TaskFilter, type Filter } from "@/components/TaskFilter";
import { Toast } from "@/components/Toast";
import type { Task } from "@/lib/types";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<Task[]>()
      .then(({ data }) => {
        setTasks(data ?? []);
        setLoading(false);
      });
  }, []);

  async function addTask(title: string) {
    const { data } = await supabase
      .from("tasks")
      .insert({ title })
      .select()
      .single<Task>();
    if (data) {
      setTasks((prev) => [data, ...prev]);
      setToast("Đã thêm việc mới");
    }
  }

  async function toggleTask(task: Task) {
    const next = !task.is_done;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, is_done: next } : t)),
    );
    await supabase.from("tasks").update({ is_done: next }).eq("id", task.id);
  }

  async function deleteTask(task: Task) {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    await supabase.from("tasks").delete().eq("id", task.id);
    setToast("Đã xoá việc");
  }

  async function renameTask(task: Task, title: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, title } : t)),
    );
    await supabase.from("tasks").update({ title }).eq("id", task.id);
  }

  async function clearDone() {
    const doneIds = tasks.filter((t) => t.is_done).map((t) => t.id);
    if (doneIds.length === 0) return;
    setTasks((prev) => prev.filter((t) => !t.is_done));
    await supabase.from("tasks").delete().in("id", doneIds);
    setToast("Đã xoá các việc hoàn thành");
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-20 sm:py-24">
      <header className="animate-in flex flex-col items-center text-center">
        <span className="glass mb-4 rounded-full px-4 py-1.5 text-xs tracking-wide text-muted uppercase">
          ⛄ Snow Tasks
        </span>
        <h1 className="text-gradient text-4xl font-bold tracking-tight sm:text-5xl">
          Việc cần làm
        </h1>
        <p className="text-muted mt-3 text-sm sm:text-base">
          Ghi lại và theo dõi những việc bạn phải làm mỗi ngày.
        </p>
      </header>

      <section className="animate-in mt-10 flex flex-col gap-4">
        <TaskInput onAdd={addTask} existingTitles={tasks.map((t) => t.title)} />
        <div className="flex items-center justify-between gap-3">
          <TaskSummary
            total={tasks.length}
            remaining={tasks.filter((t) => !t.is_done).length}
          />
          <TaskFilter value={filter} onChange={setFilter} />
        </div>
        {tasks.some((t) => t.is_done) && (
          <button
            onClick={clearDone}
            className="text-muted self-end text-xs underline-offset-2 hover:text-foreground hover:underline"
          >
            Xoá việc đã xong
          </button>
        )}
        {loading ? (
          <p className="text-muted py-10 text-center text-sm">Đang tải…</p>
        ) : (
          <TaskList
            tasks={tasks.filter((t) =>
              filter === "active"
                ? !t.is_done
                : filter === "done"
                  ? t.is_done
                  : true,
            )}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onRename={renameTask}
          />
        )}
      </section>

      <footer className="text-muted mt-auto pt-24 text-center text-xs">
        © {new Date().getFullYear()} Nguyễn Thành Lộc · Built with Next.js &
        Supabase
      </footer>

      <Toast message={toast} onDone={() => setToast(null)} />
    </main>
  );
}
