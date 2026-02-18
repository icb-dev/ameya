# Admin Frontend Security

## Overview

The admin panel is protected by login. Users must sign in before accessing any admin route. The token is stored in `localStorage` and sent on all admin API requests.

## Implemented Behavior

### Login page (`/login`)

- Form with **username** and **password**.
- Submits to `POST /api/login` (body: `{ username, password }`).
- On success: token and user are stored, then redirect to `/admin` (or the page the user tried to open).
- On failure: error message is shown.

### Auth check on load

- On app load, if a token exists in `localStorage`, the app calls `GET /api/login/me` with `Authorization: Bearer <token>`.
- If the response is **401**, the token is cleared and the user is treated as logged out (redirect to login when hitting protected routes).
- If the response is OK, the current user is stored in `AuthContext`.

### Protected admin routes

- All routes under `/admin` are wrapped in `ProtectedRoute`.
- Before rendering admin content, the app checks for a valid user (from the initial `/me` check or after login).
- If there is no valid user, the user is redirected to `/login`.
- The intended destination is kept in `location.state.from` so after login the user can be sent back to the page they wanted.

### API calls

- All admin API calls (projects, sections, upload) send `Authorization: Bearer <token>` when a token is present.
- Token is read from `localStorage` via `getStoredToken()` / `getAuthHeaders()` in `src/services/api.ts`.
- If any of these requests returns **401**, the token is cleared and a global logout event is fired so the UI redirects to login.

### Logout

- **Sidebar:** "Logout" button in the admin sidebar clears the token and user, then redirects to `/login`.
- **Programmatic:** Any 401 from the API clears the token and triggers the same redirect.

## Files

| Area | File |
|------|------|
| Auth state & login/logout | `src/context/AuthContext.tsx` |
| Login UI | `src/admin/pages/Login.tsx` |
| Route guard | `src/admin/components/ProtectedRoute.tsx` |
| Auth API & headers | `src/services/api.ts` (login, getMe, getAuthHeaders, getStoredToken, setStoredToken) |
| Upload with auth | `src/services/upload.ts` (Bearer token on upload) |
| Routes & provider | `src/App.tsx` |
| Logout in UI | `src/admin/components/AdminSidebar.tsx` |

## Backend (optional)

To restrict project create/update/delete to logged-in admins, mount project routes behind auth middleware, e.g.:

```js
const { requireAuth } = require("./middleware/auth");
app.use("/api/projects", requireAuth, projectRoutes);
```

Ensure `requireAuth` validates the JWT and returns 401 when missing or invalid.
