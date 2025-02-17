import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import Card from '../components/Card';
import styles from './AdvancedSearchPage.module.css'; // Importa il CSS Module

const AdvancedSearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const searchTerm = searchParams.get('searchTerm') || "";

    const [filters, setFilters] = useState({
        minRooms: searchParams.get('minRooms') || '',
        minBeds: searchParams.get('minBeds') || '',
        minBathrooms: searchParams.get('minBathrooms') || '',
        propertyType: searchParams.get('propertyType') || ''
    });

    useEffect(() => {
        setFilters({
            minRooms: searchParams.get('minRooms') || '',
            minBeds: searchParams.get('minBeds') || '',
            minBathrooms: searchParams.get('minBathrooms') || '',
            propertyType: searchParams.get('propertyType') || ''
        });
    }, [searchParams]);

    const [propertyTypes, setPropertyTypes] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPropertyTypes, setLoadingPropertyTypes] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    
    
    // Fetch property types
    useEffect(() => {
        const fetchPropertyTypes = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/api/property-types');
                setPropertyTypes(data);
            } catch (error) {
                console.error('Errore nel recupero delle tipologie:', error);
            } finally {
                setLoadingPropertyTypes(false);
            }
        };
        fetchPropertyTypes();
    }, []);

    // Search properties
    useEffect(() => {
        const searchProperties = async () => {
            setIsSearching(true);
            const params = Object.fromEntries(searchParams.entries());
        
            try {
                setLoading(true);
                const { data } = await axios.get('http://localhost:3000/properties', { params });
                setProperties(data.results);
            } catch (error) {
                console.error('Errore nella ricerca:', error);
            } finally {
                setLoading(false);
                setIsSearching(false);
            }
        };
    
            searchProperties();
        
    }, [searchParams]);
    const handleFilterChange = (updatedFilters) => {
        const newParams = new URLSearchParams();
        
        // Aggiungi solo i filtri con valori validi
        Object.entries(updatedFilters).forEach(([key, value]) => {
            if (value !== "" && value != null) { // Esclude stringhe vuote e null/undefined
                newParams.set(key, value);
            }
        });
    
        // Mantieni il searchTerm solo se presente
        if (searchTerm) {
            newParams.set('searchTerm', searchTerm);
        }
    
        // Aggiorna i searchParams
        setSearchParams(newParams);  // Questo aggiornerà immediatamente l'URL con i nuovi filtri
    };
    const handleSearch = (newSearchTerm) => {
        const newParams = new URLSearchParams(searchParams);
        if (newSearchTerm.trim()) {
            newParams.set('searchTerm', newSearchTerm);
        } else {
            newParams.delete('searchTerm');
        }
        setSearchParams(newParams);
    };

    // Funzione per svuotare tutti i campi (sia barra di ricerca che filtri)
    const handleResetAll = () => {
        setSearchParams(new URLSearchParams());
    }

    return (
        <div className={styles.container}>
        <div className={styles.mainContent}>
            <SearchBar onSearch={handleSearch} searchTerm={searchTerm} />
            <p className={styles.subtitle}>Begin your search for the perfect stay</p>

            {loading || isSearching ? (
                <p>Loading results...</p>
            ) : properties.length > 0 ? (
                <div className={styles.propertiesGrid}>
                    {properties.map(property => (
                        <div key={property.id}>
                            <Card
                                property={property}
                                onClick={() => navigate(`/properties/${property.slug}`)}
                                slug={property.slug}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p>No properties found. Try adjusting your search filters!</p>
            )}
        </div>

        {/* Sidebar con i filtri */}
        <div className={styles.sidebar}>
            <Filters
                onFilterChange={handleFilterChange}
                filters={filters}
                propertyTypes={propertyTypes}
            />
            <div className={styles.buttonContainer}>
                <button onClick={handleResetAll} className={styles.resetButton}>
                    Reset
                </button>
            </div>
        </div>
    </div>
    );
}

export default AdvancedSearchPage;