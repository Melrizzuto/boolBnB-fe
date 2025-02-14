import React, { useState, useEffect } from "react";

import styles from "./SearchBar.module.css";

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
                className={styles.searchInput}
                placeholder="Search by city or address..."
                value={searchTerm}  // Collegato allo stato searchTerm del componente parent
                onChange={(e) => onSearch(e.target.value)} // Quando cambia, aggiorna lo stato nel componente principale
                aria-label="Cerca immobili"
            />
        </div>
    );
};

export default SearchBar;