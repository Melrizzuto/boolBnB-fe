import { Link } from "react-router-dom";
import styles from "./Card.module.css";
import HeartRatingComponent from "./HeartRatingComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faMapMarkerAlt, faLandmark } from '@fortawesome/free-solid-svg-icons';


export default function Card({ property, slug }) {
    const imageUrl = `http://localhost:3000/public/${property.cover_img}`;

    return (
        <div className={`card ${styles.cardItem}`}>
            <img src={imageUrl} className={`card-img-top ${styles.cardImage}`} alt={property.title} />
            <div className={`card-body ${styles.cardBody}`}>
                <h5 className="card-title text-center">{property.title}</h5>
                <div className={`${styles.smallText} text-center`}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mx-2" /> {property.address}, {property.city}
                </div>
                <div className="d-flex gap-3">
                    <div className={styles.smallText}>
                        <FontAwesomeIcon icon={faLandmark} className="mx-2" /> Rooms: {property.num_rooms}
                    </div>
                    <div className={styles.smallText}>
                        <FontAwesomeIcon icon={faBed} className="mx-2" /> Beds: {property.num_beds}
                    </div>
                </div>
                <HeartRatingComponent slug={slug} />
                <Link to={`/properties/${property.slug}`} className={styles.btnGreen} state={{ slug: property.slug }}>
                    Details
                </Link>
            </div>
        </div>
    );
}
