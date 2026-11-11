(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const storageKeys = {
    settings: "form-field-settings-v1",
    demoPlans: "form-field-demo-plans-v1",
    session: "form-field-session-v1",
  };
  const defaultSupabaseUrl = "https://ugtddogwcxduubbqbuel.supabase.co";
  const wgerApiUrl = "https://wger.de/api/v2/exerciseinfo/?limit=1000&language=2";
  const wgerLicense = {
    1: { name: "CC BY-SA 3.0", url: "https://creativecommons.org/licenses/by-sa/3.0/" },
    2: { name: "CC BY-SA 4.0", url: "https://creativecommons.org/licenses/by-sa/4.0/" },
    3: { name: "CC0 1.0", url: "https://creativecommons.org/publicdomain/zero/1.0/" },
    4: { name: "CC BY 4.0", url: "https://creativecommons.org/licenses/by/4.0/" },
    5: { name: "ODbL", url: "https://opendatacommons.org/licenses/odbl/" },
  };
  const workoutDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const modes = {
    gym: [
      { id: "g1", name: "Goblet squat", category: "Lower body", equipment: "Dumbbell" },
      { id: "g2", name: "Leg press", category: "Lower body", equipment: "Machine" },
      { id: "g3", name: "Dumbbell Romanian deadlift", category: "Posterior chain", equipment: "Dumbbells" },
      { id: "g4", name: "Seated leg curl", category: "Posterior chain", equipment: "Machine" },
      { id: "g5", name: "Hip thrust", category: "Glutes", equipment: "Barbell / bench" },
      { id: "g6", name: "Cable row", category: "Upper body", equipment: "Cable" },
      { id: "g7", name: "Chest-supported row", category: "Upper body", equipment: "Bench / dumbbells" },
      { id: "g8", name: "Machine chest press", category: "Upper body", equipment: "Machine" },
      { id: "g9", name: "Dumbbell bench press", category: "Upper body", equipment: "Dumbbells / bench" },
      { id: "g10", name: "Lat pulldown", category: "Upper body", equipment: "Cable" },
      { id: "g11", name: "Pallof press", category: "Core stability", equipment: "Cable / band" },
      { id: "g12", name: "Recumbent bike", category: "Cardio", equipment: "Machine" },
    ],
    bodyweight: [
      { id: "b1", name: "Box squat", category: "Lower body", equipment: "Chair / box" },
      { id: "b2", name: "Supported split squat", category: "Lower body", equipment: "Wall / chair" },
      { id: "b3", name: "Glute bridge", category: "Glutes", equipment: "Mat" },
      { id: "b4", name: "Bird dog", category: "Core stability", equipment: "Mat" },
      { id: "b5", name: "Dead bug", category: "Core stability", equipment: "Mat" },
      { id: "b6", name: "Incline push-up", category: "Upper body", equipment: "Wall / counter" },
      { id: "b7", name: "Wall push-up", category: "Upper body", equipment: "Wall" },
      { id: "b8", name: "Wall sit", category: "Lower body", equipment: "Wall" },
      { id: "b9", name: "Step-up", category: "Lower body", equipment: "Low step" },
      { id: "b10", name: "Standing calf raise", category: "Lower body", equipment: "Chair for support" },
      { id: "b11", name: "Side-lying clam", category: "Glutes", equipment: "Mat" },
      { id: "b12", name: "March in place", category: "Cardio", equipment: "None" },
    ],
  };
  const demoFoods = [
    { name: "Greek yogurt, plain", serving: "170 g", calories: 100, protein: 17, carbs: 6, fat: 0 },
    { name: "Lentils, cooked", serving: "1 cup", calories: 230, protein: 18, carbs: 40, fat: 1 },
    { name: "Chicken breast, cooked", serving: "100 g", calories: 165, protein: 31, carbs: 0, fat: 4 },
    { name: "Tofu, firm", serving: "100 g", calories: 145, protein: 16, carbs: 4, fat: 9 },
    { name: "Rolled oats, dry", serving: "40 g", calories: 150, protein: 5, carbs: 27, fat: 3 },
    { name: "Salmon, cooked", serving: "100 g", calories: 206, protein: 22, carbs: 0, fat: 13 },
    { name: "Brown rice, cooked", serving: "1 cup", calories: 216, protein: 5, carbs: 45, fat: 2 },
    { name: "Egg, whole", serving: "1 large", calories: 72, protein: 6, carbs: 0, fat: 5 },
  ];
  const goals = ["Strength & energy", "Build consistency", "Body recomposition", "General fitness", "Build strength"];
  const demoNames = [
    { name: "Aarav Sharma", sex: "Man" },
    { name: "Ananya Iyer", sex: "Woman" },
    { name: "Arjun Patel", sex: "Man" },
    { name: "Diya Nair", sex: "Woman" },
    { name: "Ishaan Mehta", sex: "Man" },
    { name: "Kavya Reddy", sex: "Woman" },
    { name: "Kabir Singh", sex: "Man" },
    { name: "Meera Kulkarni", sex: "Woman" },
    { name: "Rohan Desai", sex: "Man" },
    { name: "Saanvi Rao", sex: "Woman" },
    { name: "Vihaan Joshi", sex: "Man" },
    { name: "Aditi Menon", sex: "Woman" },
    { name: "Dev Malhotra", sex: "Man" },
    { name: "Pooja Verma", sex: "Woman" },
    { name: "Karan Kapoor", sex: "Man" },
    { name: "Ira Chatterjee", sex: "Woman" },
    { name: "Neel Shah", sex: "Man" },
    { name: "Riya Banerjee", sex: "Woman" },
    { name: "Aditya Rao", sex: "Man" },
    { name: "Nisha Gupta", sex: "Woman" },
    { name: "Rahul Pillai", sex: "Man" },
    { name: "Sneha Das", sex: "Woman" },
    { name: "Vikram Sethi", sex: "Man" },
    { name: "Lakshmi Krishnan", sex: "Woman" },
    { name: "Siddharth Bose", sex: "Man" },
  ];
  const demoClients = Array.from({ length: 100 }, (_, index) => {
    const number = index + 1;
    const hasBackNote = number === 7;
    const identity = demoNames[index % demoNames.length];
    return {
      id: `demo-client-${String(number).padStart(3, "0")}`,
      name: `${identity.name} ${String(number).padStart(3, "0")}`,
      age: 24 + ((number * 7) % 42),
      sex: identity.sex,
      heightCm: 155 + ((number * 3) % 37),
      weightKg: 54 + ((number * 5) % 52),
      goal: goals[(number - 1) % goals.length],
      activity: ["Lightly active", "Moderately active", "Active"][number % 3],
      constraints: hasBackNote
        ? "Fictional demo note: history of L4–L5 disc bulges. Confirm current symptoms and movement tolerance with the client; follow guidance from their licensed clinician."
        : "None recorded in this fictional demo profile. Ask the client about symptoms, history, medications and movement preferences.",
      history:
        number % 4 === 0
          ? "Returning to activity after a long break; prefers gradual progress."
          : number % 4 === 1
            ? "Enjoys walking; new to structured resistance training."
            : number % 4 === 2
              ? "Some previous gym experience; consistency varies."
              : "Regular recreational activity; wants a sustainable routine.",
    };
  });
  let clients = demoClients;
  const initialCoaches = [
    { id: "coach-a", name: "Coach A" },
    { id: "coach-b", name: "Coach B" },
  ];
  let state = {
    mode: "gym",
    coachId: "coach-a",
    clientId: clients[0].id,
    coaches: initialCoaches,
    workouts: [],
    macros: { calories: 2000, protein: 130, carbs: 220, fat: 65 },
    plans: {},
    foods: demoFoods,
    exercises: [],
    openExercises: [],
    openExerciseStatus: "loading",
    needsExerciseModeMigration: false,
    selectedExercise: "",
    activeWorkoutDay: 1,
    backend: null,
    demoMode: true,
    session: null,
  };
  let activeAiKey = "";
  let toastTimer;

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[char]);
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
  }

  function readStoredSettings() {
    try {
      const settings = JSON.parse(localStorage.getItem(storageKeys.settings) || "{}");
      $("#supabase-url").value = settings.url || defaultSupabaseUrl;
      $("#supabase-key").value = settings.anonKey || "";
      return settings;
    } catch (error) {
      showToast("Saved settings could not be read. You can reconnect in Settings.");
      return {};
    }
  }

  function currentClient() {
    return clients.find((client) => client.id === state.clientId) || clients[0];
  }

  function toText(value, fallback = "") {
    if (Array.isArray(value)) return value.filter(Boolean).join(", ");
    return value == null ? fallback : String(value);
  }

  function clientAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    const birthDate = new Date(`${dateOfBirth}T00:00:00Z`);
    if (Number.isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
    if (
      today.getUTCMonth() < birthDate.getUTCMonth() ||
      (today.getUTCMonth() === birthDate.getUTCMonth() && today.getUTCDate() < birthDate.getUTCDate())
    ) {
      age -= 1;
    }
    return age >= 0 ? age : null;
  }

  function mapOnboardingClient(row) {
    const healthNotes = [
      toText(row.medical_conditions),
      toText(row.endocrine_conditions),
      row.medications ? `Medications: ${row.medications}` : "",
      row.body_and_health_concerns || "",
    ].filter(Boolean);
    const trainingHistory = [
      row.training_experience ? `Experience: ${row.training_experience}` : "",
      row.past_programs_tried ? `Past programs: ${row.past_programs_tried}` : "",
      row.what_worked_well ? `Worked well: ${row.what_worked_well}` : "",
      row.what_did_not_work ? `Did not work: ${row.what_did_not_work}` : "",
      row.past_roadblocks ? `Roadblocks: ${row.past_roadblocks}` : "",
    ].filter(Boolean);
    const goals = [
      toText(row.long_term_goals),
      row.priority_focus ? `Priority: ${row.priority_focus}` : "",
    ].filter(Boolean);
    return {
      id: row.id,
      displayId: row.client_id || row.id,
      name: row.full_name,
      age: clientAge(row.date_of_birth),
      sex: "Not recorded",
      heightCm: row.height_cm,
      weightKg: row.weight_kg,
      goal: goals.join(" · ") || "Goal not recorded",
      activity: Number.isInteger(row.training_days_per_week)
        ? `${row.training_days_per_week} training days/week`
        : "Activity not recorded",
      constraints: healthNotes.join(" · ") || "No health details recorded; confirm current conditions and needs with the client.",
      history: trainingHistory.join(" · ") || "No training history recorded; ask the client about experience and preferences.",
      profile: row,
    };
  }

  function coachDisplayName(name) {
    if (/^(coach\s*a|thulshi)$/i.test(name.trim())) return "Coach A";
    if (/^(coach\s*b|pratiksha)$/i.test(name.trim())) return "Coach B";
    return name;
  }

  function inferExerciseMode(exercise) {
    const declaredMode = String(exercise.mode || exercise.training_mode || "").toLowerCase();
    if (declaredMode.includes("body")) return "bodyweight";
    if (declaredMode.includes("gym")) return "gym";

    const bodyweightNames = new Set(modes.bodyweight.map((item) => item.name.toLowerCase()));
    if (bodyweightNames.has(String(exercise.name || "").toLowerCase())) return "bodyweight";

    const equipment = String(exercise.equipment || "").toLowerCase();
    if (/\b(dumbbell|barbell|cable|machine|smith|kettlebell|gym)\b/.test(equipment)) return "gym";
    if (!equipment || /\b(body ?weight|none|mat|wall|chair|box|step|no equipment)\b/.test(equipment)) {
      return "bodyweight";
    }
    return "gym";
  }

  function mapAssignedPlan(row) {
    const routine = Array.isArray(row.workout_routine)
      ? row.workout_routine
      : Array.isArray(row.workout_routine?.workouts)
        ? row.workout_routine.workouts
        : [];
    const mode = String(row.training_mode || "").toLowerCase().includes("body")
      ? "bodyweight"
      : "gym";
    return normalizedPlan({
      macros: {
        calories: row.target_calories,
        protein: row.target_protein_g,
        carbs: row.target_carbs_g,
        fat: row.target_fat_g,
      },
      workouts: routine,
      mode,
      status: row.plan_status,
      updated_at: row.updated_at,
      coachId: row.coach_id,
      clientId: row.client_id,
      serverId: row.id,
      ai_evaluation: row.ai_evaluation,
      ai_score: row.ai_score,
      coach_notes: row.coach_notes,
    });
  }

  function planKey(coachId, clientId) {
    return `${coachId}::${clientId}`;
  }

  function existingPlan(coachId = state.coachId, clientId = state.clientId) {
    return state.plans[planKey(coachId, clientId)] || null;
  }

  function normalizedPlan(plan) {
    const macros = plan?.macros || {};
    const macroValue = (value, fallback) => {
      if (value === undefined || value === null || value === "") return fallback;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };
    const rawStatus = String(plan?.status || "").toLowerCase();
    return {
      macros: {
        calories: macroValue(macros.calories, 2000),
        protein: macroValue(macros.protein, 130),
        carbs: macroValue(macros.carbs, 220),
        fat: macroValue(macros.fat, 65),
      },
      workouts: Array.isArray(plan?.workouts)
        ? plan.workouts.map((item) => ({
            id: item.id || item.source_exercise_id || item.exercise_id || crypto.randomUUID(),
            name: item.name || item.exercise_name || "Exercise",
            category: item.category || "Training",
            equipment: item.equipment || "",
            mode: item.mode === "bodyweight" || item.training_mode === "Bodyweight" || item.training_mode === "bodyweight" || plan?.mode === "bodyweight" ? "bodyweight" : "gym",
            day: Math.min(7, Math.max(1, Number(item.day) || 1)),
            sets: Number(item.sets ?? 3),
            reps: String(item.reps ?? "8–10"),
            rir: Number(item.rir ?? item.reps_in_reserve ?? 2),
            restSeconds: Number(item.restSeconds ?? item.rest_seconds ?? 90),
            tempo: String(item.tempo ?? "2-1-2"),
            coachingCues: String(item.coachingCues ?? item.coaching_cues ?? ""),
            primaryMuscle: String(item.primaryMuscle ?? item.primary_muscle ?? ""),
            contraindications: item.contraindications || [],
            imageUrl: String(item.imageUrl ?? item.image_url ?? ""),
            imageCredit: String(item.imageCredit ?? ""),
            sourceUrl: String(item.sourceUrl ?? item.source_url ?? ""),
            licenseName: String(item.licenseName ?? item.license_name ?? ""),
            licenseUrl: String(item.licenseUrl ?? item.license_url ?? ""),
            imageLicenseName: String(item.imageLicenseName ?? item.image_license_name ?? ""),
            imageLicenseUrl: String(item.imageLicenseUrl ?? item.image_license_url ?? ""),
            source: String(item.source ?? ""),
          }))
        : [],
      mode: plan?.mode === "bodyweight" ? "bodyweight" : "gym",
      status: /complete|done/i.test(rawStatus) ? "completed" : rawStatus && rawStatus !== "not started" ? "draft" : "empty",
      updatedAt: plan?.updatedAt || plan?.updated_at || null,
      coachId: plan?.coachId || null,
      clientId: plan?.clientId || null,
      serverId: plan?.serverId || null,
      aiEvaluation: plan?.aiEvaluation || plan?.ai_evaluation || null,
      aiScore: plan?.aiScore ?? plan?.ai_score ?? null,
      coachNotes: plan?.coachNotes || plan?.coach_notes || null,
    };
  }

  function loadPlanIntoEditor(plan) {
    const next = normalizedPlan(plan);
    state.workouts = next.workouts;
    state.activeWorkoutDay = Number(next.workouts[0]?.day) || 1;
    state.macros = next.macros;
    state.mode = next.mode;
    $("#macro-calories").value = state.macros.calories;
    $("#macro-protein").value = state.macros.protein;
    $("#macro-carbs").value = state.macros.carbs;
    $("#macro-fat").value = state.macros.fat;
    $$(".mode-button").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mode === state.mode);
    });
    updateExerciseOptions();
    renderWorkoutList();
    renderPlanStatus(next.status);
    if (next.aiEvaluation) {
      renderReview({ ...next.aiEvaluation, score: next.aiScore ?? next.aiEvaluation.score });
    } else {
      renderEmptyReview();
    }
  }

  function $$(selector) {
    return [...document.querySelectorAll(selector)];
  }

  function setSaveMessage(message, isError = false) {
    const element = $("#save-message");
    element.textContent = message;
    element.classList.toggle("is-error", isError);
  }

  function renderPlanStatus(status) {
    const badge = $("#plan-status");
    const labels = {
      empty: "NOT STARTED",
      unsaved: "UNSAVED CHANGES",
      draft: "DRAFT SAVED",
      completed: "PLAN COMPLETE",
    };
    badge.textContent = labels[status] || labels.empty;
    badge.disabled = status === "empty" || status === "unsaved";
    badge.className = `status-badge status-${status === "empty" ? "empty" : status === "completed" ? "complete" : "draft"}`;
    badge.setAttribute(
      "aria-label",
      status === "completed"
        ? "Plan completion status: complete. Activate to move this plan back to draft."
        : status === "draft"
          ? "Plan completion status: draft. Activate to mark this plan complete."
          : status === "unsaved"
            ? "This plan has unsaved changes."
            : "Plan completion status: not started."
    );
  }

  function renderClientOptions() {
    const select = $("#client-select");
    const fragment = document.createDocumentFragment();
    clients.forEach((client) => {
      const option = document.createElement("option");
      option.value = client.id;
      option.textContent = `${client.name} · ${client.goal}`;
      fragment.append(option);
    });
    select.replaceChildren(fragment);
    select.value = state.clientId;
  }

  function renderCoachOptions() {
    const select = $("#coach-select");
    const fragment = document.createDocumentFragment();
    state.coaches.forEach((coach) => {
      const option = document.createElement("option");
      option.value = coach.id;
      option.textContent = coach.name;
      fragment.append(option);
    });
    select.replaceChildren(fragment);
    if (!state.coaches.some((coach) => coach.id === state.coachId)) {
      state.coachId = state.coaches[0]?.id || "coach-a";
    }
    select.value = state.coachId;
  }

  function profileValue(value) {
    if (Array.isArray(value)) return value.filter((item) => item != null && item !== "").join(", ");
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return value == null ? "" : String(value).trim();
  }

  function renderProfileSection(title, entries, fallback) {
    const populatedEntries = entries
      .map(([label, value]) => [label, profileValue(value)])
      .filter(([, value]) => value);
    if (!populatedEntries.length && !fallback) return "";
    const details = populatedEntries.length
      ? `<dl class="profile-detail-list">${populatedEntries.map(([label, value]) => `
          <div class="profile-detail-item">
            <dt>${escapeHtml(label)}</dt>
            <dd>${escapeHtml(value)}</dd>
          </div>`).join("")}</dl>`
      : `<p class="profile-empty">${escapeHtml(fallback)}</p>`;
    return `
      <section class="profile-section">
        <h4>${escapeHtml(title)}</h4>
        ${details}
      </section>`;
  }

  function renderClientProfile() {
    const client = currentClient();
    const initials = client.name
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    const profile = client.profile || {};
    const clientId = client.displayId || client.id;
    const facts = [
      ["Age", client.age == null ? "Not recorded" : `${client.age} years`],
      ["Sex", client.sex || "Not recorded"],
      ["Height", client.heightCm == null ? "Not recorded" : `${client.heightCm} cm`],
      ["Weight", client.weightKg == null ? "Not recorded" : `${client.weightKg} kg`],
      ["Activity", client.activity || "Not recorded"],
    ];
    const goals = renderProfileSection("Goals & motivation", [
      ["Long-term goals", profile.long_term_goals],
      ["Priority focus", profile.priority_focus],
      ["Why it matters", profile.goal_reasons],
      ["Future vision", profile.life_impact_vision],
    ], client.goal || "Goal not recorded.");
    const health = renderProfileSection("Health & wellbeing", [
      ["Medical conditions", profile.medical_conditions],
      ["Endocrine conditions", profile.endocrine_conditions],
      ["Medications", profile.medications],
      ["Health concerns", profile.body_and_health_concerns],
      ["Heavy lifting comfort", profile.heavy_lifting_rating],
      ["Stress level", profile.mental_stress_level],
      ["Daily sitting", profile.sitting_hours_per_day],
    ], client.constraints);
    const training = renderProfileSection("Training background", [
      ["Experience", profile.training_experience],
      ["Training days per week", profile.training_days_per_week],
      ["Past programs", profile.past_programs_tried],
      ["What worked well", profile.what_worked_well],
      ["What did not work", profile.what_did_not_work],
      ["Past roadblocks", profile.past_roadblocks],
      ["Stage of change", profile.stage_of_change],
    ], client.history);
    const nutrition = renderProfileSection("Nutrition & lifestyle", [
      ["Dietary preferences", profile.dietary_preferences],
      ["Meal plan type", profile.meal_plan_type],
      ["Gluten sensitive", profile.gluten_sensitive],
      ["Lactose sensitive", profile.lactose_sensitive],
      ["Nutrition habits", profile.nutrition_habit_rating],
      ["Grocery shopping", profile.grocery_shopper],
      ["Cooking", profile.cooking_responsible],
      ["Menu decisions", profile.menu_decider],
    ]);
    const readiness = renderProfileSection("Readiness & support", [
      ["Readiness", profile.readiness_rating],
      ["Willingness", profile.willingness_rating],
      ["Ability", profile.ability_rating],
      ["Social support", profile.social_support_rating],
      ["Coach expectations", profile.coach_expectations],
      ["Commitment", profile.commitment_details],
    ]);
    $("#client-profile").innerHTML = `
      <div class="client-profile-header">
        <div class="client-avatar">${escapeHtml(initials)}</div>
        <div class="client-main">
          <div class="client-name-row">
            <span class="client-name">${escapeHtml(client.name)}</span>
          </div>
          <p class="client-id"><span class="detail-label">CLIENT ID</span><code>${escapeHtml(clientId)}</code></p>
        </div>
      </div>
      <section class="profile-section profile-snapshot" aria-label="Client snapshot">
        <h4>At a glance</h4>
        <dl class="client-facts">${facts.map(([label, value]) => `
          <div class="client-fact">
            <dt>${escapeHtml(label)}</dt>
            <dd>${escapeHtml(value)}</dd>
          </div>`).join("")}</dl>
      </section>
      ${goals}
      ${health}
      ${training}
      ${nutrition}
      ${readiness}
      ${state.demoMode ? '<p class="demo-note">Fictional demo profile — not a real client record.</p>' : ""}`;
  }

  function allExercises(mode = state.mode) {
    const sharedExercises = state.exercises.length
      ? state.exercises.filter((exercise) => exercise.mode === mode)
      : modes[mode];
    const existingNames = new Set(sharedExercises.map((exercise) => exercise.name.trim().toLowerCase()));
    return [
      ...sharedExercises,
      ...state.openExercises.filter((exercise) =>
        exercise.mode === mode && !existingNames.has(exercise.name.trim().toLowerCase()),
      ),
    ];
  }

  async function loadOpenExerciseLibrary() {
    state.openExerciseStatus = "loading";
    try {
      const response = await fetch(wgerApiUrl, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Exercise library request failed (${response.status}).`);
      const data = await response.json();
      if (!Array.isArray(data.results)) throw new Error("Exercise library returned an unexpected response.");
      const mapped = data.results.flatMap((exercise) => {
        const translation = exercise.translations?.find((item) => item.language === 2);
        const name = String(translation?.name || "").trim();
        if (!name) return [];
        const equipment = (exercise.equipment || []).map((item) => item.name).filter(Boolean).join(", ");
        const muscles = exercise.muscles || [];
        const primaryMuscle = muscles.map((item) => item.name_en || item.name).filter(Boolean).join(", ");
        const category = exercise.category?.name || primaryMuscle || "Training";
        const image = (exercise.images || []).find((item) => item.is_main) || exercise.images?.[0];
        const imageUrl = image?.thumbnails?.medium || image?.thumbnails?.small || image?.image || "";
        const imageLicense = wgerLicense[image?.license];
        const exerciseLicense = exercise.license || {};
        const mode = inferExerciseMode({ name, equipment });
        return [{
          id: `wger-${exercise.id}`,
          name,
          category,
          equipment,
          primaryMuscle,
          mode,
          contraindications: [],
          description: "",
          source: "wger",
          sourceUrl: `https://wger.de/api/v2/exerciseinfo/${encodeURIComponent(exercise.id)}/`,
          imageUrl: /^https:\/\/wger\.de\//i.test(imageUrl) ? imageUrl : "",
          imageCredit: image?.license_author || "",
          imageLicenseName: imageLicense?.name || "",
          imageLicenseUrl: imageLicense?.url || "",
          licenseName: exerciseLicense.short_name || "",
          licenseUrl: /^https:\/\//i.test(exerciseLicense.url || "") ? exerciseLicense.url : "",
        }];
      });
      state.openExercises = mapped;
      state.openExerciseStatus = "ready";
    } catch (error) {
      state.openExerciseStatus = "error";
      $("#exercise-hint").textContent = `Open-source exercise library unavailable: ${error.message}. Your connected or demo exercise list is still available.`;
      $("#exercise-hint").classList.add("is-warning");
    }
    updateExerciseOptions();
  }

  function updateExerciseOptions() {
    const search = $("#exercise-search");
    const options = allExercises();
    if (!options.some((exercise) => exercise.id === state.selectedExercise)) state.selectedExercise = "";
    renderExerciseOptions(search.value);
    const libraryHint = state.demoMode
      ? `${options.length} ${state.mode === "gym" ? "gym" : "bodyweight"} movements · fictional reference library`
      : `${options.length} movements in the shared ${state.mode === "gym" ? "gym" : "bodyweight"} library`;
    const openLibraryHint = state.openExerciseStatus === "loading"
      ? " · Loading open-source exercises…"
      : state.openExerciseStatus === "ready"
        ? ` · ${state.openExercises.filter((item) => item.mode === state.mode).length} from wger`
        : "";
    const migrationHint = !state.demoMode && state.needsExerciseModeMigration
      ? " · Add training_mode to shared_exercises for precise filtering"
      : "";
    if (state.openExerciseStatus !== "error") {
      $("#exercise-hint").textContent = `${libraryHint}${openLibraryHint}${migrationHint}`;
      $("#exercise-hint").classList.toggle("is-warning", Boolean(migrationHint));
    }
  }

  function renderExerciseOptions(query = "") {
    const list = $("#exercise-options");
    const normalizedQuery = query.trim().toLowerCase();
    const matches = allExercises().filter((exercise) =>
      [exercise.name, exercise.primaryMuscle, exercise.category, exercise.equipment]
        .some((value) => String(value || "").toLowerCase().includes(normalizedQuery)),
    );
    const visibleMatches = matches.slice(0, 40);
    list.innerHTML = visibleMatches.length
      ? `${visibleMatches.map((exercise) => `
          <button class="exercise-option${exercise.id === state.selectedExercise ? " is-selected" : ""}" type="button" role="option" aria-selected="${exercise.id === state.selectedExercise}" data-exercise-id="${escapeHtml(exercise.id)}">
            ${exercise.imageUrl ? `<img class="exercise-option-image" src="${escapeHtml(exercise.imageUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : '<span class="exercise-option-image exercise-option-placeholder" aria-hidden="true">ML</span>'}
            <span class="exercise-option-content">
              <span class="exercise-option-name">${escapeHtml(exercise.name)}</span>
              <span class="exercise-option-badges">
                <span class="exercise-badge">${escapeHtml(exercise.primaryMuscle || exercise.category || "General")}</span>
                <span class="exercise-badge exercise-badge-equipment">${escapeHtml(exercise.equipment || "No equipment")}</span>
              </span>
              ${exercise.source === "wger" ? `<span class="exercise-option-credit">wger · ${escapeHtml(exercise.imageLicenseName || exercise.licenseName || "open exercise data")}</span>` : ""}
            </span>
          </button>`).join("")}
        ${matches.length > visibleMatches.length ? `<p class="exercise-options-more">Showing ${visibleMatches.length} of ${matches.length}. Refine your search to see more.</p>` : ""}`
      : '<p class="exercise-options-empty">No matching exercises.</p>';
  }

  function exerciseWarnings(item) {
    const warnings = [];
    const contraindications = Array.isArray(item.contraindications)
      ? item.contraindications
      : String(item.contraindications || "").split(/[,;|]/);
    contraindications.filter(Boolean).forEach((note) => warnings.push(`Library caution: ${toText(note)}`));

    const clientHealth = String(currentClient()?.constraints || "").toLowerCase();
    const exerciseText = `${item.name} ${item.category} ${item.coachingCues}`.toLowerCase();
    const clientHasBackConcern = /\b(back|spine|spinal|lumbar|disc|sciatica)\b/.test(clientHealth);
    const movementLoadsSpine = /\b(deadlift|romanian|good morning|bent.?over|barbell squat|loaded carry|back squat)\b/.test(exerciseText);
    if (clientHasBackConcern && movementLoadsSpine) {
      warnings.push("Review movement tolerance: the client profile notes a back or spinal concern. Confirm suitability with the client and their clinician.");
    }
    return warnings;
  }

  function renderWorkoutList() {
    const container = $("#workout-list");
    const tabs = workoutDays.map((day, dayIndex) => {
      const dayNumber = dayIndex + 1;
      const assigned = state.workouts
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => Number(item.day) === dayNumber);
      return `<button class="workout-day-tab${dayNumber === state.activeWorkoutDay ? " is-active" : ""}" type="button" role="tab" id="workout-tab-${dayNumber}" aria-controls="workout-panel" aria-selected="${dayNumber === state.activeWorkoutDay}" tabindex="${dayNumber === state.activeWorkoutDay ? "0" : "-1"}" data-day="${dayNumber}">
        <span>Day ${dayNumber}</span><small>${assigned.length}</small>
      </button>`;
    }).join("");
    const assigned = state.workouts
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => Number(item.day) === state.activeWorkoutDay);
    const exercises = assigned.length
      ? assigned.map(({ item, index }) => {
          const warnings = exerciseWarnings(item);
          const stepper = (field, label, value, min, max) => `
            <label class="mini-field">${label}
              <span class="stepper">
                <button type="button" data-step="${field}" data-delta="-1" aria-label="Decrease ${label.toLowerCase()} for ${escapeHtml(item.name)}">−</button>
                <input type="number" min="${min}" max="${max}" value="${escapeHtml(value)}" data-field="${field}" aria-label="${label} for ${escapeHtml(item.name)}" />
                <button type="button" data-step="${field}" data-delta="1" aria-label="Increase ${label.toLowerCase()} for ${escapeHtml(item.name)}">+</button>
              </span>
            </label>`;
          return `
            <article class="workout-item" data-index="${index}">
              <div class="workout-item-header">
                ${item.imageUrl ? `<img class="workout-exercise-image" src="${escapeHtml(item.imageUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : ""}
                <div class="workout-exercise">
                  <strong title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</strong>
                  <span>${escapeHtml(item.primaryMuscle || item.category)}${item.equipment ? ` · ${escapeHtml(item.equipment)}` : ""} · ${item.mode === "bodyweight" ? "Bodyweight" : "Gym"}</span>
                  ${item.source === "wger" ? `<span class="exercise-attribution"><a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">wger exercise data</a>${item.licenseName ? ` · <a href="${escapeHtml(item.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.licenseName)}</a>` : ""}${item.imageCredit ? ` · image: ${escapeHtml(item.imageCredit)}` : ""}${item.imageLicenseName && item.imageLicenseUrl ? ` · <a href="${escapeHtml(item.imageLicenseUrl)}" target="_blank" rel="noopener noreferrer">image ${escapeHtml(item.imageLicenseName)}</a>` : ""}</span>` : ""}
                </div>
                <button class="remove-exercise" type="button" data-remove="${index}" aria-label="Remove ${escapeHtml(item.name)}">×</button>
              </div>
              ${warnings.length ? `<ul class="exercise-safety" aria-label="Safety notes">${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}</ul>` : ""}
              <div class="workout-item-fields">
                ${stepper("sets", "SETS", item.sets, 1, 20)}
                <label class="mini-field">REPS<input type="text" maxlength="16" required value="${escapeHtml(item.reps)}" data-field="reps" aria-label="Reps for ${escapeHtml(item.name)}" /></label>
                ${stepper("rir", "RIR", item.rir, 0, 10)}
                <label class="mini-field">REST (SEC)<input type="number" min="0" max="900" step="15" value="${escapeHtml(item.restSeconds)}" data-field="restSeconds" aria-label="Rest time in seconds for ${escapeHtml(item.name)}" /></label>
                <label class="mini-field">TEMPO<input type="text" maxlength="16" value="${escapeHtml(item.tempo)}" data-field="tempo" aria-label="Tempo for ${escapeHtml(item.name)}" /></label>
              </div>
              <label class="mini-field coaching-cues-field">COACHING CUES<textarea rows="2" maxlength="300" data-field="coachingCues" aria-label="Coaching cues for ${escapeHtml(item.name)}">${escapeHtml(item.coachingCues)}</textarea></label>
            </article>`;
        }).join("")
      : '<p class="workout-day-empty">No exercises assigned to this day yet. Add a movement to build the session.</p>';
    container.innerHTML = `
      <div class="workout-day-tabs" role="tablist" aria-label="Workout days">${tabs}</div>
      <section class="workout-day-panel" id="workout-panel" role="tabpanel" aria-labelledby="workout-tab-${state.activeWorkoutDay}">
        <div class="workout-day-heading">
          <h4>Day ${state.activeWorkoutDay} <span>(${workoutDays[state.activeWorkoutDay - 1]})</span></h4>
          <span>${assigned.length} ${assigned.length === 1 ? "exercise" : "exercises"}</span>
        </div>
        <div class="workout-day-list">${exercises}</div>
      </section>`;
  }

  function renderFoods() {
    $("#food-count").textContent = `${state.foods.length} foods`;
    $("#food-list").innerHTML = state.foods.map((food) => `
      <div class="food-item"><strong>${escapeHtml(food.name)}</strong>
        <span>${escapeHtml(food.serving || "1 serving")} · ${escapeHtml(food.calories)} kcal · P ${escapeHtml(food.protein)}g · C ${escapeHtml(food.carbs)}g · F ${escapeHtml(food.fat)}g${food.dietTags?.length ? ` · ${escapeHtml(food.dietTags.join(", "))}` : ""}</span>
      </div>`).join("");
  }

  function updateProgress() {
    const coachPlans = Object.entries(state.plans)
      .filter(([key]) => key.startsWith(`${state.coachId}::`))
      .map(([, plan]) => plan);
    const complete = coachPlans.filter((plan) => plan.status === "completed").length;
    const total = state.demoMode ? clients.length : Math.max(clients.length, coachPlans.length);
    const percent = total ? Math.round((complete / total) * 100) : 0;
    $("#client-count").textContent = String(clients.length);
    $("#completed-count").textContent = String(complete);
    $("#remaining-count").textContent = String(Math.max(total - complete, 0));
    $("#completed-percentage").textContent = `${percent}% of roster`;
  }

  function renderAll() {
    renderCoachOptions();
    renderClientOptions();
    renderClientProfile();
    renderFoods();
    updateExerciseOptions();
    renderWorkoutList();
    updateProgress();
    $("#connection-label").textContent = state.demoMode ? "Demo workspace" : "Supabase connected";
    $("#connection-pill").classList.toggle("is-connected", !state.demoMode);
    $("#footer-data-mode").textContent = state.demoMode ? "Demo data · stored on this device" : "Connected to your Supabase project";
  }

  function readEditorPlan(status = "draft") {
    const readMacro = (id) => {
      const value = Number($(id).value);
      return Number.isFinite(value) && value >= 0 ? value : 0;
    };
    return {
      macros: {
        calories: readMacro("#macro-calories"),
        protein: readMacro("#macro-protein"),
        carbs: readMacro("#macro-carbs"),
        fat: readMacro("#macro-fat"),
      },
      workouts: state.workouts.map((item) => ({ ...item })),
      mode: state.mode,
      status,
      updatedAt: new Date().toISOString(),
      coachId: state.coachId,
      clientId: state.clientId,
      aiEvaluation: existingPlan()?.aiEvaluation || null,
      aiScore: existingPlan()?.aiScore ?? null,
      coachNotes: existingPlan()?.coachNotes || null,
    };
  }

  function saveDemoPlans() {
    try {
      localStorage.setItem(storageKeys.demoPlans, JSON.stringify(state.plans));
    } catch (error) {
      throw new Error("Could not save this plan in browser storage. Check available storage space and privacy settings.");
    }
  }

  function restHeaders(extra = {}) {
    if (!state.backend?.url || !state.backend?.anonKey) {
      throw new Error("Add your Supabase project URL and public anon key in Settings.");
    }
    const token = state.session?.access_token || state.backend.anonKey;
    return {
      apikey: state.backend.anonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...extra,
    };
  }

  async function restRequest(path, options = {}) {
    const response = await fetch(`${state.backend.url}/rest/v1/${path}`, {
      ...options,
      headers: restHeaders(options.headers || {}),
    });
    const responseText = await response.text();
    let responseBody;
    try {
      responseBody = responseText ? JSON.parse(responseText) : null;
    } catch {
      responseBody = responseText;
    }
    if (!response.ok) {
      const message = responseBody?.message || responseBody?.msg || responseBody?.error_description || `Supabase request failed (${response.status}).`;
      throw new Error(message);
    }
    return responseBody;
  }

  async function loadSupabaseReferenceData() {
    const [coachRows, clientRows, foodRows, planRows] = await Promise.all([
      restRequest("coaches?select=id,full_name,email,specialization,avatar_url&order=full_name.asc"),
      restRequest("client_onboarding?select=id,client_id,created_at,full_name,email,date_of_birth,height_cm,weight_kg,sitting_hours_per_day,heavy_lifting_rating,mental_stress_level,medical_conditions,endocrine_conditions,medications,past_programs_tried,what_worked_well,what_did_not_work,nutrition_habit_rating,long_term_goals,goal_reasons,priority_focus,life_impact_vision,past_roadblocks,commitment_details,body_and_health_concerns,coach_expectations,stage_of_change,readiness_rating,willingness_rating,ability_rating,social_support_rating,training_days_per_week,training_experience,dietary_preferences,meal_plan_type,gluten_sensitive,lactose_sensitive,grocery_shopper,cooking_responsible,menu_decider&order=full_name.asc"),
      restRequest("shared_food_database?select=id,food_name,serving_unit,calories,protein_g,carbs_g,fat_g,diet_tags&order=food_name.asc"),
      restRequest("coach_assigned_plans?select=id,created_at,updated_at,client_id,coach_id,plan_status,training_mode,target_calories,target_protein_g,target_carbs_g,target_fat_g,workout_routine,ai_evaluation,ai_score,coach_notes"),
    ]);
    let exerciseRows;
    try {
      exerciseRows = await restRequest("shared_exercises?select=id,name,category,primary_muscle,equipment,contraindications,coaching_cues,training_mode&order=name.asc");
      state.needsExerciseModeMigration = exerciseRows.some((exercise) => !exercise.training_mode);
    } catch (error) {
      if (!/training_mode.*(does not exist|not found|schema cache)|column .*training_mode/i.test(error.message)) {
        throw error;
      }
      exerciseRows = await restRequest("shared_exercises?select=id,name,category,primary_muscle,equipment,contraindications,coaching_cues&order=name.asc");
      state.needsExerciseModeMigration = true;
    }
    if (!coachRows.length) {
      throw new Error("No coach profiles are visible to this Supabase account. Check the coaches table and its SELECT access policy.");
    }
    state.coaches = coachRows.map((coach) => ({
      id: coach.id,
      name: coachDisplayName(coach.full_name),
      email: coach.email,
      specialization: coach.specialization || "",
      avatarUrl: coach.avatar_url || "",
    }));
    clients = clientRows.map(mapOnboardingClient);
    if (!clients.length) {
      throw new Error("Sign-in succeeded, but no client profiles are visible. Check that client_onboarding has rows and that this account has SELECT access under its RLS policies. Do not run schema.sql on your existing database.");
    }
    if (!clients.some((client) => client.id === state.clientId)) {
      state.clientId = clients[0].id;
    }
    state.foods = foodRows.map((food) => ({
      id: food.id, name: food.food_name, serving: food.serving_unit || "Serving not specified",
      calories: food.calories, protein: food.protein_g, carbs: food.carbs_g, fat: food.fat_g,
      dietTags: food.diet_tags || [],
    }));
    state.exercises = exerciseRows.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      mode: inferExerciseMode(exercise),
      category: exercise.category,
      equipment: exercise.equipment || "",
      primaryMuscle: exercise.primary_muscle || "",
      contraindications: exercise.contraindications || [],
      description: exercise.coaching_cues || "",
    }));
    state.plans = {};
    planRows.forEach((row) => {
      state.plans[planKey(row.coach_id, row.client_id)] = mapAssignedPlan(row);
    });
    renderAll();
    loadPlanIntoEditor(existingPlan() || { status: "empty", mode: "gym" });
    $("#client-select").value = state.clientId;
  }

  async function saveSupabasePlan(plan) {
    const existing = existingPlan();
    const body = {
      coach_id: state.coachId,
      client_id: state.clientId,
      plan_status: plan.status,
      training_mode: plan.mode === "bodyweight" ? "bodyweight" : "gym",
      target_calories: plan.macros.calories,
      target_protein_g: plan.macros.protein,
      target_carbs_g: plan.macros.carbs,
      target_fat_g: plan.macros.fat,
      workout_routine: plan.workouts.map((item) => ({
        ...(item.source === "wger" ? {} : { exercise_id: item.id }),
        source_exercise_id: item.id,
        name: item.name,
        category: item.category,
        equipment: item.equipment,
        source: item.source || "shared_exercises",
        source_url: item.sourceUrl || "",
        image_url: item.imageUrl || "",
        image_credit: item.imageCredit || "",
        license_name: item.licenseName || "",
        license_url: item.licenseUrl || "",
        image_license_name: item.imageLicenseName || "",
        image_license_url: item.imageLicenseUrl || "",
        training_mode: item.mode === "bodyweight" ? "bodyweight" : "gym",
        primary_muscle: item.primaryMuscle,
        contraindications: item.contraindications,
        day: item.day,
        sets: item.sets,
        reps: item.reps,
        rir: item.rir,
        rest_seconds: item.restSeconds,
        tempo: item.tempo,
        coaching_cues: item.coachingCues,
      })),
      updated_at: plan.updatedAt,
    };
    if (plan.aiEvaluation) body.ai_evaluation = plan.aiEvaluation;
    if (plan.aiScore != null) body.ai_score = plan.aiScore;
    const query = existing?.serverId
      ? `coach_assigned_plans?id=eq.${encodeURIComponent(existing.serverId)}`
      : "coach_assigned_plans";
    const response = await restRequest(query, {
      method: existing?.serverId ? "PATCH" : "POST",
      headers: {
        Prefer: existing?.serverId ? "return=representation" : "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(body),
    });
    return response?.[0]?.id || existing?.serverId || null;
  }

  async function savePlan(status = "completed") {
    const invalidField = $(".macro-grid input:invalid, #workout-list :invalid");
    if (invalidField) {
      invalidField.reportValidity();
      setSaveMessage("Check the highlighted targets and workout details.", true);
      return;
    }
    const plan = readEditorPlan(status);
    try {
      if (!plan.macros.calories || !plan.macros.protein) {
        setSaveMessage("Add calorie and protein targets first.", true);
        return;
      }
      if (state.demoMode) {
        state.plans[planKey(state.coachId, state.clientId)] = plan;
        saveDemoPlans();
      } else {
        const serverId = await saveSupabasePlan(plan);
        plan.serverId = serverId;
        state.plans[planKey(state.coachId, state.clientId)] = plan;
      }
      renderPlanStatus(plan.status);
      updateProgress();
      setSaveMessage(plan.status === "completed" ? "Plan saved and marked complete." : "Draft saved just now.");
    } catch (error) {
      setSaveMessage(error.message, true);
    }
  }

  function addExercise() {
    const exercise = allExercises().find((item) => item.id === state.selectedExercise);
    if (!exercise) {
      $("#exercise-hint").textContent = "Choose an exercise from the list first.";
      $("#exercise-hint").classList.add("is-warning");
      $("#exercise-search").focus();
      return;
    }
    if (state.workouts.some((item) => item.id === exercise.id)) {
      $("#exercise-hint").textContent = "That movement is already in this plan.";
      $("#exercise-hint").classList.add("is-warning");
      return;
    }
    state.workouts.push({
      id: exercise.id,
      name: exercise.name,
      category: exercise.category,
      equipment: exercise.equipment || "",
      primaryMuscle: exercise.primaryMuscle || "",
      contraindications: exercise.contraindications || [],
      source: exercise.source || "",
      sourceUrl: exercise.sourceUrl || "",
      imageUrl: exercise.imageUrl || "",
      imageCredit: exercise.imageCredit || "",
      licenseName: exercise.licenseName || "",
      licenseUrl: exercise.licenseUrl || "",
      imageLicenseName: exercise.imageLicenseName || "",
      imageLicenseUrl: exercise.imageLicenseUrl || "",
      mode: state.mode,
      day: state.activeWorkoutDay,
      sets: 3,
      reps: "8–10",
      rir: 2,
      restSeconds: 90,
      tempo: "2-1-2",
      coachingCues: exercise.description || "",
    });
    renderWorkoutList();
    renderPlanStatus("unsaved");
    setSaveMessage("");
  }

  async function togglePlanComplete() {
    const current = existingPlan();
    if (!current) {
      showToast("Save a plan before marking it complete.");
      return;
    }
    const next = normalizedPlan({
      ...current,
      status: current.status === "completed" ? "draft" : "completed",
      updatedAt: new Date().toISOString(),
    });
    try {
      if (state.demoMode) {
        state.plans[planKey(state.coachId, state.clientId)] = next;
        saveDemoPlans();
      } else {
        const result = await restRequest(`coach_assigned_plans?id=eq.${encodeURIComponent(current.serverId)}`, {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({
            plan_status: next.status,
            updated_at: next.updatedAt,
          }),
        });
        if (!result?.length) throw new Error("Supabase did not update this plan. Check your coach access and RLS policies.");
        state.plans[planKey(state.coachId, state.clientId)] = { ...next, serverId: current.serverId };
      }
      renderPlanStatus(next.status);
      updateProgress();
      showToast(next.status === "completed" ? "Plan marked complete for this coach." : "Plan moved back to draft.");
    } catch (error) {
      showToast(error.message);
    }
  }

  function renderReview(result) {
    const risks = Array.isArray(result.biomechanicalRisks) ? result.biomechanicalRisks : [];
    const justifications = Array.isArray(result.physiologicalJustifications) ? result.physiologicalJustifications : [];
    const riskHtml = risks.length
      ? risks.map((risk) => `<li class="risk-item"><strong>${escapeHtml(risk.risk)}</strong><span>Alternative: ${escapeHtml(risk.alternative)}${risk.reason ? ` · ${escapeHtml(risk.reason)}` : ""}</span></li>`).join("")
      : "<li>No specific biomechanical risks identified from the information provided.</li>";
    const justificationHtml = justifications.length
      ? justifications.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
      : "<li>Discuss progression and recovery with the client before implementation.</li>";
    $("#ai-output").innerHTML = `
      <div class="review-result">
        <section class="verdict-card">
          <div class="verdict-top"><span class="verdict-label">OVERALL VERDICT</span><span class="score-pill">SCORE ${escapeHtml(result.score)}/100</span></div>
          <p class="verdict-text">${escapeHtml(result.overallVerdict)}</p>
        </section>
        <section class="review-card"><h3>MACRO CRITIQUE</h3><p>${escapeHtml(result.macroCritique)}</p></section>
        <section class="review-card"><h3>MOVEMENT &amp; BIOMECHANICAL CONSIDERATIONS</h3><ul>${riskHtml}</ul></section>
        <section class="review-card"><h3>PHYSIOLOGICAL RATIONALE</h3><ul>${justificationHtml}</ul></section>
        <p class="review-disclaimer">AI-generated educational feedback only. Verify context and clinical advice with the client and their qualified care team.</p>
      </div>`;
  }

  function renderEmptyReview() {
    $("#ai-output").innerHTML = `
      <div class="empty-state">
        <div class="empty-orbit" aria-hidden="true">
          <span>✳</span><i class="orbit-dot orbit-dot-one"></i>
          <i class="orbit-dot orbit-dot-two"></i><i class="orbit-dot orbit-dot-three"></i>
        </div>
        <h3>Good plans invite good questions.</h3>
        <p>Save your plan, then ask for a reasoned review. The final call always stays with you.</p>
      </div>`;
  }

  async function saveAiEvaluation(result) {
    const plan = existingPlan();
    if (!plan) throw new Error("Save the plan before saving its AI review.");
    const updated = {
      ...plan,
      aiEvaluation: result,
      aiScore: result.score,
      updatedAt: new Date().toISOString(),
    };
    if (state.demoMode) {
      state.plans[planKey(state.coachId, state.clientId)] = updated;
      saveDemoPlans();
      return;
    }
    if (!plan.serverId) throw new Error("The saved Supabase plan ID is missing.");
    const rows = await restRequest(`coach_assigned_plans?id=eq.${encodeURIComponent(plan.serverId)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        ai_evaluation: result,
        ai_score: result.score,
        updated_at: updated.updatedAt,
      }),
    });
    if (!rows?.length) throw new Error("Supabase did not save the AI review. Check plan update access.");
    state.plans[planKey(state.coachId, state.clientId)] = updated;
  }

  const responseSchema = {
    type: "object",
    properties: {
      overallVerdict: { type: "string", description: "A brief, balanced overall assessment of the proposed plan." },
      score: { type: "integer", minimum: 0, maximum: 100, description: "A non-clinical plan coherence score from 0 to 100." },
      macroCritique: { type: "string", description: "Educational critique of the proposed nutrition targets, with appropriate uncertainty." },
      biomechanicalRisks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            risk: { type: "string" },
            alternative: { type: "string" },
            reason: { type: "string" },
          },
          required: ["risk", "alternative", "reason"],
        },
      },
      physiologicalJustifications: { type: "array", items: { type: "string" } },
    },
    required: ["overallVerdict", "score", "macroCritique", "biomechanicalRisks", "physiologicalJustifications"],
  };

  function reviewPrompt() {
    const client = currentClient();
    const plan = readEditorPlan(existingPlan()?.status || "draft");
    const source = client.profile || {};
    const reviewFields = [
      "medical_conditions", "endocrine_conditions", "medications", "body_and_health_concerns",
      "training_experience", "past_programs_tried", "what_worked_well", "what_did_not_work",
      "past_roadblocks", "training_days_per_week", "dietary_preferences", "meal_plan_type",
      "gluten_sensitive", "lactose_sensitive", "nutrition_habit_rating", "heavy_lifting_rating",
    ];
    const onboardingDetails = Object.fromEntries(
      reviewFields
        .filter((key) => source[key] != null && source[key] !== "")
        .map((key) => [key, source[key]])
    );
    const profile = {
      age: client.age, sex: client.sex,
      heightCm: client.heightCm, weightKg: client.weightKg, goal: client.goal,
      activityLevel: client.activity, medicalConstraints: client.constraints,
      trainingHistory: client.history,
      onboardingDetails,
    };
    const instructions = [
      "Act as an evidence-informed exercise physiologist, nutrition coach, and biomechanist.",
      "Review the supplied client profile and proposed training and nutrition plan together.",
      "Return concise, practical, non-diagnostic educational feedback matching the required JSON schema.",
      "Prioritize safety, client preferences, gradual progression, sufficient recovery, and uncertainty.",
      "Never diagnose, promise results, prescribe treatment, or override a clinician. Medical constraints require individual assessment and appropriate licensed clinical guidance.",
      "Do not infer missing health information. If the client profile is incomplete, say so and recommend questions for the coach.",
      "Critique nutrition targets cautiously; do not make unsupported claims about energy needs or recommend aggressive restriction.",
      "Score plan coherence and completeness, not the client's body or worth.",
      "Offer lower-risk, symptom-guided movement alternatives when appropriate, and explicitly say when the profile is insufficient to identify a specific risk.",
    ].join(" ");
    const reviewData = {
      clientProfile: profile,
      proposedPlan: {
        mode: plan.mode,
        dailyNutritionTargets: plan.macros,
        workouts: plan.workouts.map(({ name, category, equipment, primaryMuscle, mode, day, sets, reps, rir, restSeconds, tempo, coachingCues, contraindications }) => ({
          name, category, equipment, primaryMuscle, mode, day, dayName: workoutDays[day - 1], sets, reps, repsInReserve: rir, restSeconds, tempo, coachingCues, contraindications,
        })),
      },
    };
    return `${instructions}\n\nReturn only a JSON object matching this JSON schema:\n${JSON.stringify(responseSchema)}\n\nReview data:\n${JSON.stringify(reviewData)}`;
  }

  function configureAiProvider() {
    const provider = $("#ai-provider").value;
    const defaults = {
      gemini: {
        model: "gemini-flash-lite-latest",
        help: "Uses Gemini's Interactions API without storing the interaction. Your key stays in page memory only.",
      },
      openai: {
        model: "gpt-4o-mini",
        help: "Uses OpenAI Chat Completions with JSON output. Your key stays in page memory only.",
      },
      anthropic: {
        model: "claude-haiku-4-5",
        help: "Uses Anthropic Messages API. Direct browser use may be limited by your account and browser network policy.",
      },
      "openai-compatible": {
        model: "",
        help: "Uses a custom OpenAI-compatible Chat Completions endpoint. Enter the complete HTTPS endpoint URL.",
      },
    };
    const configuration = defaults[provider];
    if (!configuration) return;
    $("#ai-model").value = configuration.model;
    $("#ai-key-label").textContent = `${provider === "openai-compatible" ? "PROVIDER" : provider.toUpperCase()} API KEY`;
    $("#ai-endpoint-group").hidden = provider !== "openai-compatible";
    $("#ai-endpoint").required = provider === "openai-compatible";
    $("#ai-provider-help").textContent = configuration.help;
  }

  function interactionOutputText(data) {
    if (typeof data?.output_text === "string") return data.output_text.trim();
    const textParts = [];
    const collect = (value) => {
      if (Array.isArray(value)) {
        value.forEach(collect);
        return;
      }
      if (!value || typeof value !== "object") return;
      if (typeof value.text === "string") textParts.push(value.text);
      if (typeof value.output_text === "string") textParts.push(value.output_text);
      if (typeof value.content === "string") textParts.push(value.content);
      ["steps", "output", "content", "parts"].forEach((key) => {
        if (value[key] && typeof value[key] !== "string") collect(value[key]);
      });
    };
    collect(data?.steps);
    if (!textParts.length) collect(data?.output);
    if (!textParts.length && data?.candidates?.[0]?.content?.parts) {
      collect(data.candidates[0].content.parts);
    }
    return textParts.join("").trim();
  }

  function parseReviewJson(text, provider) {
    if (!text) throw new Error(`${provider} returned an empty response.`);
    try {
      const parsed = JSON.parse(text);
      if (
        typeof parsed.overallVerdict !== "string" ||
        typeof parsed.score !== "number" ||
        typeof parsed.macroCritique !== "string" ||
        !Array.isArray(parsed.biomechanicalRisks) ||
        !Array.isArray(parsed.physiologicalJustifications)
      ) {
        throw new Error("The response did not match the review schema.");
      }
      return parsed;
    } catch (error) {
      if (error instanceof SyntaxError) throw new Error(`${provider} returned invalid JSON. Please try the review again.`);
      throw error;
    }
  }

  function reviewResponseText(data, provider) {
    if (provider === "gemini") {
      const text = interactionOutputText(data);
      if (!text) {
        const reason = data?.promptFeedback?.blockReason || data?.status;
        if (data?.status === "completed") {
          throw new Error("Gemini completed the request but returned no readable text output. Please retry and confirm the model supports structured responses.");
        }
        throw new Error(reason ? `Gemini could not complete this review (${reason}).` : "Gemini returned an empty response.");
      }
      return text;
    }
    if (provider === "openai" || provider === "openai-compatible") {
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content === "string") return content.trim();
      if (Array.isArray(content)) return content.map((part) => part.text || "").join("").trim();
      throw new Error("The OpenAI-compatible provider returned no message content.");
    }
    const anthropicContent = data?.content;
    if (Array.isArray(anthropicContent)) {
      return anthropicContent.filter((part) => part.type === "text").map((part) => part.text || "").join("").trim();
    }
    throw new Error("Anthropic returned no text content.");
  }

  async function requestAiReview({ provider, apiKey, model, endpoint }) {
    const providerNames = {
      gemini: "Gemini",
      openai: "OpenAI",
      anthropic: "Anthropic",
      "openai-compatible": "OpenAI-compatible provider",
    };
    const providerName = providerNames[provider];
    if (!providerName) throw new Error("Select a supported AI provider.");
    let url;
    let headers = { "Content-Type": "application/json" };
    let body;
    if (provider === "gemini") {
      url = "https://generativelanguage.googleapis.com/v1beta/interactions";
      headers["x-goog-api-key"] = apiKey;
      body = {
        model,
        input: reviewPrompt(),
        store: false,
        generation_config: { thinking_level: "low", max_output_tokens: 1200 },
        response_format: { type: "text", mime_type: "application/json", schema: responseSchema },
      };
    } else if (provider === "openai" || provider === "openai-compatible") {
      url = provider === "openai" ? "https://api.openai.com/v1/chat/completions" : endpoint;
      headers.Authorization = `Bearer ${apiKey}`;
      body = {
        model,
        messages: [{ role: "user", content: reviewPrompt() }],
        response_format: { type: "json_object" },
        max_tokens: 1200,
      };
    } else {
      url = "https://api.anthropic.com/v1/messages";
      headers["x-api-key"] = apiKey;
      headers["anthropic-version"] = "2023-06-01";
      headers["anthropic-dangerous-direct-browser-access"] = "true";
      body = {
        model,
        max_tokens: 1200,
        system: "Return only a JSON object matching the requested review schema. Do not wrap it in markdown.",
        messages: [{ role: "user", content: reviewPrompt() }],
      };
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);
    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(`${providerName} review timed out after 120 seconds. Check your connection, provider access and model, then try again.`);
      }
      if (error instanceof TypeError) {
        throw new Error(`Could not reach ${providerName}. Check the endpoint, internet connection and browser CORS support. A backend proxy may be required.`);
      }
      throw new Error(`Could not reach ${providerName}: ${error.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(`${providerName} returned an unreadable response (HTTP ${response.status}).`);
    }
    if (!response.ok) {
      const detail = data?.error?.message || data?.message || `Request failed (HTTP ${response.status}).`;
      throw new Error(detail);
    }
    return parseReviewJson(reviewResponseText(data, provider), providerName);
  }

  async function onReviewSubmit(event) {
    event.preventDefault();
    const provider = $("#ai-provider").value;
    const apiKey = $("#ai-api-key").value.trim();
    const model = $("#ai-model").value.trim();
    const endpoint = $("#ai-endpoint").value.trim();
    $("#gemini-error").classList.remove("is-visible");
    if (!apiKey || !model || (provider === "openai-compatible" && !endpoint)) {
      $("#gemini-error").textContent = provider === "openai-compatible" && !endpoint
        ? "Enter the custom provider's OpenAI-compatible chat completions URL."
        : "Enter an API key and model name.";
      $("#gemini-error").classList.add("is-visible");
      return;
    }
    if (provider === "openai-compatible" && !/^https:\/\/[^/]+\/.+/i.test(endpoint)) {
      $("#gemini-error").textContent = "Enter a valid HTTPS chat completions URL.";
      $("#gemini-error").classList.add("is-visible");
      return;
    }
    if (!state.workouts.length) {
      $("#gemini-error").textContent = "Add at least one movement before requesting a review.";
      $("#gemini-error").classList.add("is-visible");
      return;
    }
    if (!existingPlan()) await savePlan("draft");
    if (!existingPlan()) {
      $("#gemini-error").textContent = $("#save-message").textContent || "Save this plan before requesting a review.";
      $("#gemini-error").classList.add("is-visible");
      return;
    }
    activeAiKey = apiKey;
    $("#gemini-dialog").close();
    const button = $("#review-plan");
    button.disabled = true;
    $("#ai-output").innerHTML = '<div class="review-loading"><span class="spinner"></span><span>Reviewing the plan with care…</span></div>';
    try {
      const result = await requestAiReview({ provider, apiKey: activeAiKey, model, endpoint });
      renderReview(result);
      try {
        await saveAiEvaluation(result);
      } catch (error) {
        $("#ai-output .review-result").insertAdjacentHTML(
          "beforeend",
          `<p class="review-disclaimer">Review generated but not saved to the plan: ${escapeHtml(error.message)}</p>`
        );
      }
      $("#ai-api-key").value = "";
      activeAiKey = "";
    } catch (error) {
      $("#ai-output").innerHTML = `<div class="review-error">${escapeHtml(error.message)}<br /><br />Check the selected provider, model, API key and API access, then try again.</div>`;
      $("#ai-api-key").value = "";
      activeAiKey = "";
    } finally {
      button.disabled = false;
    }
  }

  async function signInSupabase() {
    const url = $("#supabase-url").value.trim().replace(/\/+$/, "");
    const anonKey = $("#supabase-key").value.trim();
    const email = $("#auth-email").value.trim();
    const password = $("#auth-password").value;
    const errorBox = $("#settings-error");
    errorBox.classList.remove("is-visible");
    try {
      if (!/^https:\/\/[^/]+$/.test(url)) {
        throw new Error("Enter a valid HTTPS Supabase project URL.");
      }
      if (!anonKey || !email || !password) {
        throw new Error("Enter your Supabase public key, coach email and password.");
      }
      state.backend = { url, anonKey };
      const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { apikey: anonKey, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.msg || data?.message || data?.error_description || "Supabase sign-in failed.");
      if (!data.access_token || !data.user?.id) throw new Error("Supabase sign-in returned an incomplete session.");
      state.session = data;
      state.demoMode = false;
      try {
        sessionStorage.setItem(storageKeys.session, JSON.stringify({ url, anonKey, session: data }));
        localStorage.setItem(storageKeys.settings, JSON.stringify({ url, anonKey }));
      } catch {
        state.session = data;
      }
      await loadSupabaseReferenceData();
      $("#auth-password").value = "";
      $("#settings-dialog").close();
      showToast("Connected to Supabase.");
    } catch (error) {
      state.backend = null;
      state.session = null;
      state.demoMode = true;
      state.coaches = initialCoaches;
      clients = demoClients;
      state.foods = demoFoods;
      state.exercises = [];
      try { state.plans = JSON.parse(localStorage.getItem(storageKeys.demoPlans) || "{}"); } catch { state.plans = {}; }
      renderAll();
      loadPlanIntoEditor(existingPlan() || { status: "empty" });
      errorBox.textContent = error.message;
      errorBox.classList.add("is-visible");
    }
  }

  async function tryRestoreSession() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKeys.session) || "null");
      if (!saved?.url || !saved?.anonKey || !saved?.session?.access_token) return;
      state.backend = { url: saved.url, anonKey: saved.anonKey };
      state.session = saved.session;
      state.demoMode = false;
      const response = await fetch(`${saved.url}/auth/v1/user`, {
        headers: { apikey: saved.anonKey, Authorization: `Bearer ${saved.session.access_token}` },
      });
      if (!response.ok) throw new Error("Your Supabase session expired. Sign in again in Settings.");
      await loadSupabaseReferenceData();
    } catch (error) {
      state.backend = null;
      state.session = null;
      state.demoMode = true;
      state.coaches = initialCoaches;
      clients = demoClients;
      state.foods = demoFoods;
      state.exercises = [];
      try { state.plans = JSON.parse(localStorage.getItem(storageKeys.demoPlans) || "{}"); } catch { state.plans = {}; }
      try { sessionStorage.removeItem(storageKeys.session); } catch { /* Private browsing can disable storage. */ }
      showToast(error.message || "Supabase session could not be restored; demo mode is active.");
      renderAll();
      loadPlanIntoEditor({ status: "empty" });
    }
  }

  function useDemoMode() {
    state.demoMode = true;
    state.backend = null;
    state.session = null;
    state.coaches = initialCoaches;
    clients = demoClients;
    state.foods = demoFoods;
    state.exercises = [];
    state.clientId = clients[0]?.id || "demo-client-001";
    state.plans = JSON.parse(localStorage.getItem(storageKeys.demoPlans) || "{}");
    try { sessionStorage.removeItem(storageKeys.session); } catch { /* Private browsing can disable storage. */ }
    renderAll();
    loadPlanIntoEditor(existingPlan() || { status: "empty" });
    $("#settings-dialog").close();
    showToast("Demo workspace is ready.");
  }

  function bindEvents() {
    $("#coach-select").addEventListener("change", (event) => {
      state.coachId = event.target.value;
      loadPlanIntoEditor(existingPlan() || { status: "empty", mode: "gym" });
      renderClientProfile();
      updateProgress();
      setSaveMessage("");
    });
    $("#client-select").addEventListener("change", (event) => {
      state.clientId = event.target.value;
      renderClientProfile();
      loadPlanIntoEditor(existingPlan() || { status: "empty", mode: "gym" });
      setSaveMessage("");
      $("#ai-output").innerHTML = '<div class="empty-state"><div class="empty-orbit" aria-hidden="true"><span>✳</span><i class="orbit-dot orbit-dot-one"></i><i class="orbit-dot orbit-dot-two"></i><i class="orbit-dot orbit-dot-three"></i></div><h3>Good plans invite good questions.</h3><p>Save your plan, then ask for a reasoned review. The final call always stays with you.</p></div>';
    });
    $$(".mode-button").forEach((button) => button.addEventListener("click", () => {
      if (state.mode === button.dataset.mode) return;
      state.mode = button.dataset.mode;
      $$(".mode-button").forEach((item) => item.classList.toggle("is-active", item === button));
      updateExerciseOptions();
      renderWorkoutList();
      renderPlanStatus("unsaved");
      setSaveMessage("");
    }));
    $("#exercise-search").addEventListener("focus", () => {
      renderExerciseOptions($("#exercise-search").value);
      $("#exercise-options").hidden = false;
      $("#exercise-search").setAttribute("aria-expanded", "true");
    });
    $("#exercise-search").addEventListener("input", (event) => {
      state.selectedExercise = "";
      renderExerciseOptions(event.target.value);
      $("#exercise-options").hidden = false;
      $("#exercise-search").setAttribute("aria-expanded", "true");
    });
    $("#exercise-options").addEventListener("click", (event) => {
      const option = event.target.closest("[data-exercise-id]");
      if (!option) return;
      const exercise = allExercises().find((item) => item.id === option.dataset.exerciseId);
      if (!exercise) return;
      state.selectedExercise = exercise.id;
      $("#exercise-search").value = exercise.name;
      $("#exercise-options").hidden = true;
      $("#exercise-search").setAttribute("aria-expanded", "false");
      $("#exercise-hint").classList.remove("is-warning");
      $("#exercise-hint").textContent = `${exercise.primaryMuscle || exercise.category || "General"} · ${exercise.equipment || "No equipment"}`;
    });
    const hideUnavailableImage = (event) => {
      if (event.target instanceof HTMLImageElement && !event.target.naturalWidth) {
        event.target.hidden = true;
      }
    };
    $("#exercise-options").addEventListener("error", hideUnavailableImage, true);
    $("#workout-list").addEventListener("error", hideUnavailableImage, true);
    $("#exercise-search").addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        $("#exercise-options").hidden = true;
        event.target.setAttribute("aria-expanded", "false");
      }
      if (event.key === "Enter" && !$("#exercise-options").hidden) {
        event.preventDefault();
        $("#exercise-options [data-exercise-id]")?.click();
      }
    });
    $("#add-exercise").addEventListener("click", addExercise);
    $("#workout-list").addEventListener("input", (event) => {
      const index = Number(event.target.closest(".workout-item")?.dataset.index);
      const field = event.target.dataset.field;
      if (!Number.isInteger(index) || !field || !state.workouts[index]) return;
      if (field === "sets" || field === "rir" || field === "restSeconds") {
        const value = Number(event.target.value);
        const max = field === "sets" ? 20 : field === "rir" ? 10 : 900;
        const min = field === "sets" ? 1 : 0;
        if (!Number.isInteger(value) || value < min || value > max) {
          event.target.setCustomValidity(`Enter a whole number from ${min} to ${max}.`);
          event.target.reportValidity();
          return;
        }
        event.target.setCustomValidity("");
        state.workouts[index][field] = value;
      } else {
        state.workouts[index][field] = event.target.value.trim();
      }
      renderPlanStatus("unsaved");
      setSaveMessage("");
    });
    $("#workout-list").addEventListener("keydown", (event) => {
      const tab = event.target.closest(".workout-day-tab");
      if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const dayNumber = Number(tab.dataset.day);
      state.activeWorkoutDay = event.key === "Home"
        ? 1
        : event.key === "End"
          ? workoutDays.length
          : ((dayNumber - 1 + (event.key === "ArrowRight" ? 1 : workoutDays.length - 1)) % workoutDays.length) + 1;
      renderWorkoutList();
      $(`#workout-tab-${state.activeWorkoutDay}`).focus();
    });
    $("#workout-list").addEventListener("click", (event) => {
      const tab = event.target.closest(".workout-day-tab");
      if (tab) {
        state.activeWorkoutDay = Number(tab.dataset.day);
        renderWorkoutList();
        return;
      }
      const stepButton = event.target.closest("[data-step]");
      if (stepButton) {
        const index = Number(stepButton.closest(".workout-item")?.dataset.index);
        const field = stepButton.dataset.step;
        const item = state.workouts[index];
        if (!item || (field !== "sets" && field !== "rir")) return;
        const min = field === "sets" ? 1 : 0;
        const max = field === "sets" ? 20 : 10;
        item[field] = Math.min(max, Math.max(min, item[field] + Number(stepButton.dataset.delta)));
        stepButton.parentElement.querySelector(`[data-field="${field}"]`).value = item[field];
        renderPlanStatus("unsaved");
        setSaveMessage("");
        return;
      }
      const button = event.target.closest("[data-remove]");
      if (!button) return;
      state.workouts.splice(Number(button.dataset.remove), 1);
      renderWorkoutList();
      renderPlanStatus("unsaved");
      setSaveMessage("");
    });
    ["#macro-calories", "#macro-protein", "#macro-carbs", "#macro-fat"].forEach((id) => {
      $(id).addEventListener("input", () => { renderPlanStatus("unsaved"); setSaveMessage(""); });
    });
    $("#save-plan").addEventListener("click", () => { void savePlan(); });
    $("#reset-plan").addEventListener("click", () => {
      loadPlanIntoEditor(existingPlan() || { status: "empty" });
      setSaveMessage("Unsaved changes cleared.");
    });
    $("#plan-status").addEventListener("click", togglePlanComplete);
    $("#review-plan").addEventListener("click", () => {
      $("#gemini-error").classList.remove("is-visible");
      $("#ai-api-key").value = "";
      $("#gemini-dialog").showModal();
      $("#ai-api-key").focus();
    });
    $("#ai-provider").addEventListener("change", configureAiProvider);
    $("#settings-button").addEventListener("click", () => $("#settings-dialog").showModal());
    $("#settings-form").addEventListener("submit", (event) => event.preventDefault());
    $("#connect-supabase").addEventListener("click", signInSupabase);
    $("#use-demo").addEventListener("click", useDemoMode);
    $("#disconnect-supabase").addEventListener("click", useDemoMode);
    $("#gemini-form").addEventListener("submit", onReviewSubmit);
    $("#cancel-gemini").addEventListener("click", () => $("#gemini-dialog").close());
  }

  function initialize() {
    const today = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());
    $("#today-label").textContent = today;
    configureAiProvider();
    readStoredSettings();
    try {
      state.plans = JSON.parse(localStorage.getItem(storageKeys.demoPlans) || "{}");
    } catch {
      state.plans = {};
      showToast("Saved demo plans could not be read; create a new plan to continue.");
    }
    renderAll();
    loadPlanIntoEditor(existingPlan() || { status: "empty", mode: "gym" });
    bindEvents();
    void loadOpenExerciseLibrary();
    void tryRestoreSession();
  }

  initialize();
})();
