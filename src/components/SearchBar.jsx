import { useState } from "react";
import { FaSearch } from "react-icons/fa"; 

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSearch} className="d-flex justify-content-center mb-4">
      <div className="input-group" style={{ maxWidth: "500px", width: "100%" }}>
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="🔍 Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          <FaSearch className="me-1" /> Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
