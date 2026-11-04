# Car Rental (Routing & Application Architecture)

React single page application for browsing and renting cars, extended with React Router.

Live app: https://fawadhakimi.github.io/React-Fall-2026/Task5/

## Pages

| Route | Page |
|---|---|
| `/` | Home: introduction, image, top rated cars, links |
| `/about` | About the project |
| `/cars` | Cars list: search, filters, sorting, pagination |
| `/cars/new` | Form for adding a new car |
| `/cars/:id` | Car details |
| `/dashboard` | Statistics and breakdowns |
| `/login` | Styled login placeholder |
| `*` | Custom 404 page |

The app uses `HashRouter`, so direct links and page refresh work on GitHub Pages (for example `#/cars/12`).

## Features

- Nested routes with `RootLayout`, `NavBar` and `Outlet`. `App.jsx` only contains routes.
- Cars list: search, type and transmission filters, "available only", sorting and pagination. All of them are stored in the URL with `useSearchParams`, so the list can be shared, refreshed and used with Back/Forward.
- Car details: loaded by id with `useParams`. Shows loading, error (with "Try again"), and "car not found" states. Outdated requests are cancelled with `AbortController`.
- "Back" returns to the same filters and page the user came from.
- Dashboard: 4 statistics, 3 breakdowns (type, fuel, transmission), a highlights list, and an interactive filter (type and availability) that changes all numbers.
- Lazy loading with `React.lazy` and `Suspense` for About, Dashboard and Login.
- Every data request handles loading, error, empty and success states.

## Data source

A simulated API in `src/services/service.js`. It uses Promises, a 300 ms delay, JSON data and `localStorage`. The first request copies 120 cars from `src/data/cars.js` into `localStorage`. Search, filtering, sorting and pagination are done inside the API.

To test the error state, set `FAIL_RATE` in `service.js` to `0.5`. To restore the original 120 cars, clear the site's `localStorage` and reload.

## Project structure

```
src/
  components/   NavBar, RootLayout, CarsPage, Filters, CarList, CarCard,
                Pagination, CarDetail, AddCarForm, StatCard, BreakdownCard
  pages/        Home, About, CarsListPage, CarDetailPage, AddCarPage,
                Dashboard, Login, NotFound
  services/     service.js (all API requests)
  hooks/        (reserved for custom hooks)
  styles/       index.css
  data/         cars.js (120 starting cars)
```

## Run locally

```
npm install
npm run dev
```