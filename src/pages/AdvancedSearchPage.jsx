import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import Card from '../components/Card';

import styles from './AdvancedSearchPage.module.css'; // Importa il CSS Module

const AdvancedSearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        minRooms: '',
        minBeds: '',
        minBathrooms: '',
        propertyType: ''
    });

    const [propertyTypes, setPropertyTypes] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPropertyTypes, setLoadingPropertyTypes] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    // Fetch property types
    useEffect(() => {
        const fetchPropertyTypes = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/api/property-types');
                console.log(data);
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
            setIsSearching(true);  // Inizia la ricerca

            const params = {
                searchTerm: searchTerm.trim(),
                ...filters
            };

            // Se non ci sono né term di ricerca né filtri, non fare la ricerca
            if (searchTerm.trim() === "" && Object.values(filters).every(x => x === "" || x === null)) {
                setProperties([]);
                setIsSearching(false);  // Fine della ricerca, nessun risultato
                return;
            }

            try {
                setLoading(true);
                const { data } = await axios.get('http://localhost:3000/properties', { params });
                setProperties(data.results);
            } catch (error) {
                console.error('Errore nella ricerca:', error);
            } finally {
                setLoading(false);
                setIsSearching(false);  // Fine della ricerca
            }
        };

        // Avvia la ricerca non appena i filtri o il termine di ricerca cambiano
        searchProperties();
    }, [searchTerm, filters]);

    // Funzione per svuotare tutti i campi (sia barra di ricerca che filtri)
    const handleResetAll = () => {
        setSearchTerm('');  // Resetta la barra di ricerca
        setFilters({
            minRooms: '',
            minBeds: '',
            minBathrooms: '',
            propertyType: ''
        });  // Resetta i filtri
    };

    return (
        <div className={styles.container}>

            {/* Sezione principale con barra di ricerca e risultati */}
            <div className={styles.mainContent}>
                <SearchBar
                    onSearch={setSearchTerm}
                    searchTerm={searchTerm}
                />
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
                    onFilterChange={setFilters}
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