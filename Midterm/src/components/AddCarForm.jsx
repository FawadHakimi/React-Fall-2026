import { useState } from "react";
import { addCar } from "../api/carsApi";

const TYPES = ["Sedan", "SUV", "Hatchback", "Sports", "Electric"];
const TRANSMISSIONS = ["Automatic", "Manual"];
const FUELS = ["Petrol", "Diesel", "Hybrid", "Electric"];

const emptyForm = {
  brand: "",
  model: "",
  year: "2022",
  type: "Sedan",
  transmission: "Automatic",
  fuel: "Petrol",
  seats: "5",
  pricePerDay: "",
  description: "",
  available: true,
};

function validate(form) {
  const errors = {};
  const maxYear = new Date().getFullYear() + 1;
  const year = Number(form.year);
  const seats = Number(form.seats);
  const price = Number(form.pricePerDay);

  if (!form.brand.trim()) errors.brand = "Brand is required.";
  if (!form.model.trim()) errors.model = "Model is required.";
  if (!Number.isInteger(year) || year < 1990 || year > maxYear) {
    errors.year = `Enter a year between 1990 and ${maxYear}.`;
  }
  if (!Number.isInteger(seats) || seats < 1 || seats > 9) {
    errors.seats = "Seats must be between 1 and 9.";
  }
  if (!form.pricePerDay || price <= 0) {
    errors.pricePerDay = "Enter a price greater than 0.";
  }
  return errors;
}

function Field({ label, error, children }) {
  return (
    <label className="filter-label">
      {label}
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

function AddCarForm({ onCancel, onAdded }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      return;
    }

    setStatus("submitting");
    setSubmitError("");

    try {
      const car = await addCar({
        brand: form.brand.trim(),
        model: form.model.trim(),
        year: Number(form.year),
        type: form.type,
        transmission: form.transmission,
        fuel: form.fuel,
        seats: Number(form.seats),
        pricePerDay: Number(form.pricePerDay),
        rating: 0,
        available: form.available,
        description: form.description.trim() || "No description provided.",
      });
      onAdded(car);
    } catch (err) {
      setSubmitError(err.message);
      setStatus("idle");
    }
  }

  return (
    <section className="detail">
      <h2 className="form-title">Add a new car</h2>

      <form className="detail-card" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <Field label="Brand" error={errors.brand}>
            <input
              className="field"
              name="brand"
              placeholder="e.g. Toyota"
              value={form.brand}
              onChange={handleChange}
            />
          </Field>

          <Field label="Model" error={errors.model}>
            <input
              className="field"
              name="model"
              placeholder="e.g. Camry"
              value={form.model}
              onChange={handleChange}
            />
          </Field>

          <Field label="Year" error={errors.year}>
            <input
              className="field"
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
            />
          </Field>

          <Field label="Price per day ($)" error={errors.pricePerDay}>
            <input
              className="field"
              type="number"
              name="pricePerDay"
              value={form.pricePerDay}
              onChange={handleChange}
            />
          </Field>

          <Field label="Type">
            <select
              className="field"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Transmission">
            <select
              className="field"
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
            >
              {TRANSMISSIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Fuel">
            <select
              className="field"
              name="fuel"
              value={form.fuel}
              onChange={handleChange}
            >
              {FUELS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Seats" error={errors.seats}>
            <input
              className="field"
              type="number"
              name="seats"
              value={form.seats}
              onChange={handleChange}
            />
          </Field>

          <div className="form-wide">
            <Field label="Description (optional)">
              <textarea
                className="field textarea"
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
              />
            </Field>
          </div>

          <label className="check-label form-wide">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
            />
            Available for rent
          </label>
        </div>

        {submitError && <p className="field-error">{submitError}</p>}

        <div className="form-actions">
          <button
            type="button"
            className="btn"
            onClick={onCancel}
            disabled={status === "submitting"}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Adding..." : "Add car"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddCarForm;