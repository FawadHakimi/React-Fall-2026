# Car Rental

React single page application for browsing and renting cars.

Live app: https://fawadhakimi.github.io/React-Fall-2026/

## What it does

- Browse 120 cars in a paginated list (12 per page) and open any car for a detail view.
- Search by brand or model, filter by type, transmission and availability, sort four ways, and reset everything with one button.
- Add a new car with a controlled, validated form. New cars are saved and show up first in the list.
- Every data request shows loading, error (with a "Try again" button), empty and success states.

## Data source

A simulated API in `src/api/carsApi.js`. It uses Promises, a 300 ms delay, JSON data and `localStorage`. The first request copies the 120 cars from `src/data/cars.js` into `localStorage`, and later requests (and added cars) read from there. Search, filtering, sorting and pagination happen inside the API, so the app asks it for new data whenever a choice changes.

To test the error state, set `FAIL_RATE` in `carsApi.js` to `0.5`. To restore the original 120 cars, clear the site's `localStorage` and reload.

## Components

- `App`: header and which screen is open (list, detail or form)
- `CarsPage`: holds filters, page and request status, and loads the list
- `Filters`: search, selects and checkbox (controlled inputs)
- `CarList` and `CarCard`: the grid and a single car
- `Pagination`: previous and next buttons
- `CarDetail`: loads and shows one car
- `AddCarForm`: controlled form with validation (includes a small `Field` helper)

## React notes

- State lives in the component that needs it. `App` only knows which screen is open.
- Effects reload data when their dependencies change (`filters`, `page`, `retryCount`, `carId`).
- Every request uses an `AbortController`, so outdated responses never overwrite newer data.
- List items use `car.id` as the key. `CarDetail` uses `key={carId}`, so opening another car resets its state.
- The list is hidden, not removed, while a car is open, so search, filters and page are kept when going back.

## Run locally

```
npm install
npm run dev
```

## Deploy (GitHub Pages)

Push to `main`. In the repository, go to Settings, Pages, and set Source to GitHub Actions. The workflow in `.github/workflows/deploy.yml` builds the `Midterm` folder and publishes it.