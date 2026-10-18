const TYPES = ["All", "Sedan", "SUV", "Hatchback", "Sports", "Electric"];
const TRANSMISSIONS = ["All", "Automatic", "Manual"];

function Filters({ filters, onChange, onReset }) {
  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    onChange({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  return (
    <div className="filters">
      <label className="filter-label search-field">
        Search
        <input
          className="field"
          type="search"
          name="search"
          placeholder="Brand or model, e.g. Toyota"
          value={filters.search}
          onChange={handleChange}
        />
      </label>

      <label className="filter-label">
        Type
        <select
          className="field"
          name="type"
          value={filters.type}
          onChange={handleChange}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-label">
        Transmission
        <select
          className="field"
          name="transmission"
          value={filters.transmission}
          onChange={handleChange}
        >
          {TRANSMISSIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-label">
        Sort by
        <select
          className="field"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleChange}
        >
          <option value="default">Recommended</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating-desc">Top rated</option>
          <option value="year-desc">Newest first</option>
        </select>
      </label>

      <label className="check-label">
        <input
          type="checkbox"
          name="availableOnly"
          checked={filters.availableOnly}
          onChange={handleChange}
        />
        Available only
      </label>

      <button type="button" className="btn" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

export default Filters;