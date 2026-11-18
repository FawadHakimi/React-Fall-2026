import fs from "node:fs";
import path from "node:path";
import { initialCars } from "../src/data/cars.js";

const apiDir = path.resolve("public", "api");
const carsDir = path.join(apiDir, "cars");

fs.rmSync(apiDir, { recursive: true, force: true });
fs.mkdirSync(carsDir, { recursive: true });

fs.writeFileSync(path.join(apiDir, "cars.json"), JSON.stringify(initialCars));
for (const car of initialCars) {
  fs.writeFileSync(path.join(carsDir, `${car.id}.json`), JSON.stringify(car));
}

console.log(`API files created: 1 list + ${initialCars.length} details`);