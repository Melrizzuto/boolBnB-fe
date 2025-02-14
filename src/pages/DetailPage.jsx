import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./DetailPage.module.css";
import FormContact from "../components/FormContact";
import FormReviews from "../components/FormReviews";
import HeartRatingComponent from "../components/HeartRatingComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaStar, FaRegStar } from "react-icons/fa";
import { faBed, faBath, faRulerCombined, faHouse, faMapMarkerAlt, faEnvelope, faLandmark, faHeart } from '@fortawesome/free-solid-svg-icons';

// fn che disegna stelle
function drawStars(rating) {
    rating = parseFloat(rating);
    if (isNaN(rating) || rating < 1 || rating > 5) return <span>No rating</span>;

    let stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(getStar(rating, i));
    }
    return <span className={styles.starsContainer}>{stars}</span>;
}

// fn che ritorna le stelle corrette in base al voto
function getStar(rating, index) {
    return index <= Math.ceil(rating / 2) ? (
        <FaStar key={index} className={styles.star} />
    ) : (
        <FaRegStar key={index} className={styles.star} />
    );
}

const DetailPage = () => {
    const { slug } = useParams();
    const [property, setProperty] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Refs for scrolling
    const reviewFormRef = useRef(null);
    const contactFormRef = useRef(null);
    const descriptionProp = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:3000/properties/${slug}`)
            .then(response => {
                setProperty(response.data.property);
                setLoading(false);
            })
            .catch(() => {
                setError("Error fetching property.");
                setLoading(false);
            });

        axios.get(`http://localhost:3000/properties/${slug}/reviews`)
            .then(response => {
                console.log("Reviews data:", response.data);
                setReviews(response.data.reviews || []);
            })
            .catch(() => {
                setReviews([]);
            });
    }, [slug]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!property) return <p>Property not found.</p>;

    const imageUrl = `http://localhost:3000/${property.image}`;

    // scrolling stile
    function scrollToSection(ref) {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        }
    }

    return (
        <div className={styles.container}>

            {/* HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={styles.heroText}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.address}
                </div>
                <div className={styles.imageContainer} onClick={() => scrollToSection(descriptionProp)}>
                    <img src={imageUrl} alt={property.title} className={styles.propertyImage} />
                </div>
                <div className={styles.actions}>
                    <button className={styles.reviewButton} onClick={() => scrollToSection(reviewFormRef)}>
                        <FaStar /> Leave a Review
                    </button>
                    <button className={styles.contactButton} onClick={() => scrollToSection(contactFormRef)}>
                        <FontAwesomeIcon icon={faEnvelope} /> Contact Host
                    </button>
                </div>
            </section>

            {/* PROPERTY DETAILS */}
            <section className={styles.detailsSection} ref={descriptionProp}>
                <div className={styles.info}>
                    <h1 className="text-center">{property.title}</h1>

                    {/* Likes Interaction */}
                    <div className={styles.likesContainer}>
                        <p className={styles.likesCount}>Is your favorite {property.property_type}?</p>
                        <p> <HeartRatingComponent icon={faHeart} className={styles.heartIcon} slug={property?.slug} /></p>
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
                                {/* Riga superiore: Nome e stelle */}
                                <div className={styles.reviewHeader}>
                                    <strong>{review.user_name}</strong> | {drawStars(parseFloat(review.rating))}
                                </div>

                                {/* Riga inferiore: Testo della recensione */}
                                <p className={styles.reviewText}>{review.review_text}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reviews available.</p>
                )}
            </section>

            {/* REVIEW FORM + CONTACT FORM */}
            <div className={styles.formsContainer}>
                {/* REVIEW FORM */}
                <section className={styles.reviewForm} ref={reviewFormRef}>
                    <h3>Leave a Review</h3>
                    <FormReviews />
                </section>

                {/* CONTACT FORM */}
                <section className={styles.contactHost} ref={contactFormRef}>
                    <h3>Contact Host</h3>
                    <FormContact />
                </section>
            </div>

        </div>
    );
};

export default DetailPage;

