import React, { useState, useEffect } from "react";

const SearchBar = ({ onSearch, searchTerm }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm.trim());
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, onSearch]);

    return (
        <div className="input-group">
            <input
                type="text"
                className="form-control"
                placeholder="Cerca città o indirizzo..."
                value={searchTerm}  // Collegato allo stato searchTerm del componente parent
                onChange={(e) => onSearch(e.target.value)} // Quando cambia, aggiorna lo stato nel componente principale
                aria-label="Cerca immobili"
            />
        </div>
    );
};

export default SearchBar;