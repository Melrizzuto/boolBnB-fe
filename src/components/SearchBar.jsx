import React, { useState, useEffect } from "react";

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Cerca immobili"
                />
            </div>
    );
};

export default SearchBar;