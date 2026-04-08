Resolves #3

## Explanation of the Fix
1. **API Polling Architecture**: Removed client-side Supabase queries in `TrackingWidget.jsx`. Replaced Real-time subscription with a Smart Polling mechanism (15-second interval) pointing to a newly created secure Edge API route (`/api/track-order`).
2. **Secure Server-side Fetch**: The new API leverages the Supabase Service Role Key to bypass RLS internally, validating the exact `order_code` before returning any data.
3. **Database Schema Update**: Documented the deprecation of the overly permissive public `SELECT` policy on the `orders` table in `supabase-schema.sql` to close the PII leakage vulnerability.

## Root Cause Summary
An overly permissive RLS policy (`USING (true)`) for unauthenticated `SELECT` queries on the `orders` table exposed sensitive PII data to potential mass scraping attacks via the Supabase REST endpoint.

## Testing Notes
- [x] Verified `npm run build` succeeds.
- [x] Verified the tracking widget still updates order status correctly by fetching through the new API endpoint.
- [x] Ensured no console errors appear from the smart polling mechanism.