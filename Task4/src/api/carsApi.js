// Thin wrapper around the provided fake API.
// The fake API itself (fakeApi.js) is NOT modified.
import {
  getItemsList,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "./fakeApi.js";

export const PAGE_SIZE = 8;

export function fetchCars({ page, search, sort }) {
  const params = new URLSearchParams({ page, limit: PAGE_SIZE, sort });
  if (search) params.set("search", search);
  return getItemsList("?" + params.toString());
}

export function fetchCar(id) {
  return getItem(id);
}

// createItem() only stores `name` and `description`,
// so we create first and then save the extra fields with updateItem().
export async function addCar(values) {
  const { name, description, ...details } = values;
  const created = await createItem({ name, description });
  try {
    return await updateItem(created.id, details);
  } catch (error) {
    error.carWasCreated = true;
    throw error;
  }
}

export function editCar(id, changes) {
  return updateItem(id, changes);
}

export function removeCar(id) {
  return deleteItem(id);
}
