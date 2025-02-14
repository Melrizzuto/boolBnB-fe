import React, { useState, useEffect } from "react";

import styles from "./Filters.module.css";

const Filters = ({ onFilterChange, filters, propertyTypes }) => {
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(prev => ({
            ...prev,
            // Per resettare il filtro se si seleziona "Tutte le tipologie"
            [name]: value === "" ? null : value
        }));
    };
    return (
        <div className={styles.filtersContainer}>
            <label htmlFor="type_name" className={styles.filtersLabel}>Rooms number</label>
            <input
                type="number"
                name="minRooms"
                placeholder="Minimum rooms number"
                min="0"
                value={filters.minRooms || ""}
                onChange={handleChange}
                className={styles.filtersInput}
            />
            <label htmlFor="type_name" className={styles.filtersLabel}>Beds number</label>
            <input
                type="number"
                name="minBeds"
                placeholder="Minimum bed number"
                min="0"
                value={filters.minBeds || ""}
                onChange={handleChange}
                className={styles.filtersInput}
            />
            <label htmlFor="type_name" className={styles.filtersLabel}>Bathrooms number</label>
            <input
                type="number"
                name="minBathrooms"
                placeholder="Minimum bathrooms number"
                min="0"
                value={filters.minBathrooms || ""}
                onChange={handleChange}
                className={styles.filtersInput}
            />

            <label htmlFor="type_name" className={styles.filtersLabel}>Select a type</label>
            <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleChange}
                className="form-select"
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