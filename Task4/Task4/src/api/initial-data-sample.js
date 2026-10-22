// Initial database: 60 cars. Generated with a tiny seeded random function,
// so everybody always gets the same data on first load.
const models = [
  ["Toyota", ["Camry", "Corolla", "RAV4", "Land Cruiser"]],
  ["Hyundai", ["Elantra", "Tucson", "Sonata", "Santa Fe"]],
  ["Kia", ["Rio", "Sportage", "K5", "Sorento"]],
  ["BMW", ["320i", "X5", "520d"]],
  ["Mercedes-Benz", ["C200", "E300", "GLE 450"]],
  ["Audi", ["A4", "A6", "Q7"]],
  ["Volkswagen", ["Polo", "Tiguan", "Passat"]],
  ["Lexus", ["RX 350", "ES 250"]],
  ["Tesla", ["Model 3", "Model Y"]],
  ["Honda", ["Civic", "CR-V"]],
  ["Mazda", ["3", "CX-5"]],
  ["Chevrolet", ["Cobalt", "Tahoe"]],
];
const colors = ["White", "Black", "Silver", "Grey", "Blue", "Red"];
const cities = ["Almaty", "Astana", "Shymkent", "Aktau"];
const letters = ["A", "B", "C", "K", "M", "X"];
const blurbs = [
  "Comfortable and reliable, great for long trips.",
  "Clean, well maintained and economical in the city.",
  "Spacious interior with a big trunk for the whole family.",
  "Smooth ride and modern safety features.",
  "A popular choice for business travel.",
];
const premiumBrands = ["BMW", "Mercedes-Benz", "Audi", "Lexus", "Tesla"];
const suvModels = [
  "RAV4", "Land Cruiser", "Tucson", "Santa Fe", "Sportage", "Sorento", "X5",
  "GLE 450", "Q7", "Tiguan", "RX 350", "CR-V", "CX-5", "Tahoe", "Model Y",
];

let seed = 2026;
function random() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
const pick = (list) => list[Math.floor(random() * list.length)];

const flat = models.flatMap(([brand, list]) =>
  list.map((model) => ({ brand, model })),
);

export const initialDataSample = Array.from({ length: 60 }, (_, index) => {
  const { brand, model } = flat[index % flat.length];
  const electric = brand === "Tesla";
  const premium = premiumBrands.includes(brand);
  const suv = suvModels.includes(model);
  const roll = random();

  return {
    id: index + 1,
    name: `${brand} ${model}`,
    description: pick(blurbs),
    brand,
    year: 2018 + Math.floor(random() * 8),
    pricePerDay: Math.round((premium ? 90 : 40) + random() * (suv ? 60 : 30)),
    transmission: electric || random() > 0.3 ? "Automatic" : "Manual",
    fuel: electric ? "Electric" : pick(["Petrol", "Petrol", "Diesel", "Hybrid"]),
    seats: suv ? pick([5, 7]) : 5,
    color: pick(colors),
    mileage: Math.round(10000 + random() * 140000),
    location: pick(cities),
    plate: `${100 + Math.floor(random() * 899)} ${pick(letters)}${pick(letters)}${pick(letters)} 0${1 + Math.floor(random() * 9)}`,
    status: roll < 0.65 ? "available" : roll < 0.9 ? "rented" : "maintenance",
  };
});
