import React, { useState } from "react";
import "./styles.css";
import SearchIcon from "@mui/icons-material/Search";

function Search({ search, handleChange }) {
  return (
    <div className="search-flex">
      <SearchIcon sx={{ color: "var(--primary)", fontSize: "1.25rem" }} />
      <input
        className="search-input"
        placeholder="Search"
        value={search}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
}

export default Search;
