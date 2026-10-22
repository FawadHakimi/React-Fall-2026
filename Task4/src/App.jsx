import { useState, useEffect } from "react";
import {
  fetchCars,
  fetchCar,
  addCar,
  editCar,
  removeCar,
} from "./api/carsApi.js";
import SearchBar from "./components/SearchBar.jsx";
import CarList from "./components/CarList.jsx";
import Pagination from "./components/Pagination.jsx";
import CarDetails from "./components/CarDetails.jsx";
import CarForm from "./components/CarForm.jsx";
import Notice from "./components/Notice.jsx";

export default function App() {
  // ---- list state ----
  const [cars, setCars] = useState([]);
  const [listStatus, setListStatus] = useState("loading"); // loading | error | success
  const [listError, setListError] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [reloadKey, setReloadKey] = useState(0);

  // ---- selected item / details state ----
  const [selectedId, setSelectedId] = useState(null);
  const [panel, setPanel] = useState("details"); // details | create | edit
  const [details, setDetails] = useState(null);
  const [detailsStatus, setDetailsStatus] = useState("idle"); // idle | loading | error | success
  const [detailsError, setDetailsError] = useState("");
  const [detailsAttempt, setDetailsAttempt] = useState(0);

  // ---- actions state ----
  const [busy, setBusy] = useState(null); // null or { kind, label }
  const [message, setMessage] = useState(null); // null or { type, text }

  // Load the list whenever page / search / sort changes, or Reload is pressed.
  useEffect(() => {
    let ignore = false; // becomes true when this effect run is outdated

    setListStatus("loading");
    setListError("");

    fetchCars({ page, search, sort })
      .then((result) => {
        if (ignore) return;
        // e.g. we deleted the last car on the last page -> go one page back
        if (result.data.length === 0 && result.page > 1) {
          setPage(Math.max(1, result.totalPages));
          return;
        }
        setCars(result.data);
        setTotal(result.total);
        setTotalPages(Math.max(1, result.totalPages));
        setListStatus("success");
      })
      .catch((error) => {
        if (ignore) return;
        setListError(error.message);
        setListStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [page, search, sort, reloadKey]);

  // Load details of the selected car. Quick switching A -> B -> C must only ever show C.
  useEffect(() => {
    if (selectedId === null) return;

    let ignore = false;

    setDetails(null);
    setDetailsStatus("loading");
    setDetailsError("");

    fetchCar(selectedId)
      .then((car) => {
        if (ignore) return;
        setDetails(car);
        setDetailsStatus("success");
      })
      .catch((error) => {
        if (ignore) return;
        setDetailsError(error.message);
        setDetailsStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [selectedId, detailsAttempt]);

  // ---- handlers ----
  function handleSearch(text) {
    setSearch(text);
    setPage(1);
  }

  function handleSortChange(value) {
    setSort(value);
    setPage(1);
  }

  function handleSelect(id) {
    setSelectedId(id);
    setPanel("details");
  }

  function handleBackToList() {
    setSelectedId(null);
    setPanel("details");
  }

  // Replace one car in the list and (if it is open) in the details panel — matched by ID.
  function applyUpdatedCar(updated) {
    setCars((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setDetails((prev) => (prev && prev.id === updated.id ? updated : prev));
  }

  async function handleStatusChange(car, nextStatus) {
    if (busy) return; // prevent conflicting actions

    const id = car.id; // capture the ID NOW, the user may select another car while we wait
    const name = car.name;
    setBusy({ kind: "status", label: `Updating ${name}…` });
    setMessage(null);

    try {
      const updated = await editCar(id, { status: nextStatus });
      applyUpdatedCar(updated); // goes to the car with the captured ID
      setMessage({ type: "success", text: `${name} is now ${nextStatus}.` });
    } catch (error) {
      setMessage({ type: "error", text: `Could not update ${name}: ${error.message}` });
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete(car) {
    if (busy) return;

    const id = car.id;
    const name = car.name;
    setBusy({ kind: "delete", label: `Deleting ${name}…` });
    setMessage(null);

    try {
      await removeCar(id);
      setSelectedId((current) => (current === id ? null : current));
      setReloadKey((k) => k + 1);
      setMessage({ type: "success", text: `${name} was deleted.` });
    } catch (error) {
      setMessage({ type: "error", text: `Could not delete ${name}: ${error.message}` });
    } finally {
      setBusy(null);
    }
  }

  async function handleCreate(values) {
    if (busy) return;

    setBusy({ kind: "save", label: "Adding car…" });
    setMessage(null);

    try {
      const created = await addCar(values);
      setReloadKey((k) => k + 1);
      setSelectedId(created.id);
      setPanel("details");
      setMessage({ type: "success", text: `${created.name} was added.` });
    } catch (error) {
      if (error.carWasCreated) {
        setReloadKey((k) => k + 1);
        setPanel("details");
        setMessage({
          type: "error",
          text: `The car was created, but saving its details failed (${error.message}). Open it and press Edit to finish.`,
        });
      } else {
        setMessage({ type: "error", text: `Could not add the car: ${error.message}` });
      }
    } finally {
      setBusy(null);
    }
  }

  async function handleEdit(values) {
    if (busy) return;

    const id = selectedId; // capture
    setBusy({ kind: "save", label: "Saving changes…" });
    setMessage(null);

    try {
      const updated = await editCar(id, values);
      applyUpdatedCar(updated);
      setPanel("details");
      setMessage({ type: "success", text: `${updated.name} was updated.` });
    } catch (error) {
      setMessage({ type: "error", text: `Could not save changes: ${error.message}` });
    } finally {
      setBusy(null);
    }
  }

  const saving = busy?.kind === "save";
  const panelOpen = panel !== "details" || selectedId !== null;

  return (
    <div className="app">
      <header className="topbar">
        <h1>🚗 Car Fleet Manager</h1>
        <div className="topbar-actions">
          <button
            type="button"
            className="secondary"
            disabled={Boolean(busy)}
            onClick={() => setReloadKey((k) => k + 1)}
          >
            ↻ Reload
          </button>
          <button
            type="button"
            disabled={Boolean(busy)}
            onClick={() => setPanel("create")}
          >
            + Add car
          </button>
        </div>
      </header>

      {busy && <Notice type="info">{busy.label}</Notice>}
      {message && (
        <Notice type={message.type} onClose={() => setMessage(null)}>
          {message.text}
        </Notice>
      )}

      <main className={`layout ${panelOpen ? "panel-open" : ""}`}>
        <section className="list-column">
          <SearchBar
            search={search}
            sort={sort}
            onSearch={handleSearch}
            onSortChange={handleSortChange}
          />
          <CarList
            cars={cars}
            status={listStatus}
            error={listError}
            search={search}
            selectedId={selectedId}
            onSelect={handleSelect}
            onRetry={() => setReloadKey((k) => k + 1)}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            disabled={listStatus === "loading"}
            onPageChange={setPage}
          />
        </section>

        <section className="panel-column">
          <button type="button" className="secondary back-button" onClick={handleBackToList}>
            ← Back to list
          </button>

          {panel === "create" && (
            <CarForm
              key="create"
              busy={saving}
              onSubmit={handleCreate}
              onCancel={() => setPanel("details")}
            />
          )}

          {panel === "edit" && details && (
            <CarForm
              key={`edit-${details.id}`}
              car={details}
              busy={saving}
              onSubmit={handleEdit}
              onCancel={() => setPanel("details")}
            />
          )}

          {panel === "details" && selectedId === null && (
            <p className="state-box">Select a car from the list to see its details.</p>
          )}

          {panel === "details" && selectedId !== null && (
            <CarDetails
              key={selectedId}
              car={details}
              status={detailsStatus}
              error={detailsError}
              busy={busy}
              onRetry={() => setDetailsAttempt((n) => n + 1)}
              onStatusChange={handleStatusChange}
              onEdit={() => setPanel("edit")}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}
