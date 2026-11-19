# Car Rental (Task 7: Installable PWA)

React single page application for browsing and renting cars. It uses React Router, TanStack Query for caching, Firebase Authentication, and (new in Task 7) it is an installable Progressive Web App that works offline.

Live app: https://fawadhakimi.github.io/React-Fall-2026/Task7/

All features from the previous homeworks are kept: routing, filters, pagination, dashboard, caching and authentication.

## Pages

| Route | Page |
|---|---|
| `/` | Home: introduction, image, top rated cars, links |
| `/about` | About the project |
| `/cars` | Cars list: search, filters, sorting, pagination |
| `/cars/new` | Form for adding a new car |
| `/cars/:id` | Car details |
| `/dashboard` | Statistics and breakdowns |
| `/login` | Email/password login and Google sign-in |
| `/signup` | Sign up: email, password, confirm password |
| `/profile` | Protected page: email, UID, logout |
| `/offline` | Offline page with a "Retry Connection" button |
| `*` | Custom 404 page |

The app uses `HashRouter`, so direct links and page refresh work on GitHub Pages (for example `#/cars/12`).

## Features

- Nested routes with `RootLayout`, `NavBar` and `Outlet`. `App.jsx` only contains routes.
- Cars list: search, type and transmission filters, "available only", sorting and pagination. All of them are stored in the URL with `useSearchParams`.
- Car details: loaded by id with `useParams`. Shows loading, error (with "Try again"), and "car not found" states.
- Dashboard: statistics, breakdowns, highlights, and an interactive filter.
- Lazy loading with `React.lazy` and `Suspense`.
- Every data request handles loading, error, empty and success states.
- Firebase authentication with a protected `/profile` page.
- Installable PWA: offline support, update button, online/offline indicator, responsive mobile layout.

## PWA (Task 7)

### 1. Manifest and installation

- `public/manifest.json` has `name`, `short_name`, `start_url`, `scope`, `display: "standalone"`, `theme_color`, `background_color` and the icons.
- Icons: `public/icons/icon-192.png` (192x192) and `public/icons/icon-512.png` (512x512).
- The manifest is linked in `index.html` together with `theme-color`.
- An **Install app** button appears in the menu when the browser allows installation (`useInstallPrompt` hook, `InstallButton` component). Chrome also shows its own install icon in the address bar.

### 2. Service Worker (`public/sw.js`)

The Service Worker is written manually (no Workbox) and handles three events:

| Event | What it does |
|---|---|
| `install` | Downloads the whole app shell (built JS and CSS, icons, `index.html`, `manifest.json`, `offline.html`) into a **pre-cache**. Files are requested with `cache: "reload"` so they are always fresh. |
| `activate` | Deletes every `car-rental-*` cache that is not in the current list (outdated versions), then takes control of the open pages. |
| `fetch` | Decides who answers each request: the cache or the network (see strategies below). |

**Versioned caches.** After `npm run build`, a small Vite plugin (`serviceWorkerPlugin` in `vite.config.js`) fills two values in `dist/sw.js`: the list of built files and a build id (a hash of all files and of the Service Worker code). The pre-cache is named `car-rental-precache-<build id>`, so every new build gets its own cache and the old one is deleted on activation. The runtime caches are `car-rental-static-v1` and `car-rental-api-v1`.

**Update mechanism.**

1. When a new version is deployed, the browser installs the new Service Worker in the background. It waits and does not replace the running version.
2. The `useServiceWorkerUpdate` hook detects the waiting worker (and checks for updates every hour). `UpdateBanner` shows "A new version of the app is available" with **Update** and **Later** buttons.
3. **Update** sends the message `SKIP_WAITING` to the worker, the new worker takes control, and the page reloads once. Users never have to clear browser storage.

The Service Worker is registered only in the production build (not in `npm run dev`), so cached files never hide code changes while developing.

### 3. Runtime caching

| Strategy | Used for | Behaviour |
|---|---|---|
| **Cache-first** | Static files: JS, CSS, images, icons, fonts | Look in the cache first. If missing, use the network and save a copy in `car-rental-static-v1`. |
| **Network-first** | Public API data: `api/cars.json` (list) and `api/cars/<id>.json` (details) | Ask the network first and save the answer in `car-rental-api-v1`. If the network fails, answer from the saved copy. |

- **Offline data:** every list and detail request that was loaded before stays available offline. Search, filters, sorting and pagination also work offline, because they run in the app on the cached list.
- **Shows cached data:** when an API answer comes from the cache, the Service Worker adds the header `X-From-Cache: true`. `service.js` reads it and the yellow notice "You are viewing saved data from your last visit" is shown (`CachedDataNotice`). It disappears when fresh data arrives.
- **Cache size limit:** each runtime cache keeps at most 60 entries. `trimCache` deletes the oldest entries.
- **No private data in caches:** the Service Worker ignores every request to another website (Firebase, Google sign-in) and every non-GET request. Tokens and user data are never cached. Only same-origin public files and public car data are stored.
- **Failed requests do not crash the app:** errors get a `code` (`OFFLINE`, `NOT_FOUND`). Pages show a message or the offline page. A `RouteErrorBoundary` shows a message instead of a white screen if a page cannot be loaded.

### 4. Offline page and connectivity

- **`/offline` page** (`src/pages/Offline.jsx`): message, styling, and a **Retry Connection** button. The button makes a real request to a small file (`ping.txt?ping=<time>`, `src/pwa/connection.js`), not only `navigator.onLine`. If the request works, the user returns to the page they wanted; otherwise "Still offline" is shown.
- **When it appears:** if a page needs data that is not saved yet and there is no internet (car details, cars list, dashboard), `OfflineRedirect` sends the user to `/offline` and remembers the wanted page.
- **Static fallback:** `public/offline.html` is pre-cached. The Service Worker shows it when a navigation cannot be completed, so an offline page exists even without the app code.
- **Online/offline indicator:** a green "Online" / red "Offline" label in the header (`OnlineIndicator`, `useOnlineStatus`).
- **Back online:** when the connection returns, `RootLayout` invalidates all queries, so fresh data replaces the saved data automatically.
- **Previously visited pages** open offline because every navigation is answered with the pre-cached `index.html` (single page app) and the data comes from the API cache.

### 5. Mobile

- Works from 320px width in portrait and landscape, without horizontal scrolling.
- Responsive navigation: a hamburger button (`aria-expanded`, `aria-controls`) opens the menu on small screens. The menu closes after choosing a link.
- Cards, forms, filters, dashboard and car details adapt to narrow screens (`min()` in grid columns, smaller padding and text, stacked rows).
- Touch-friendly: buttons and form controls are at least 44px high; inputs use 16px text so phones do not zoom in.
- On short landscape screens the header is not sticky, so it does not cover the content.
- `viewport-fit=cover` and safe-area padding keep content away from notches.

### How to test the PWA locally

```
npm run build
npm run preview -- --port 4173 --strictPort
```

Open `http://localhost:4173/React-Fall-2026/Task7/`, then in Chrome DevTools (F12) -> Application:

1. **Manifest:** name, icons and colors are shown without errors.
2. **Service Workers:** status "activated and is running".
3. **Cache Storage:** `car-rental-precache-...`, `car-rental-static-v1`, `car-rental-api-v1`.
4. Open Cars and one car, tick **Offline** and refresh: the app, the visited pages and the saved cars still work, and the saved-data notice is shown.
5. While offline, open a car that was never visited: the `/offline` page appears. Untick Offline and press **Retry Connection**: you return to that car.
6. **Update:** change some text, run `npm run build` again, refresh: the update banner appears; **Update** loads the new version and the old pre-cache is deleted.

## Authentication (Firebase)

- Email/Password and Google sign-in, signup with validation, and logout.
- `AuthProvider` (`src/context/AuthProvider.jsx`) tracks the user with `onAuthStateChanged` and shares `user`, `loading`, `error` and the auth functions through the `useAuth` hook (`src/hooks/useAuth.js`).
- The session is stored by Firebase (`browserLocalPersistence`), so the user stays logged in after a refresh.
- `/profile` is wrapped in `ProtectedRoute`. Unauthenticated users are redirected to `/login`, and after logging in they return to the page they wanted.
- The NavBar shows Login/Signup or Profile/Logout depending on the authentication state.
- All Firebase calls are in `src/services/authService.js`. Firebase is initialised in `src/firebase.js`.
- Firebase requests go to other websites, so the Service Worker never touches or caches them.

### Environment variables

1. Copy `.env.example` to `.env.local`.
2. Fill in the values from Firebase Console -> Project settings -> Your apps (Web app).
3. `.env.local` is listed in `.gitignore` and is never committed.

In Firebase Console, enable Authentication -> Sign-in method -> Email/Password and Google. Add `localhost` and `fawadhakimi.github.io` to Authentication -> Settings -> Authorized domains.

## Data source

The data comes from real JSON files, so the browser can request them with `fetch` and the Service Worker can cache them.

- `scripts/generate-api.mjs` reads the 120 cars from `src/data/cars.js` and creates `public/api/cars.json` (the list) and `public/api/cars/<id>.json` (one file per car). It runs automatically before `npm run dev` and `npm run build` (`predev` / `prebuild`), or manually with `npm run generate-api`.
- `src/services/service.js` requests these files. Search, filtering, sorting and pagination run in `service.js` on the loaded list. A 300 ms delay simulates a network.
- Cars added with the form are saved in `localStorage` (key `car-rental-added-cars`, ids start from 1001), because a static website cannot receive new data. They are shown before the 120 server cars and also work offline.

Only `service.js` uses `localStorage` and `fetch` for cars. Components do not call the API directly: they use the hooks in `src/hooks/useCars.js`.

To test the error state, set `FAIL_RATE` in `service.js` to `0.5`. To remove the cars you added, clear the site's `localStorage` and reload.

## Caching strategy (TanStack Query)

Server data in memory is cached with TanStack Query (`src/queryClient.js` and `src/hooks/useCars.js`).

| Query key | Data |
|---|---|
| `["cars", "list", {search, type, transmission, availableOnly, sortBy, page, pageSize}]` | One page of cars (Cars page, Home top rated) |
| `["cars", "detail", id]` | One car |
| `["cars", "all"]` | All cars (Dashboard) |

- **Expiration / revalidation:** data is fresh for 1 minute (`staleTime`). After that, it is shown from the cache and refreshed in the background the next time it is used. Data that no component uses is removed after 5 minutes (`gcTime`).
- **Different filters = different cache entries.** Going back to a search or page that was already visited shows it instantly.
- **Outdated requests:** every query has its own key and receives an `AbortSignal`, so an old request is cancelled and cannot overwrite a newer result. The previous page stays visible ("Updating...") while a new one loads.
- **Offline behaviour:** `networkMode: "offlineFirst"` makes TanStack Query send requests even when the browser says it is offline, so the Service Worker can answer from its cache. Errors with the code `OFFLINE` or `NOT_FOUND` are not retried.

### When the cache is invalidated

- After a car is added (`useAddCar`), every query whose key starts with `["cars"]` is invalidated. The lists, the Home page and the Dashboard load fresh data.
- When the internet connection returns, all queries are invalidated, so the saved data is replaced by fresh data.

The app has no update or delete operations.

## Project structure

```
public/
  sw.js              Service Worker
  manifest.json      PWA manifest
  offline.html       static offline page (pre-cached)
  ping.txt           tiny file for the "Retry Connection" check
  icons/             192x192 and 512x512 icons
  api/               generated JSON files (cars.json, cars/<id>.json)
scripts/
  generate-api.mjs   creates the JSON files from src/data/cars.js
src/
  components/   NavBar, RootLayout, ProtectedRoute, GoogleButton, CarsPage, Filters,
                CarList, CarCard, Pagination, CarDetail, AddCarForm, StatCard, BreakdownCard,
                OnlineIndicator, CachedDataNotice, UpdateBanner, InstallButton,
                OfflineRedirect, RouteErrorBoundary
  pages/        Home, About, CarsListPage, CarDetailPage, AddCarPage,
                Dashboard, Login, Signup, Profile, Offline, NotFound
  context/      AuthContext.js, AuthProvider.jsx
  services/     service.js (cars API), authService.js (Firebase), cacheStatus.js (saved-data flag)
  hooks/        useAuth.js, useCars.js, useOnlineStatus.js, useCachedDataStatus.js,
                useServiceWorkerUpdate.js, useInstallPrompt.js
  pwa/          connection.js (real connection check)
  firebase.js   Firebase initialisation
  queryClient.js  cache settings
  styles/       index.css
  data/         cars.js (120 starting cars)
vite.config.js  Vite config + plugin that fills the build id and file list in sw.js
```

## Run locally

```
npm install
cp .env.example .env.local   (then fill in your Firebase values)
npm run dev
```

On Windows, instead of `cp`, copy the file manually and rename it to `.env.local`.

`npm run dev` does not register the Service Worker. To test the PWA, use `npm run build` and `npm run preview` (see "How to test the PWA locally").

## Deployment

The app is deployed to GitHub Pages by GitHub Actions (`.github/workflows/deploy.yml`). The six `VITE_FIREBASE_*` values are stored as GitHub repository secrets and passed to the Task7 build step, because `.env.local` is not committed. GitHub Pages serves the site over HTTPS, which Service Workers and installation require.
