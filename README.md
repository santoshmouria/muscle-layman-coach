# Muscle Layman — Coach workspace

A responsive, single-page coaching workspace built with plain HTML, CSS and JavaScript. It includes a fictional 100-client roster, a gym/bodyweight plan builder, per-coach completion tracking, an optional Supabase backend and an on-demand AI plan review.

## Run locally

Open `index.html` in a browser, or serve this folder with any static web server. The default demo works without an account or API keys. Demo plans are stored in the browser's local storage and use fictional sample data.

## Connect your existing Supabase tables

The app is wired to the existing table names and columns provided for this project:

- `client_onboarding` — client IDs, names, demographics and onboarding/health details
- `coaches` — coach IDs, `full_name`, and email
- `shared_exercises` — movement library, exercise cues and equipment
- `shared_food_database` — foods, serving sizes, macros and diet tags
- `coach_assigned_plans` — coach/client assignment, macro targets, JSON workout routine, AI evaluation and score

**Do not run [`supabase/schema.sql`](./supabase/schema.sql) against the existing database.** That file is an alternative schema for a new, empty Supabase project and is not the schema used by the existing-table integration.

1. If your `coaches` table still has the original `Coach A` / `Coach B` profiles, run [`supabase/add-coaches.sql`](./supabase/add-coaches.sql) in the Supabase SQL Editor. The script renames existing rows without changing coach UUIDs; it inserts a missing coach row only if needed. It uses the coach emails already supplied for this project.
2. In the app, open **Settings**. The project URL is prefilled. Enter the project's **publishable** key (or legacy public `anon` key) and sign in with the Supabase Auth account whose email matches a row in `coaches.email`. Never use a `service_role` or secret key in the browser.
3. Ensure authenticated coach accounts have the necessary Supabase grants and row-level-security policies: coaches must be able to read their permitted coach profiles and the shared client, exercise and food rows; plan reads/inserts/updates must be restricted to the appropriate coach IDs. The browser only uses the signed-in user token. Review the existing project's policies before changing them. For the app's expected read/write permissions and safe table policies, see [`supabase/EXISTING-DATABASE.md`](./supabase/EXISTING-DATABASE.md).
4. The exercise table does not currently have a Gym/Bodyweight column. Until it does, the app filters known bodyweight names and uses equipment as a fallback. For accurate classification of your entire library, optionally run [`supabase/existing-schema-exercises.sql`](./supabase/existing-schema-exercises.sql) and set `training_mode` on each exercise to `Gym` or `Bodyweight`. Leave it null only when using the app's fallback classification.

In the UI, the existing coach rows display as **Coach A** and **Coach B**. Rows named either with those labels or their current coach names are mapped to these labels without changing database records or coach UUIDs. The app preserves their Supabase UUIDs when saving plans. Client IDs use `client_onboarding.id`; client names come from `full_name`. Existing `coach_assigned_plans` rows are loaded and saved using the table's individual macro columns and `workout_routine` / `ai_evaluation` JSONB fields.

The app writes `coach_assigned_plans.training_mode` as lowercase `gym` or `bodyweight` to match the existing table's check constraint.

The header shows whether the app is in local mock mode or connected to Supabase, including the connected project reference. The Coach A / Coach B selection is stored in this browser. Progress counts are scoped to that coach; pending roster means clients without an assigned draft or completed plan for the selected coach. The client roster has name/goal/ID search and filters for unassigned plans, recorded medical flags, and explicit vegetarian/non-vegetarian preferences. Health tags are cautious reminders based on recorded onboarding text, not diagnoses.

The movement-plan builder uses Day 1–Day 7 split tabs (Push / Quads, Pull / Posterior Chain, Upper / Core, Lower / Glutes, Full Body, Conditioning, and Recovery / Mobility). Exercise search includes muscle-group and equipment labels and combines the shared/demo movements with the English exercise catalog from the [wger API](https://wger.de/api/v2/exerciseinfo/?language=2). wger exercise images are shown where available; source and applicable image/exercise license links are retained with the plan. wger content may use different Creative Commons or open-data licenses, so check the per-item credit before reusing or redistributing it. The catalog is loaded directly from wger; if the request is unavailable, the shared/demo exercise list remains usable. Workout JSON stores sets, reps, RIR, rest time, tempo, coaching cues, and library safety notes; existing routines without these optional fields receive sensible editor defaults. Safety flags surface library contraindications and prompt an extra tolerance review when a related spinal/back or blood-pressure note is recorded alongside a potentially demanding movement. These flags are reminders for coach/client and clinician review, not medical advice.

Nutrition calories are calculated from macros (protein × 4 + carbs × 4 + fat × 9), with macro energy percentages and weight-relative protein/calorie ratios when client weight is recorded. The export dialog creates a client-facing workout and nutrition sheet for printing or saving to PDF and a formatted clipboard summary suitable for messaging. Administrative controls and health-profile details are not included in the export.

The app cannot inspect or change your Supabase project's actual grants or RLS policies from the browser. If a table request is denied, the Settings dialog shows the Supabase error; correct the table privileges/policies in Supabase before using real client health data.

## AI plan review

Select **Review this plan**, choose Gemini, OpenAI, Anthropic, or a custom OpenAI-compatible endpoint, then enter that provider's API key and model. The custom option requires the complete HTTPS Chat Completions URL. Gemini defaults to `gemini-2.5-flash`. The app requests a structured JSON review with an overall verdict, a non-clinical score, macro critique, biomechanical considerations and alternatives, and physiological rationale. Requests time out after 35 seconds. Gemini uses the Interactions API with interaction storage disabled. API keys stay in page memory only and are cleared after each attempt; they are never saved by this app.

When a review identifies an exact movement and a matching exercise-library alternative, **Apply swap** lets the coach replace it while retaining the workout prescription. The coach must explicitly apply the swap and save the updated plan. Saved `ai_evaluation` data includes the full review plus the reviewed coach/client, macro, and workout snapshot; plan inputs are also stored in the plan's existing macro columns and workout JSON. This is the latest review snapshot, not an immutable version history.

These direct browser integrations depend on each provider's API access and CORS support; a provider may require a backend proxy. Browser-based keys can be inspected by anyone with access to the page. For production, route requests through a secure backend and never deploy provider secrets in this public static app. Provider billing and terms apply. AI feedback is educational only, not medical advice or a diagnosis; verify it before acting on any suggestion.

## Deploy to GitHub Pages

1. Put the contents of this folder in the root of a GitHub repository, or configure the repository's Pages source to use this folder.
2. In GitHub, go to **Settings → Pages**, choose the desired branch and folder, and save.
3. Wait for the Pages deployment to finish, then open the Pages URL.
4. Configure Supabase and Gemini separately in the app as needed. GitHub Pages serves static files; it does not hide API keys or provide a backend. Protect Supabase data with the included row-level security and appropriate project settings.

## Data and scope notes

- The seed roster is 100 fictional profiles using a mix of Indian names. Client 007 has a fictional L4–L5 history solely to demonstrate displaying health context; it is not clinical guidance.
- Each selected client's name and stable database ID are shown on their profile card. Demo IDs are readable synthetic identifiers; Supabase-connected IDs are the client's UUIDs.
- Completion state is per coach/client pair. **Save & complete** saves the plan and updates the completion count. The plan header status can still be used to move a completed plan back to draft.
- Shared foods are a reference list; macro targets are entered by the coach and are not automatically calculated from the food list.
- The app deliberately keeps database reads and writes behind Supabase Auth and row-level security; never enable public/anonymous access to real client or medical data.
