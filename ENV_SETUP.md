# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How to Get These Values

1. Go to your Supabase project dashboard at https://supabase.com/dashboard
2. Select your project
3. Go to Project Settings > API
4. Copy the **Project URL** to `NEXT_PUBLIC_SUPABASE_URL`
5. Copy the **anon/public key** to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Example

```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Database Schema

The application expects the following tables in your Supabase database:

- `users` - User profiles
- `cars` - Vehicle information
- `services` - Service history
- `reminders` - Service reminders
- `payments` - Payment records

Refer to `DATABASE_SCHEMA.md` for the complete schema.

