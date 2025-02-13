import React, { useState, useEffect } from "react";

const Filters = ({onFilterChange, propertyTypes}) => {

    const [filters, setFilters] = useState({
        minRooms: "",
        minBeds: "",
        minBathrooms: "",
        propertyType: ""
    });

    useEffect(() => {
        onFilterChange(filters);
    }, [filters]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="filters">
        <input
          type="number"
          name="minRooms"
          placeholder="Min. stanze"
          min="0"
          onChange={handleChange}
        />
        <input
          type="number"
          name="minBeds"
          placeholder="Min. letti"
          min="0"
          onChange={handleChange}
        />
        <input
          type="number"
          name="minBathrooms"
          placeholder="Min. bagni"
          min="0"
          onChange={handleChange}
        />
        <select name="propertyType" onChange={handleChange}>
          <option value="">Tutte le tipologie</option>
          {propertyTypes.map(type => (
            <option key={type.id} value={type.type_name}>
              {type.type_name}
            </option>
          ))}
        </select>
      </div>
    );
};

export default Filters;