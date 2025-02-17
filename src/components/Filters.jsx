import React, { useState, useEffect } from "react";
import axios from "axios";

import styles from "./Filters.module.css";

const Filters = ({ onFilterChange, filters, propertyTypes }) => {
    
    const handleFilterChange = (name, value) => {
        // Aggiorna i filtri nel componente padre
        const updatedFilters = {
            ...filters,
            [name]: value === "" ? "" : value // Gestisce i valori vuoti per i numeri
        };
        onFilterChange(updatedFilters); // Passa i nuovi filtri al componente genitore
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        handleFilterChange(name, value); // Chiamata alla funzione di gestione dei filtri
    };
    return (
        <div className={styles.filtersContainer}>
        <label className={styles.filtersLabel}>Rooms number</label>
        <input
            type="number"
            name="minRooms"
            placeholder="Minimum rooms number"
            min="0"
            value={filters.minRooms || ""}
            onChange={handleChange}
            className={styles.filtersInput}
        />
        
        <label className={styles.filtersLabel}>Beds number</label>
        <input
            type="number"
            name="minBeds"
            placeholder="Minimum bed number"
            min="0"
            value={filters.minBeds || ""}
            onChange={handleChange}
            className={styles.filtersInput}
        />
        
        <label className={styles.filtersLabel}>Bathrooms number</label>
        <input
            type="number"
            name="minBathrooms"
            placeholder="Minimum bathrooms number"
            min="0"
            value={filters.minBathrooms || ""}
            onChange={handleChange}
            className={styles.filtersInput}
        />

        <label className={styles.filtersLabel}>Select a type</label>
        <select
            name="propertyType"
            value={filters.propertyType || ""}
            onChange={handleChange}
            className={styles.filtersInput} // Aggiungi la stessa classe
        >
            <option value="">All types</option>
            {propertyTypes.map(type => (
                <option key={type.id} value={type.name}>
                    {type.name}
                </option>
            ))}
        </select>
    </div>
    );
};

export default Filters;