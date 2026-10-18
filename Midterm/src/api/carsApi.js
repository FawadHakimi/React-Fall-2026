// API: it behaves like a real server.
// It uses Promises, delays, JSON data and localStorage.
import { initialCars } from "../data/cars";

const STORAGE_KEY = "car-rental-cars";
const DELAY = 300; // milliseconds of "network" waiting
const FAIL_RATE = 0; // change to 0.3 to test the error state (30% of requests fail)

// Waits for some time. If the request is cancelled, it stops.
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

// Reads all cars from localStorage. On the first visit it saves the 120 starting cars.
function readCars() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // if the saved data is broken, we start again below
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCars));
  return initialCars;
}

function saveCars(cars) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
}

function maybeFail() {
  if (Math.random() < FAIL_RATE) {
    throw new Error("Network error. Please try again.");
  }
}

// Get one page of cars, with search, filters and sorting already applied.
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

  let result = readCars();

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

  // [...result] makes a copy, so we never change the original list
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

// Get one car by its id.
export async function getCarById(id, signal) {
  await wait(DELAY, signal);
  maybeFail();

  const car = readCars().find((c) => c.id === Number(id));
  if (!car) {
    throw new Error("Car not found.");
  }
  return car;
}

// Add a new car and save it.
export async function addCar(newCar) {
  await wait(DELAY);
  maybeFail();

  const cars = readCars();
  const nextId = cars.reduce((max, c) => Math.max(max, c.id), 0) + 1;
  const car = { ...newCar, id: nextId };
  saveCars([car, ...cars]);
  return car;
}
