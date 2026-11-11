# Existing database access requirements

The website signs in through Supabase Auth and uses the resulting user access token for all table requests. Never put a `service_role` or secret key in this browser app.

Before connecting, check **Database → Tables → RLS policies** and **API settings** for the existing project. The signed-in account needs:

- `SELECT` on `coaches`, `client_onboarding`, `shared_exercises`, `shared_food_database`, and `coach_assigned_plans`, for the rows that account is permitted to see.
- `INSERT` and `UPDATE` on `coach_assigned_plans`, restricted to plans the signed-in coach owns.
- RLS enabled on tables containing client and plan information, with policies that restrict plan reads/writes by the `coach_id` foreign key and that coach's `coaches.id`.

The existing `coaches` table has `email` instead of an `auth_user_id`. Link the Supabase Auth account to a coach row using the matching email, and write coach policies against that relationship. The app maps the existing `Coach A` and `Coach B` labels to Thulshi and Pratiksha in the UI; it continues to use the original coach UUIDs in stored plans.

The exact existing RLS policies were not included with the column-list export, so this guide intentionally does not replace or disable any of them. Review current policies before adding policies: permissive Supabase policies are combined, and an older broad policy can unintentionally grant access even when a new restrictive policy is added. Do not expose onboarding/client tables to the anonymous role.

The plan table must accept one row per coach/client pair for the UI's create-then-update flow. The provided column export confirms the necessary plan fields but does not show foreign keys, uniqueness rules, grants or existing RLS policies. Verify those in the project before saving real plans.
