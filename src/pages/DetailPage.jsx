import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./DetailPage.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRulerCombined, faHouse, faMapMarkerAlt, faStar, faStarHalfStroke, faStar as faStarEmpty, faEnvelope, faLandmark, faHeart } from '@fortawesome/free-solid-svg-icons';

// Funzione per generare stelle dinamiche in base al rating
const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <>
            {[...Array(fullStars)].map((_, index) => (
                <FontAwesomeIcon key={`full-${index}`} icon={faStar} className={styles.star} />
            ))}
            {halfStar && <FontAwesomeIcon icon={faStarHalfStroke} className={styles.star} />}
            {[...Array(emptyStars)].map((_, index) => (
                <FontAwesomeIcon key={`empty-${index}`} icon={faStarEmpty} className={styles.star} />
            ))}
        </>
    );
};

const DetailPage = () => {
    const { slug } = useParams();
    const [property, setProperty] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [likes, setLikes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3000/properties/${slug}`)
            .then(response => {
                setProperty(response.data.property);
                setLikes(response.data.property.likes);
                setLoading(false);
            })
            .catch(() => {
                setError("Error fetching property.");
                setLoading(false);
            });

        axios.get(`http://localhost:3000/properties/${slug}/reviews`)
            .then(response => {
                setReviews(response.data.reviews || []);
            })
            .catch(() => {
                setReviews([]);
            });
    }, [slug]);

    // Funzione per gestire il like
    const handleLike = () => {
        axios.post(`http://localhost:3000/properties/${slug}/like`)
            .then(response => {
                setLikes(response.data.property.likes); // Sincronizza lo stato locale con il backend
            })
            .catch(error => {
                console.error("Error updating likes:", error);
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!property) return <p>Property not found.</p>;

    const imageUrl = `http://localhost:3000/${property.image}`;

    return (
        <div className={styles.container}>

            {/* HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={styles.heroText}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.address}
                </div>
                <div className={styles.imageContainer}>
                    <img src={imageUrl} alt={property.title} className={styles.propertyImage} />
                </div>
                <div className={styles.actions}>
                    <button className={styles.reviewButton}>
                        <FontAwesomeIcon icon={faStar} /> Leave a Review
                    </button>
                    <button className={styles.contactButton}>
                        <FontAwesomeIcon icon={faEnvelope} /> Contact Host
                    </button>
                </div>
            </section>

            {/* PROPERTY DETAILS */}
            <section className={styles.detailsSection}>
                <div className={styles.info}>
                    <h1>{property.title}</h1>

                    {/* Likes Interaction */}
                    <div className={styles.likesContainer} onClick={handleLike}>
                        <FontAwesomeIcon icon={faHeart} className={styles.heartIcon} />
                        <span className={styles.likesCount}>{likes} is your favorite {property.property_type} ?</span>
                    </div>

                    <p className={styles.description}>{property.description}</p>
                </div>
                <div className={styles.specs}>
                    <ul>
                        <li><FontAwesomeIcon icon={faMapMarkerAlt} /> City: {property.city}</li>
                        <li><FontAwesomeIcon icon={faBath} /> Bathrooms: {property.num_bathrooms}</li>
                        <li><FontAwesomeIcon icon={faLandmark} /> Rooms: {property.num_rooms}</li>
                        <li><FontAwesomeIcon icon={faBed} /> Beds: {property.num_beds}</li>
                        <li><FontAwesomeIcon icon={faRulerCombined} /> Square Meters: {property.square_meters}</li>
                        <li><FontAwesomeIcon icon={faHouse} /> Type: {property.property_type}</li>

                    </ul>
                </div>
            </section>

            {/* REVIEWS */}
            <section className={styles.reviewsSection}>
                <h2>Reviews</h2>
                {reviews.length > 0 ? (
                    <ul>
                        {reviews.map((review, index) => (
                            <li key={index} className={styles.reviewItem}>
                                <strong>{review.user_name}</strong> | {renderStars(review.rating)} <br />
                                {review.review_text}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reviews available.</p>
                )}
            </section>

            {/* REVIEW FORM */}
            <section className={styles.reviewForm}>
                <h3>Leave a Review</h3>
                {/* COMPONENTE FORM REVIEWS */}
            </section>

            {/* CONTACT FORM */}
            <section className={styles.contactHost}>
                <h3>Contact the Host</h3>
                {/* COMPONENTE FORM CONTACT */}
            </section>

        </div>
    );
};

export default DetailPage;
