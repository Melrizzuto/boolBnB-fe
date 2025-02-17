import { Link } from "react-router-dom";
import styles from "./Card.module.css";
import HeartRatingComponent from "./HeartRatingComponent";

export default function Card({ property, slug }) {
    const imageUrl = `http://localhost:3000/${property.image}`;

    return (
        <div className={`card ${styles.cardItem}`}>
            <img src={imageUrl} className={`card-img-top ${styles.cardImage}`} alt={property.title} />
            <div className={`card-body ${styles.cardBody}`}>
                <h5 className="card-title text-center">{property.title}</h5>
                <HeartRatingComponent slug={slug} />
                <Link to={`/properties/${property.slug}`} className={styles.btnGreen} state={{ slug: property.slug }}>
                    See more
                </Link>
            </div>
        </div>
    );
}
