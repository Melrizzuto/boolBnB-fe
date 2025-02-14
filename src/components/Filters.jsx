import React, { useState, useEffect } from "react";

const Filters = ({ onFilterChange, propertyTypes }) => {
    const [filters, setFilters] = useState({
        minRooms: "",
        minBeds: "",
        minBathrooms: "",
        propertyType: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            // Per resettare il filtro se si seleziona "Tutte le tipologie"
            [name]: value === "" ? null : value
        }));
    };

    // Aggiorna i filtri immediatamente al cambiamento
    useEffect(() => {
        onFilterChange(filters);
    }, [filters]);

    return (
        <div className="filters">
            <input
                type="number"
                name="minRooms"
                placeholder="Min. stanze"
                min="0"
                value={filters.minRooms}
                onChange={handleChange}
            />
            <input
                type="number"
                name="minBeds"
                placeholder="Min. letti"
                min="0"
                value={filters.minBeds}
                onChange={handleChange}
            />
            <input
                type="number"
                name="minBathrooms"
                placeholder="Min. bagni"
                min="0"
                value={filters.minBathrooms}
                onChange={handleChange}
            />
            <select 
    name="propertyType" 
    value={filters.propertyType} 
    onChange={handleChange}
    className="form-select"
>
    <option value="">Tutte le tipologie</option>
    {propertyTypes && propertyTypes.length > 0 ? (
        propertyTypes.map(type => (
            <option key={type.id} value={type.name}>  {/* Usa "type.name" se il nome è "name" nel backend */}
                {type.name}
            </option>
        ))
    ) : (
        <option disabled>Caricamento tipologie...</option>  // Mostra un messaggio di caricamento
    )}
</select>
        </div>
    );
};

export default Filters;