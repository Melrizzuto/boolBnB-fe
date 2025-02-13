import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Cerca città o indirizzo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Cerca immobili"
                />
                <button 
                    type="submit" 
                    className="btn btn-primary"
                >
                    Cerca
                </button>
            </div>
        </form>
    );
};

export default SearchBar;