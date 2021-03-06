import React from "react";
import Search from "@mui/icons-material/Search";

import "./SearchInput.scss";
const SearchInput = () => {
  return (
    <div className="search flex-row adjust">
      <input className="input  flex-row align-center" /> <Search />
    </div>
  );
};

export default SearchInput;
