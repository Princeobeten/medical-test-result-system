# Online Medical Test Result System

Final year project — CRUTECH (UNICROSS) Medical Center. Built with Next.js (App Router, TypeScript), MongoDB/Mongoose, and NextAuth.js.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- MongoDB Atlas via Mongoose
- NextAuth.js (Credentials provider, JWT sessions)
- react-hook-form + zod for forms/validation

## Roles

- **Admin** — manage staff accounts (add/modify), view/share/print all test records
- **Technologist** — conduct tests, process results, view own tests, send results (generates a secure link)

There is no patient login. Once a technologist sends a result, a tokenized link (`/results/view/[token]`) is generated; anyone with the link can view the result after confirming the patient's last name and date of birth.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. `.env` already contains `MONGODB_URI`, `JWT_SECRET`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`. Update `NEXTAUTH_URL` if you deploy elsewhere.
3. Seed the first admin account:
   ```bash
   npm run seed
   ```
   This prints a one-time email/password for `admin@example.com`. **Log in and change the password immediately** — it is only shown once.
4. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` / `npm run start` — production build/serve
- `npm run lint` — ESLint
- `npm run seed` — create the bootstrap admin account (no-op if one already exists)

## Typical Flow

1. Admin logs in, adds a technologist account under **Staff**.
2. Technologist logs in, goes to **Conduct Test**, picks/adds a patient and a test type.
3. Technologist opens the test record, enters result parameters, and **Save Results**.
4. Technologist clicks **Send Result** — this generates the secure result link.
5. Admin can see the record under **Tests**, copy/share the link, or open a printable report.
6. Anyone with the link visits `/results/view/[token]`, enters the patient's last name + date of birth, and views the result.

## Project Structure

- `src/models/` — Mongoose schemas (User, Patient, TestType, TestRecord)
- `src/app/api/` — REST API routes
- `src/app/admin/`, `src/app/technologist/` — role-specific dashboards (guarded by `src/proxy.ts`)
- `src/app/results/view/[token]/` — public tokenized result view
- `src/lib/` — DB connection, auth config, session helpers, validators
