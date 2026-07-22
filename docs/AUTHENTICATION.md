# PM OS - Authentication & Session Architecture Guide

This guide documents the SaaS authentication model, session management, route protection, Creator Mode security, and OAuth configuration in PM OS.

---

## 1. Authentication Lifecycle & Flow

PM OS follows a standard SaaS platform authentication flow:

```
Open Application
      │
      ▼
Check Existing Session (Supabase Auth Client)
      │
      ├─── Logged In ───► Auto-redirect to Dashboard (or active route)
      │
      └─── No Session ──► Show Login Screen
```

### Key Behaviors:
1. **Persistent Login**: Supabase client stores session tokens in local storage (`persistSession: true`, `autoRefreshToken: true`). Upon refreshing or reopening the application, the session is verified automatically without requiring re-login.
2. **Auto-Redirect**:
   - Authenticated users attempting to visit `/login`, `/signup`, or `/forgot-password` are automatically redirected to `/dashboard`.
   - Unauthenticated users attempting to access protected routes are directed to `/login`.
3. **Session Expiration**: If a session expires or token refresh fails, `signOut()` is triggered and the user is redirected to the login screen.

---

## 2. Signup & Automatic Provisioning Flow

When a new user signs up via email/password:
1. `authService.signUp` creates the account in Supabase Auth.
2. Immediately upon user creation, `authService.ensureDefaultUserRecords` provisions 3 records in Supabase PostgreSQL:
   - `profiles`: `{ id, email, full_name, role: 'student', updated_at }`
   - `progress`: `{ user_id, current_week: 0, xp: 0, streak_current: 0, streak_longest: 0 }`
   - `settings`: `{ user_id, hours_logged_total: 0, weekly_goal_days: 5, monthly_goal_days: 20, theme: 'light', timezone: 'UTC' }`
3. The user is redirected straight to the **Dashboard** without needing manual setup.

---

## 3. Creator Mode Security & Hidden Controls

Creator Mode provides instructors with editing capabilities for course materials.

### Security Implementation:
- **No Public Toggle**: Creator Mode controls are completely hidden from student navigation bars and sidebars.
- **Access Control**:
  - Unlocked via shortcut: `Ctrl + Shift + M` (or `Cmd + Shift + M` on macOS).
  - Unlocked via Secret Passcode modal prompt (`CreatorPasscodeModal`).
- **Instructor Banner**: When active, a subtle amber banner displays on the Topbar with a lock button to return to Study Mode.

---

## 4. Protected Routes & Route Guard

The `ProtectedRoute` component guards sensitive routes (e.g., Profile, Journal):

```tsx
<ProtectedRoute>
  <JournalView />
</ProtectedRoute>
```

If an unauthenticated user navigates to a protected route, `ProtectedRoute` renders a clean "Sign In Required" prompt with a direct button to the Login page.

---

## 5. Google OAuth Integration (Optional Preparation)

Google OAuth login is integrated via Supabase Auth and can be enabled in 3 steps:

### Setup Steps:
1. **Google Cloud Console**:
   - Create an OAuth 2.0 Client ID (Web Application type).
   - Set Authorized Redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`.
2. **Supabase Dashboard**:
   - Go to *Authentication > Providers > Google*.
   - Enable the provider and paste your **Client ID** and **Client Secret**.
3. **App Behavior**:
   - Clicking "Sign in with Google" calls `authService.signInWithGoogle()`.
   - On redirect back to the app, `onAuthStateChange` triggers `loadProfileForUser`, ensuring `profiles`, `progress`, and `settings` records exist automatically.
