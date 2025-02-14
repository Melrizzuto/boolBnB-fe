import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import Card from '../components/Card';

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
        <div className="container">
            <h1 className="my-4">Ricerca Avanzata</h1>
            
            <div className="mb-4">
                {/* Bottone per svuotare tutti i campi */}
                <button onClick={handleResetAll} className="btn btn-secondary mb-4">
                    Svuota tutti i campi
                </button>
            </div>

            <div className="mb-4">
                <SearchBar 
                    onSearch={setSearchTerm} 
                    searchTerm={searchTerm}  // Passa searchTerm come prop al componente SearchBar
                />
            </div>

            <div className="row mb-4 g-3">
                <Filters 
                    onFilterChange={setFilters} 
                    propertyTypes={propertyTypes} 
                />
            </div>

            {loading || isSearching ? (
                <p>Caricamento risultati...</p>  // Durante il caricamento o la ricerca
            ) : (searchTerm.trim() === "" && Object.values(filters).every(x => x === "" || x === null) && !loadingPropertyTypes) ? (
                <p>Dove vuoi alloggiare?</p>  // Se la ricerca è vuota e nessun filtro è applicato
            ) : properties.length > 0 ? (
                <div className="row d-flex justify-content-center">
                    {properties.map(property => (
                        <div key={property.id} className="col-md-4 mb-4">
                            <Card 
                                property={property} 
                                onClick={() => navigate(`/properties/${property.slug}`)}
                                slug={property.slug}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nessun immobile trovato</p>  // Quando non ci sono risultati dopo la ricerca
            )}
        </div>
    );
};

export default AdvancedSearchPage;