import { useState } from "react";

const EMPTY = {
  name: "",
  description: "",
  brand: "",
  year: "2023",
  pricePerDay: "",
  transmission: "Automatic",
  fuel: "Petrol",
  seats: "5",
  color: "",
  mileage: "0",
  location: "Almaty",
  plate: "",
  status: "available",
};

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = "Name is required";
  if (!v.brand.trim()) errors.brand = "Brand is required";
  const year = Number(v.year);
  if (!Number.isInteger(year) || year < 1990 || year > 2030) errors.year = "Year must be 1990–2030";
  if (!(Number(v.pricePerDay) > 0)) errors.pricePerDay = "Price must be greater than 0";
  const seats = Number(v.seats);
  if (!Number.isInteger(seats) || seats < 1 || seats > 9) errors.seats = "Seats must be 1–9";
  if (!(Number(v.mileage) >= 0) || v.mileage === "") errors.mileage = "Mileage can't be negative";
  if (!v.color.trim()) errors.color = "Color is required";
  if (!v.plate.trim()) errors.plate = "Plate is required";
  return errors;
}

function toCar(v) {
  return {
    name: v.name.trim(),
    description: v.description.trim() || "No description yet.",
    brand: v.brand.trim(),
    year: Number(v.year),
    pricePerDay: Number(v.pricePerDay),
    transmission: v.transmission,
    fuel: v.fuel,
    seats: Number(v.seats),
    color: v.color.trim(),
    mileage: Number(v.mileage),
    location: v.location,
    plate: v.plate.trim(),
    status: v.status,
  };
}

// One controlled form used for both Create and Edit.
// The parent gives it a different `key` for each mode / car, so it starts fresh every time.
export default function CarForm({ car, busy, onSubmit, onCancel }) {
  const [values, setValues] = useState(
    car ? { ...EMPTY, ...Object.fromEntries(Object.entries(car).map(([k, v]) => [k, String(v)])) } : EMPTY,
  );
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit(toCar(values));
  }

  function text(name, label, type = "text") {
    return (
      <label className="form-field">
        <span>{label}</span>
        <input type={type} name={name} value={values[name]} onChange={handleChange} disabled={busy} />
        {errors[name] && <em className="field-error">{errors[name]}</em>}
      </label>
    );
  }

  function select(name, label, options) {
    return (
      <label className="form-field">
        <span>{label}</span>
        <select name={name} value={values[name]} onChange={handleChange} disabled={busy}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <form className="car-form" onSubmit={handleSubmit} noValidate>
      <h2>{car ? `Edit ${car.name}` : "Add a new car"}</h2>
      <div className="form-grid">
        {text("name", "Name (e.g. Toyota Camry)")}
        {text("brand", "Brand")}
        <label className="form-field wide">
          <span>Description</span>
          <textarea name="description" rows="2" value={values.description} onChange={handleChange} disabled={busy} />
        </label>
        {text("year", "Year", "number")}
        {text("pricePerDay", "Price per day ($)", "number")}
        {select("transmission", "Transmission", ["Automatic", "Manual"])}
        {select("fuel", "Fuel", ["Petrol", "Diesel", "Hybrid", "Electric"])}
        {text("seats", "Seats", "number")}
        {text("color", "Color")}
        {text("mileage", "Mileage (km)", "number")}
        {select("location", "Location", ["Almaty", "Astana", "Shymkent", "Aktau"])}
        {text("plate", "Plate number")}
        {select("status", "Status", ["available", "rented", "maintenance"])}
      </div>
      <div className="actions">
        <button type="submit" disabled={busy}>
          {busy ? "Saving…" : car ? "Save changes" : "Add car"}
        </button>
        <button type="button" className="secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      </div>
    </form>
  );
}
