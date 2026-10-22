import { useState } from "react";

// Controlled input: the text lives in state, the search itself runs on submit.
export default function SearchBar({ search, sort, onSearch, onSortChange }) {
  const [draft, setDraft] = useState(search);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(draft.trim());
  }

  function handleClear() {
    setDraft("");
    onSearch("");
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Search cars (e.g. Toyota)"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        aria-label="Search cars"
      />
      <button type="submit">Search</button>
      {(search || draft) && (
        <button type="button" className="secondary" onClick={handleClear}>
          Clear
        </button>
      )}
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort cars"
      >
        <option value="name">Name A → Z</option>
        <option value="name-desc">Name Z → A</option>
      </select>
    </form>
  );
}
