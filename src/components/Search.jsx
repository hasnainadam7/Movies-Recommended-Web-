import React from "react";

export const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="./search.svg" alt="Search" />
        <input
          type="text"
          name=""
          id=""
          placeholder="Search through thousands of movies"
   
          onChange={(e)=> setSearchTerm(e.target.value)}
          value={searchTerm}
        />
      </div>
    </div>
  );


};
