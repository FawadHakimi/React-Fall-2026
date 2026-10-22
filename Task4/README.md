# Task 4 — Car Fleet Manager (Async React: Effects & API)

A React + Vite app for managing a car-rental fleet. It talks to the provided **fake asynchronous API**
(Promises, random delays 0.5–3 s, 5 % random errors, data kept in `localStorage`).

**Live app:** [https://fawadhakimi.github.io/React-Fall-2026/Task4/]

## Features
- Car list loaded with `useEffect`; search, sort (A→Z / Z→A) and pagination (8 per page)
- Select a car → its details (10+ fields) load asynchronously
- Create, Edit and Delete (controlled form with validation, inline delete confirmation)
- Status action: *Rent out*, *Mark as returned*, *Send to maintenance*, *Back to fleet*
- Loading, error (with "Try again"), empty and success states for the list and for the details
- **Reload** button
- Responsive layout (on phones the list and the details switch places)

## How the tricky parts work
- **Effect dependencies** — the list effect depends on `[page, search, sort, reloadKey]`, the details effect on `[selectedId, detailsAttempt]`.
- **Cleanup / race conditions** — every effect has `let ignore = false` and a cleanup `return () => { ignore = true }`.
  If the user switches car A → B quickly, A's late response is ignored, so outdated details are never shown.
- **Stale closures** — `handleStatusChange(car, next)` saves `const id = car.id` before `await`. When the response arrives it updates
  the car with *that* id (`prev.map(c => c.id === id ...)`), even if another car is now selected.
  While an action is running, all conflicting buttons (rent, edit, delete, add, reload) are disabled.
- **Identity** — `CarDetails` and `CarForm` get a `key` (car id / mode), so their local state resets when the car or mode changes.

## Rules followed
Only `useState` and `useEffect`; no custom hooks; no debouncing; no fetching libraries; components never touch `localStorage`
(only `src/api/fakeApi.js` does). `fakeApi.js` is unchanged. Only `settings.js` (own `DATA_KEY`) and the data in `initial-data-sample.js` were edited.
Because `createItem` stores only `name` + `description`, `src/api/carsApi.js` creates the car and then saves the other fields with `updateItem`.

## Run locally
```bash
npm install
npm run dev
```
Build for production: `npm run build` (output in `dist/`).

To reset the data: DevTools → Application → Local Storage → delete `car-fleet-task4-data` → refresh.
