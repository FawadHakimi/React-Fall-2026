// API: the data comes from real JSON files requested with fetch().
//   api/cars.json     -> the whole list
//   api/cars/12.json  -> one car
// Cars added by the user are saved in localStorage on the device.

import { setFromCache } from "./cacheStatus";

const ADDED_KEY = "car-rental-added-cars";
const API_URL = `${import.meta.env.BASE_URL}api/`;
const DELAY = 300;
const FAIL_RATE = 0; // change to 0.3 to test the error state

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal && signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      });
    }
  });
}

function maybeFail() {
  if (Math.random() < FAIL_RATE) {
    throw new Error("Network error. Please try again.");
  }
}

// Makes an Error with a "code", so pages can recognise it.
function makeError(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}

// Requests one JSON file from the API.
async function fetchApi(path, signal) {
  let response;
  try {
    response = await fetch(API_URL + path, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw makeError("You are offline and this data is not saved on your device yet.", "OFFLINE");
  }

  if (response.status === 503) {
    throw makeError("You are offline and this data is not saved on your device yet.", "OFFLINE");
  }
  const isJson = (response.headers.get("content-type") || "").includes("json");
  if (response.status === 404 || (response.ok && !isJson)) {
    throw makeError("Car not found.", "NOT_FOUND");
  }
  if (!response.ok) {
    throw new Error(`Server error (${response.status}). Please try again.`);
  }
  // The service worker adds this header when the answer came from its cache
  setFromCache(response.headers.get("X-From-Cache") === "true");
  return response.json();
}

// ----- Cars added by the user (saved on this device) -----
function readAddedCars() {
  try {
    const saved = localStorage.getItem(ADDED_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveAddedCars(cars) {
  localStorage.setItem(ADDED_KEY, JSON.stringify(cars));
}

// All cars = added cars first, then the cars from the server.
async function loadAllCars(signal) {
  const serverCars = await fetchApi("cars.json", signal);
  return [...readAddedCars(), ...serverCars];
}

export async function getCars({
  search = "",
  type = "All",
  transmission = "All",
  availableOnly = false,
  sortBy = "default",
  page = 1,
  pageSize = 12,
  signal,
} = {}) {
  await wait(DELAY, signal);
  maybeFail();

  let result = await loadAllCars(signal);

  const text = search.trim().toLowerCase();
  if (text) {
    result = result.filter((car) =>
      `${car.brand} ${car.model}`.toLowerCase().includes(text)
    );
  }
  if (type !== "All") {
    result = result.filter((car) => car.type === type);
  }
  if (transmission !== "All") {
    result = result.filter((car) => car.transmission === transmission);
  }
  if (availableOnly) {
    result = result.filter((car) => car.available);
  }

  result = [...result];
  if (sortBy === "price-asc") {
    result.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sortBy === "price-desc") {
    result.sort((a, b) => b.pricePerDay - a.pricePerDay);
  } else if (sortBy === "rating-desc") {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "year-desc") {
    result.sort((a, b) => b.year - a.year);
  }

  const total = result.length;
  const start = (page - 1) * pageSize;
  const items = result.slice(start, start + pageSize);

  return { items, total };
}

export async function getCarById(id, signal) {
  await wait(DELAY, signal);
  maybeFail();

  const carId = Number(id);
  if (!Number.isInteger(carId)) {
    throw makeError("Car not found.", "NOT_FOUND");
  }

  // A car added by the user lives only on this device.
  const added = readAddedCars().find((car) => car.id === carId);
  if (added) return added;

  return fetchApi(`cars/${carId}.json`, signal);
}

export async function addCar(newCar) {
  await wait(DELAY);
  maybeFail();

  const added = readAddedCars();
  // Server cars use ids 1-120, so our own cars start from 1001.
  const nextId = added.reduce((max, c) => Math.max(max, c.id), 1000) + 1;
  const car = { ...newCar, id: nextId };
  saveAddedCars([car, ...added]);
  return car;
}

export async function getAllCars(signal) {
  await wait(DELAY, signal);
  maybeFail();
  return loadAllCars(signal);
}