import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import Card from '../components/Card';

const AdvancedSearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [filters, setFilters] = useState({
        minRooms: '',
        minBeds: '',
        minBathrooms: '',
        propertyType: ''
    });
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch property types
    useEffect(() => {
        const fetchPropertyTypes = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/api/properties-types');
                setPropertyTypes(data.types);
            } catch (error) {
                console.error('Errore nel recupero delle tipologie:', error);
            }
        };
        fetchPropertyTypes();
    }, []);

    // Search properties
    useEffect(() => {
        const searchProperties = async () => {
            try {
                setLoading(true);
                const params = {
                    searchTerm,
                    ...filters
                };

                const { data } = await axios.get('http://localhost:3000/properties', { params });
                setProperties(data.results);
            } catch (error) {
                console.error('Errore nella ricerca:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(searchProperties, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, filters]);

    return (
        <div className="container">
            <h1 className="my-4">Ricerca Avanzata</h1>
            
            <div className="mb-4">
                <SearchBar onSearch={setSearchTerm} />
            </div>

            <div className="row mb-4 g-3">
                <Filters 
                    onFilterChange={setFilters} 
                    propertyTypes={propertyTypes} 
                />
            </div>

            {loading ? (
                <p>Caricamento risultati...</p>
            ) : properties.length > 0 ? (
                <div className="row d-flex justify-content-center">
                    {properties.map(property => (
                        <div key={property.id} className="col-md-4 mb-4">
                            <Card 
                                property={property} 
                                onClick={() => navigate(`/properties/${property.slug}`)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nessun immobile trovato</p>
            )}
        </div>
    );
};

export default AdvancedSearchPage;