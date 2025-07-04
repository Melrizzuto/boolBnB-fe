import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./DetailPage.module.css";
import FormContact from "../components/FormContact";
import FormReviews from "../components/FormReviews";
import HeartRatingComponent from "../components/HeartRatingComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaStar, FaRegStar } from "react-icons/fa";
import { faBed, faBath, faRulerCombined, faHouse, faMapMarkerAlt, faEnvelope, faLandmark, faHeart, faArrowUp, faCity, faImages, faTimes, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

// Funzione per disegnare le stelle
function drawStars(rating) {
    rating = parseFloat(rating);
    if (isNaN(rating) || rating < 1 || rating > 5) return <span>No rating</span>;

    return (
        <span className={styles.starsContainer}>
            {[...Array(5)].map((_, index) => getStar(rating, index + 1))}
        </span>
    );
}


// Funzione che ritorna le stelle corrette in base al voto

function getStar(rating, index) {
    return index <= Math.ceil(rating) ? (
        <FaStar key={index} className={styles.star} />

    ) : (
        <FaRegStar key={`star-empty-${index}`} className={styles.star} />
    );
}


const DetailPage = () => {
    const [property, setProperty] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScroll, setShowScroll] = useState(false);
    const [showCarousel, setShowCarousel] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageSecondaryUrls, setImageSecondaryUrls] = useState([]);


    const location = useLocation();
    const mine_slug = location.state?.slug;

    // Refs per lo scrolling
    const reviewFormRef = useRef(null);
    const contactFormRef = useRef(null);
    const descriptionProp = useRef(null);

    // Effetto per recuperare i dati
    useEffect(() => {
        if (!mine_slug) {
            setError("Invalid property slug.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [propertyRes, reviewsRes, imagesRes] = await Promise.all([
                    axios.get(`https://boolbnb-be.onrender.com/properties/${mine_slug}`),
                    axios.get(`https://boolbnb-be.onrender.com/properties/${mine_slug}/reviews`),
                    axios.get(`https://boolbnb-be.onrender.com/properties/${mine_slug}/images`)
                ]);

                setProperty(propertyRes.data.property);
                setReviews(reviewsRes.data.reviews || []);
                setImageSecondaryUrls(imagesRes.data || []);
            } catch {
                setError("Error fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [mine_slug]);

    // Effetto per la gestione della freccia di scroll
    useEffect(() => {
        const handleScroll = () => {
            setShowScroll(window.scrollY > window.innerHeight / 2);
            //setShowScroll(document.documentElement.scrollTop > window.innerHeight);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!mine_slug) return;

        axios.get(`https://boolbnb-be.onrender.com/properties/${mine_slug}/images`)
            .then(res => {
                setImageSecondaryUrls(res.data.slice(0, 4));
            })
            .catch(err => {
                console.log("Error fetching secondary images:", err);
            });
    }, [mine_slug]);

    const scrollToSection = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const updateReviews = async () => {
        try {
            const response = await axios.get(`https://boolbnb-be.onrender.com/properties/${mine_slug}/reviews`);
            setReviews(response.data.reviews || []);
        } catch {
            setReviews([]);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!property) return <p>Property not found.</p>;


    const cover = `https://boolbnb-be.onrender.com/public/${property.cover_img}`;

    // creo un array temporaneo con la cover img e le 4 imamgini per il carosello
    const allImages = property?.cover_img
        ? [{ img_name: property.cover_img }, ...imageSecondaryUrls.slice(0, 4)]
        : imageSecondaryUrls.slice(0, 4);


    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % allImages.length
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + allImages.length) % allImages.length
        );
    };


    return (
        <div className={styles.container}>
            {/* HERO SECTION */}
            <section className={styles.heroSection}>

                {/* etichetta */}
                <div className={styles.heroText}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.title}
                </div>

                <div
                    className={styles.heroImagesContainer}
                >
                    {/* Contenitore per tutte le immagini */}
                    <div className={styles.gridContainer}>

                        {/* Immagine principale a sinistra */}
                        <div className={styles.mainImageContainer} onClick={() => setShowCarousel(true)}>
                            <img src={cover} //qui devo usare l'url di coverIMG
                                alt="Main"
                                className={styles.mainImage} />
                        </div>

                        {/* Griglia immagini più piccole a destra (2x2) */}
                        <div className={styles.smallImagesGrid}>
                            {imageSecondaryUrls.map((img, index) => (
                                <div key={index} className={styles.smallImageContainer}>
                                    <img src={`https://boolbnb-be.onrender.com/public/${img.img_name}`} alt={`Small ${index + 1}`} className={styles.smallImage} />
                                </div>
                            ))}
                            <div className={styles.showAllPhotosButton} onClick={() => setShowCarousel(true)}>
                                <FontAwesomeIcon icon={faImages} className={styles.photosIcon} />
                            </div>
                        </div>
                    </div>

                    {/* CAROSELLO OVERLAY */}
                    {showCarousel && allImages.length > 0 && (
                        <div className={styles.carouselOverlay}>
                            <div className={styles.carouselContainer}>
                                <FontAwesomeIcon icon={faTimes} className={styles.closeButton} onClick={() => setShowCarousel(false)} />
                                <FontAwesomeIcon icon={faArrowLeft} className={styles.arrowLeft} onClick={prevImage} />

                                <img
                                    src={`https://boolbnb-be.onrender.com/public/${allImages[currentImageIndex]?.img_name}`}
                                    alt={`Slide ${currentImageIndex + 1}`}
                                    className={styles.carouselImage}
                                />

                                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowRight} onClick={nextImage} />
                            </div>
                        </div>
                    )}

                </div>

                {/* bottoni */}
                <div className={styles.actions}>
                    <button className={styles.reviewButton} onClick={() => scrollToSection(reviewFormRef)}>
                        <FaStar /> Leave a Review
                    </button>
                    <button className={styles.contactButton} onClick={() => scrollToSection(contactFormRef)}>
                        <FontAwesomeIcon icon={faEnvelope} /> Contact Host
                    </button>
                </div>
            </section >

            {/* PROPERTY DETAILS */}
            < section className={styles.detailsSection} ref={descriptionProp} >
                <div className={styles.info}>
                    <h1 className="text-center">{property.title}</h1>

                    {/* Likes Interaction */}
                    <div className={styles.likesContainer}>
                        <p className={styles.likesCount}>Is your favorite {property.property_type}?</p>
                        <HeartRatingComponent icon={faHeart} className={styles.heartIcon} slug={mine_slug} />
                    </div>

                    <p className={styles.description}>{property.description || "No description available."}</p>
                </div>
                <div className={styles.specs}>
                    <ul>
                        <li><FontAwesomeIcon icon={faCity} /> City: {property.city}</li>
                        <li><FontAwesomeIcon icon={faMapMarkerAlt} /> Address: {property.address}</li>
                        <li><FontAwesomeIcon icon={faBath} /> Bathrooms: {property.num_bathrooms}</li>
                        <li><FontAwesomeIcon icon={faLandmark} /> Rooms: {property.num_rooms}</li>
                        <li><FontAwesomeIcon icon={faBed} /> Beds: {property.num_beds}</li>
                        <li><FontAwesomeIcon icon={faRulerCombined} /> Square Meters: {property.square_meters}</li>
                        <li><FontAwesomeIcon icon={faHouse} /> Type: {property.property_type}</li>

                    </ul>
                </div>
            </section >

            {/* REVIEWS */}
            < section className={styles.reviewsSection} >
                <h2>Reviews</h2>
                {
                    reviews.length > 0 ? (
                        <ul>
                            {reviews.map((review, index) => (
                                <li key={index} className={styles.reviewItem}>
                                    <div className={styles.reviewHeader}>
                                        <strong>{review.user_name}</strong> | {drawStars(parseFloat(review.rating))}
                                    </div>
                                    <p className={styles.reviewText}>{review.review_text}</p>
                                    <p className={styles.reviewDate}>Reviewed on {new Date(review.created_at).toLocaleDateString("it-IT")}
                                    </p>                            </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No reviews available.</p>
                    )
                }
            </section >

            {/* REVIEW FORM + CONTACT FORM */}
            < div className={styles.formsContainer} >
                <section className={styles.reviewForm} ref={reviewFormRef}>
                    <h3>Leave a Review</h3>
                    <FormReviews updateReviews={updateReviews} />
                </section>
                <section className={styles.contactHost} ref={contactFormRef}>
                    <h3>Contact Host</h3>
                    <FormContact />
                </section>
            </div >

            {/* SCROLL TO TOP BUTTON */}
            {
                showScroll && (
                    <div className={`${styles.scrollToTop} ${showScroll ? styles.visible : ""}`}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        <FontAwesomeIcon icon={faArrowUp} className={styles.arrowUp} />
                    </div>
                )
            }
        </div >
    );
};

export default DetailPage;
