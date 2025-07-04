import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import Card from '../components/Card';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight, faSliders, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from './AdvancedSearchPage.module.css';

const AdvancedSearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const searchTerm = searchParams.get('searchTerm') || "";
    const currentPage = parseInt(searchParams.get('page')) || 1;

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
    const [setLoadingPropertyTypes] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [pagination, setPagination] = useState({
        totalResults: 0,
        totalPages: 0
    });
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const toggleFilters = () => {
        setIsFiltersOpen(prev => !prev);
    };

    useEffect(() => {
        const fetchPropertyTypes = async () => {
            try {
                const { data } = await axios.get('https://boolbnb-be.onrender.com/api/property-types');
                setPropertyTypes(data);
            } catch (error) {
                console.error('Errore nel recupero delle tipologie:', error);
            } finally {
                setLoadingPropertyTypes(false);
            }
        };
        fetchPropertyTypes();
    }, []);

    useEffect(() => {
        const searchProperties = async () => {
            setIsSearching(true);
            const params = Object.fromEntries(searchParams.entries());
            params.page = currentPage;

            try {
                setLoading(true);
                const { data } = await axios.get('https://boolbnb-be.onrender.com/properties', { params });
                setProperties(data.results);
                setPagination({
                    totalResults: data.pagination.totalResults,
                    totalPages: data.pagination.totalPages
                });
            } catch (error) {
                console.error('Errore nella ricerca:', error);
            } finally {
                setLoading(false);
                setIsSearching(false);
            }
        };

        searchProperties();
    }, [searchParams, searchTerm, currentPage]);

    const handleFilterChange = (updatedFilters) => {
        const newParams = new URLSearchParams();

        Object.entries(updatedFilters).forEach(([key, value]) => {
            if (value !== "" && value != null) {
                newParams.set(key, value);
            }
        });

        if (searchTerm) {
            newParams.set('searchTerm', searchTerm);
        }

        setSearchParams(newParams);
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

    const handlePagination = (page) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', page);
        setSearchParams(newParams);
    };

    const handleResetAll = () => {
        setSearchParams(new URLSearchParams());
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>

                {/* Searchbar */}
                <SearchBar onSearch={handleSearch} searchTerm={searchTerm} />

                <p className={styles.subtitle}><h2 className="m-4">Begin your search for the perfect stay</h2></p>

                {/* Bottone per mostrare/nascondere i filtri */}
                <button className={styles.filtersAccordion} onClick={toggleFilters}>
                    {isFiltersOpen ? (
                        <>
                            Filters <FontAwesomeIcon icon={faTimes} className='mx-2' />
                        </>
                    ) : (
                        <>
                            Filters <FontAwesomeIcon icon={faSliders} className='mx-2' />
                        </>
                    )}
                </button>


                {/* Sezione filtri */}
                {window.innerWidth > 1024 || isFiltersOpen ? (
                    <div className={`${styles.sidebar} ${isFiltersOpen ? styles.show : ""}`}>
                        <h5 className='text-center my-3'>What kind of options do you need?</h5>
                        <Filters onFilterChange={handleFilterChange} filters={filters} propertyTypes={propertyTypes} />
                        <div className={styles.buttonContainer}>
                            <button onClick={handleResetAll} className={styles.resetButton}>
                                Reset
                            </button>
                        </div>
                    </div>
                ) : null}

                {/* Risultati di ricerca */}
                {loading || isSearching ? (
                    <p>Loading results...</p>
                ) : properties.length > 0 ? (
                    <div className={styles.propertiesGrid}>
                        {properties.map(property => (
                            <div key={property.id} className='px-4'>
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

                {/* Paginazione */}
                <div className={styles.pagination}>
                    <button
                        className={styles.prevNextArrow}
                        onClick={() => handlePagination(1)}
                        disabled={currentPage <= 1}
                    >
                        <FontAwesomeIcon icon={faAnglesLeft} />
                    </button>
                    <button
                        className={styles.prevNextBtn}
                        onClick={() => handlePagination(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {pagination.totalPages}</span>
                    <button
                        className={styles.prevNextBtn}
                        onClick={() => handlePagination(currentPage + 1)}
                        disabled={currentPage >= pagination.totalPages}
                    >
                        Next
                    </button>
                    <button
                        className={styles.prevNextArrow}
                        onClick={() => handlePagination(pagination.totalPages)}
                        disabled={currentPage >= pagination.totalPages}
                    >
                        <FontAwesomeIcon icon={faAnglesRight} />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default AdvancedSearchPage;
