import { createClient } from "@supabase/supabase-js";

// Client dùng khoá publishable (anon) — CRUD công khai ở giai đoạn chưa có auth.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
