# Car Rental (Server Data, Caching & Firebase Authentication)

React single page application for browsing and renting cars. It uses React Router, TanStack Query for caching, and Firebase Authentication.

Live app: https://fawadhakimi.github.io/React-Fall-2026/Task6/

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
| `*` | Custom 404 page |

The app uses `HashRouter`, so direct links and page refresh work on GitHub Pages (for example `#/cars/12`).

## Features

- Nested routes with `RootLayout`, `NavBar` and `Outlet`. `App.jsx` only contains routes.
- Cars list: search, type and transmission filters, "available only", sorting and pagination. All of them are stored in the URL with `useSearchParams`.
- Car details: loaded by id with `useParams`. Shows loading, error (with "Try again"), and "car not found" states.
- Dashboard: statistics, breakdowns, highlights, and an interactive filter.
- Lazy loading with `React.lazy` and `Suspense`.
- Every data request handles loading, error, empty and success states.

## Authentication (Firebase)

- Email/Password and Google sign-in, signup with validation, and logout.
- `AuthProvider` (`src/context/AuthProvider.jsx`) tracks the user with `onAuthStateChanged` and shares `user`, `loading`, `error` and the auth functions through the `useAuth` hook (`src/hooks/useAuth.js`).
- The session is stored by Firebase (`browserLocalPersistence`), so the user stays logged in after a refresh.
- `/profile` is wrapped in `ProtectedRoute`. Unauthenticated users are redirected to `/login`, and after logging in they return to the page they wanted.
- The NavBar shows Login/Signup or Profile/Logout depending on the authentication state.
- All Firebase calls are in `src/services/authService.js`. Firebase is initialised in `src/firebase.js`.

### Environment variables

1. Copy `.env.example` to `.env.local`.
2. Fill in the values from Firebase Console -> Project settings -> Your apps (Web app).
3. `.env.local` is listed in `.gitignore` and is never committed.

In Firebase Console, enable Authentication -> Sign-in method -> Email/Password and Google. Add `localhost` and `fawadhakimi.github.io` to Authentication -> Settings -> Authorized domains.

## Data source

A simulated API in `src/services/service.js`. It uses Promises, a 300 ms delay, JSON data and `localStorage`. The first request copies 120 cars from `src/data/cars.js` into `localStorage`. Search, filtering, sorting and pagination are done inside the API.

Only `service.js` uses `localStorage`. Components do not call the API directly: they use the hooks in `src/hooks/useCars.js`.

To test the error state, set `FAIL_RATE` in `service.js` to `0.5`. To restore the original 120 cars, clear the site's `localStorage` and reload.

## Caching strategy

Server data is cached with TanStack Query (`src/queryClient.js` and `src/hooks/useCars.js`).

| Query key | Data |
|---|---|
| `["cars", "list", {search, type, transmission, availableOnly, sortBy, page, pageSize}]` | One page of cars (Cars page, Home top rated) |
| `["cars", "detail", id]` | One car |
| `["cars", "all"]` | All cars (Dashboard) |

- **Expiration / revalidation:** data is fresh for 1 minute (`staleTime`). After that, it is shown from the cache and refreshed in the background the next time it is used. Data that no component uses is removed after 5 minutes (`gcTime`).
- **Different filters = different cache entries.** Going back to a search or page that was already visited shows it instantly.
- **Outdated requests:** every query has its own key and receives an `AbortSignal`, so an old request is cancelled and cannot overwrite a newer result. The previous page stays visible ("Updating...") while a new one loads.

### When the cache is invalidated

After a car is added (`useAddCar`), every query whose key starts with `["cars"]` is invalidated. The lists, the Home page and the Dashboard load fresh data. The app has no update or delete operations, so adding a car is the only action that invalidates the cache.

## Project structure

```
src/
  components/   NavBar, RootLayout, ProtectedRoute, GoogleButton, CarsPage, Filters,
                CarList, CarCard, Pagination, CarDetail, AddCarForm, StatCard, BreakdownCard
  pages/        Home, About, CarsListPage, CarDetailPage, AddCarPage,
                Dashboard, Login, Signup, Profile, NotFound
  context/      AuthContext.js, AuthProvider.jsx
  services/     service.js (cars API), authService.js (Firebase)
  hooks/        useAuth.js, useCars.js (cached server data)
  firebase.js   Firebase initialisation
  queryClient.js  cache settings
  styles/       index.css
  data/         cars.js (120 starting cars)
```

## Run locally

```
npm install
cp .env.example .env.local   (then fill in your Firebase values)
npm run dev
```

On Windows, instead of `cp`, copy the file manually and rename it to `.env.local`.

`VITE_` values are put into the build by Vite, so run `npm run build` on a computer that has `.env.local` before deploying.