# ⛄ Snow Tasks

Web lưu những việc cần làm mỗi ngày. Next.js 16 + Supabase, deploy trên Vercel.

**Live:** _(cập nhật link Vercel sau khi deploy)_

## Tech
- Next.js 16 · React 19 · TypeScript
- Tailwind CSS 4
- Supabase (Postgres) cho lưu trữ

## Chạy local
```bash
npm install
# tạo .env.local từ .env.example và điền khoá Supabase
npm run dev
```
Mở http://localhost:3000

## Bảng dữ liệu (Supabase)
```sql
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);
```

---
Một phần trong bộ dự án của [loocnguyn](https://github.com/loocnguyn).
