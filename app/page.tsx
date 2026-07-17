"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TaskInput } from "@/components/TaskInput";
import { TaskList } from "@/components/TaskList";
import { TaskSummary } from "@/components/TaskSummary";
import { TaskFilter, type Filter } from "@/components/TaskFilter";
import { Toast } from "@/components/Toast";
import type { Priority, Task } from "@/lib/types";

const priorityWeight: Record<Priority, number> = { high: 0, normal: 1, low: 2 };

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [toast, setToast] = useState<string | null>(null);
  const [sortByPriority, setSortByPriority] = useState(false);
  const [loadError, setLoadError] = useState(false);

  function loadTasks() {
    setLoading(true);
    setLoadError(false);
    supabase
      .from("tasks")
      .select("*")
      .order("position", { ascending: true })
      .returns<Task[]>()
      .then(({ data, error }) => {
        if (error) {
          setLoadError(true);
        } else {
          setTasks(data ?? []);
        }
        setLoading(false);
      });
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(title: string) {
    const minPosition = tasks.reduce((min, t) => Math.min(min, t.position), 0);
    const { data, error } = await supabase
      .from("tasks")
      .insert({ title, position: minPosition - 1 })
      .select()
      .single<Task>();
    if (error) {
      setToast("Không thể thêm việc, thử lại nhé");
      return;
    }
    setTasks((prev) => [data, ...prev]);
    setToast("Đã thêm việc mới");
  }

  async function reorderTasks(reordered: Task[]) {
    const previous = tasks;
    setTasks(reordered);
    const results = await Promise.all(
      reordered.map((task, index) =>
        supabase.from("tasks").update({ position: index }).eq("id", task.id),
      ),
    );
    if (results.some((r) => r.error)) {
      setTasks(previous);
      setToast("Không thể lưu thứ tự, thử lại nhé");
    }
  }

  async function toggleTask(task: Task) {
    const next = !task.is_done;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, is_done: next } : t)),
    );
    const { error } = await supabase
      .from("tasks")
      .update({ is_done: next })
      .eq("id", task.id);
    if (error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, is_done: !next } : t)),
      );
      setToast("Không thể cập nhật, thử lại nhé");
    }
  }

  async function deleteTask(task: Task) {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    const { error } = await supabase.from("tasks").delete().eq("id", task.id);
    if (error) {
      setTasks((prev) => [...prev, task]);
      setToast("Không thể xoá, thử lại nhé");
      return;
    }
    setToast("Đã xoá việc");
  }

  async function renameTask(task: Task, title: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, title } : t)),
    );
    const { error } = await supabase
      .from("tasks")
      .update({ title })
      .eq("id", task.id);
    if (error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, title: task.title } : t)),
      );
      setToast("Không thể đổi tên, thử lại nhé");
    }
  }

  async function changePriority(task: Task, priority: Priority) {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, priority } : t)),
    );
    const { error } = await supabase
      .from("tasks")
      .update({ priority })
      .eq("id", task.id);
    if (error) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, priority: task.priority } : t,
        ),
      );
      setToast("Không thể đổi độ ưu tiên, thử lại nhé");
    }
  }

  async function togglePin(task: Task) {
    const pinned = !task.pinned;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, pinned } : t)),
    );
    const { error } = await supabase
      .from("tasks")
      .update({ pinned })
      .eq("id", task.id);
    if (error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, pinned: !pinned } : t)),
      );
      setToast("Không thể ghim, thử lại nhé");
    }
  }

  async function clearDone() {
    const previous = tasks;
    const doneIds = tasks.filter((t) => t.is_done).map((t) => t.id);
    if (doneIds.length === 0) return;
    setTasks((prev) => prev.filter((t) => !t.is_done));
    const { error } = await supabase.from("tasks").delete().in("id", doneIds);
    if (error) {
      setTasks(previous);
      setToast("Không thể xoá, thử lại nhé");
      return;
    }
    setToast("Đã xoá các việc hoàn thành");
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-12 sm:px-6 sm:py-24">
      <header className="animate-in flex flex-col items-center text-center">
        <span className="glass mb-4 rounded-full px-4 py-1.5 text-xs tracking-wide text-muted uppercase">
          ⛄ Snow Tasks
        </span>
        <h1 className="text-gradient text-3xl font-bold tracking-tight sm:text-5xl">
          Việc cần làm
        </h1>
        <p className="text-muted mt-3 text-sm sm:text-base">
          Ghi lại và theo dõi những việc bạn phải làm mỗi ngày.
        </p>
      </header>

      <section className="animate-in mt-8 flex flex-col gap-4 sm:mt-10">
        <TaskInput onAdd={addTask} existingTitles={tasks.map((t) => t.title)} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TaskSummary
            total={tasks.length}
            remaining={tasks.filter((t) => !t.is_done).length}
          />
          <TaskFilter value={filter} onChange={setFilter} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <label className="text-muted flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={sortByPriority}
              onChange={(e) => setSortByPriority(e.target.checked)}
            />
            Sắp xếp theo độ ưu tiên
          </label>
          {tasks.some((t) => t.is_done) && (
            <button
              onClick={clearDone}
              className="text-muted text-xs underline-offset-2 hover:text-foreground hover:underline"
            >
              Xoá việc đã xong
            </button>
          )}
        </div>
        {loading ? (
          <p className="text-muted py-10 text-center text-sm">Đang tải…</p>
        ) : loadError ? (
          <div className="glass flex flex-col items-center gap-3 rounded-xl px-4 py-10 text-center">
            <p className="text-muted text-sm">
              Không tải được danh sách việc. Kiểm tra kết nối mạng và thử lại.
            </p>
            <button
              onClick={loadTasks}
              className="rounded-lg bg-accent/90 px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <TaskList
            tasks={tasks
              .filter((t) =>
                filter === "active"
                  ? !t.is_done
                  : filter === "done"
                    ? t.is_done
                    : true,
              )
              .sort((a, b) => {
                if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
                return sortByPriority
                  ? priorityWeight[a.priority] - priorityWeight[b.priority]
                  : 0;
              })}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onRename={renameTask}
            onChangePriority={changePriority}
            onTogglePin={togglePin}
            onReorder={filter === "all" && !sortByPriority ? reorderTasks : undefined}
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
