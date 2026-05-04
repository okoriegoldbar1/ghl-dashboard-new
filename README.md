# GHL Pipeline Dashboard
Full reporting dashboard for GoHighLevel pipelines.
Stack: React + Vite · Vercel Serverless Functions · Supabase (free tier)

## Structure
frontend/api/        - Vercel serverless functions (the backend)
frontend/src/        - React dashboard
supabase-schema.sql  - Run this in Supabase SQL editor

## Quick setup
1. Supabase: create project, run supabase-schema.sql, copy URL + service_role key
2. GitHub: push this folder
3. Vercel: import repo, root = frontend, add 3 env vars
4. GHL: create workflow, add webhook action to /api/webhook-ghl
5. Test: move a lead in GHL, check dashboard

See full step-by-step in the chat.
