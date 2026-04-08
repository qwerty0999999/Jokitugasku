## Description
The Row Level Security (RLS) policy on the `orders` table currently allows any unauthenticated user to read the entire table. This exposes highly sensitive Personal Identifiable Information (PII) including `client_name` and `client_phone` to the public internet.

## Root Cause Analysis
In `supabase-schema.sql`, the policy `"Publik bisa baca order via code"` uses `USING (true)` for `SELECT` operations. While the frontend properly filters by `order_code`, the Supabase REST API does not enforce this restriction, allowing malicious actors to dump the database using simple GET requests.

## File References
- `supabase-schema.sql` (Line ~33)
- `components/ui/TrackingWidget.jsx` (Client-side Supabase query)

## Suggested Solution
1. Update `supabase-schema.sql` to remove public `SELECT` access on the `orders` table.
2. Create a secure Next.js API route (e.g., `/api/track-order`) that uses the Supabase Service Role Key to fetch order details securely, ensuring that requests must contain an exact `order_code` match.
3. Update `TrackingWidget.jsx` to fetch data from this new internal API instead of querying the Supabase client directly.