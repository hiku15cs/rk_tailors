# Supabase setup

1. In the Supabase SQL Editor, run [`schema.sql`](./schema.sql).
2. Verify `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and either
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (recommended) or
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Restart the Next.js dev server after
   changing environment variables. Never put a service-role or secret key in
   the browser app or in a `NEXT_PUBLIC_` variable.
3. In Supabase Authentication, create/invite the shop's admin user. Disable
   public sign-ups if customers should not be able to create dashboard accounts.
   The dashboard accepts any authenticated user, so only invite trusted admins.
4. Start the app and open `/admin`. Sign in with the invited account.
5. Add an active design and confirm it appears in the public design collection.

The customer order lookup SQL function is available as
`supabase.rpc("lookup_order", { p_order_no, p_customer_phone })`. It requires
both values and returns only order progress fields, not customer name or phone.
Direct reads and all writes to `orders` are restricted to authenticated users
because a public table read would disclose customers' personal information.

The publishable/anon key is expected to be public; access control is enforced by
RLS. Review the policies if adding more roles or changing who may administer
this shop.
