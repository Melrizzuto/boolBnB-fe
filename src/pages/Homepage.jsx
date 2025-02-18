import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Jumbotron from "../components/Jumbotron";
import Carousel from "../components/Carousel"; // Import del componente Carosello
import Card from "../components/Card"; // Import corretto del componente Card
import styles from "./Homepage.module.css"; // Import dello stile personalizzato

export default function Homepage() {
    // Stato per le proprietà e per il caricamento
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(9);
    const [showCard, setShowCard] = useState([]);
    const cardsRef = useRef(null);

    // Funzione per recuperare i dati dal server
    async function fetchProperties() {
        try {
            const response = await axios.get(`http://localhost:3000/properties`);
            if (response.data && Array.isArray(response.data.results)) {
                // Ordino le proprietà in base ai likes
                const sortedProperties = response.data.results.sort((a, b) => b.likes - a.likes);
                setProperties(sortedProperties);
            } else {
                console.error("Error: Response data is not an array", response.data);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    }

    // useEffect per chiamare l'API al caricamento della pagina
    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        if (visibleCount > 9) {
            const timer = setTimeout(() => {
                setShowCard(properties.slice(0, visibleCount));
            }, 100);  
            return () => clearTimeout(timer);
        } else {
            setShowCard(properties.slice(0, visibleCount));
        }
    }, [visibleCount, properties]);

    // Funzione per scrollare alla sezione delle cards
    const scrollToCards = () => {
        if (cardsRef.current) {
            const offset = 70;
            const targetPosition = cardsRef.current.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
    };

    const showAll = () => {
        setVisibleCount(properties.length);
    };

    const showLess = () => {
        setVisibleCount(9);
    };

    return (
        <div className={styles.mainContainer}>
            {/* Jumbotron */}
            <Jumbotron scrollToCards={scrollToCards} />

            {/* Sezione Carosello: Mostra SOLO le 15 più votate */}
            <div className={`${styles.myContainer} mt-2`}>
                <h1 className={styles.mainTitle}>Trending now</h1>
                {!loading && properties.length > 0 && (
                    <Carousel properties={properties.slice(0, 15)} />
                )}
            </div>

            {/* Sezione "we offer what you really need" */}
            <div className={styles.collectionSection}>
                <div className="container-lg">
                    <div className={styles.home_cta_content}>
                        <div className={styles.div_block_11}>
                            <h1 className={styles.heading_4}>We offer what you</h1>
                            <div className={styles.div_block_12}>
                                <img src="https://cdn.prod.website-files.com/64fc2a65f3e576a13b130e5c/65206ca9ce7fa29d3bf598da_Frame%201171276019.png" loading="lazy" alt="" className={styles.image_6} />
                            </div>
                            <h1 className={styles.heading_4}>really need</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h1 className={`pt-5 ${styles.mainTitle}`}>Boolbnb Collection</h1>
                <p className={styles.sectionDescription}>
                    Discover the best places for you!
                </p>
                <div className="container my-5" ref={cardsRef}>
                {loading ? (
                        <p className="text-center text-white">Loading properties...</p>
                    ) : properties.length > 0 ? (
                        <div className="row g-4">
                            {showCard.map((property) => (
                                <div 
                                    key={property.id} 
                                    className={`col-lg-4 col-md-6 col-sm-12 ${styles.cardContainer} ${showCard.length > 0 ? styles.visible : ""}`}>
                                    <Card property={property} slug={property.slug} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-white">No properties found.</p>
                    )}

                    {visibleCount < properties.length && (
                        <div>
                            <button onClick={showAll} className={styles.seeMoreandLessBtns}>
                                See all properties
                            </button>
                        </div>   
                    )}

                    {visibleCount > 9 && (
                        <div>
                            <button onClick={showLess} className={styles.seeMoreandLessBtns}>
                                See less
                            </button>
                        </div>   
                    )}
                </div>
            </div>
        </div>
    );
}

