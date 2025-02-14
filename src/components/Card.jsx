import { Link } from "react-router-dom";
import styles from "./Card.module.css";

import HeartRatingComponent from "./HeartRatingComponent";

export default function Card({ property, slug }) {

    const imageUrl = `http://localhost:3000/${property.image}`;
    console.log(property);


    return (
        <div className={`card ${styles.cardItem}`} style={{ width: "18rem", height: "400px" }}>
            <img src={imageUrl} className="card-img-top"
                alt={property.title}
                style={{ objectFit: "cover", height: "200px" }}
            />
            <div className="card-body" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <h5 className="card-title text-center">{property.title}</h5>
                <HeartRatingComponent slug={slug}/>
                {/* <p className="fw-lighter">{property.likes} Likes</p> */}
                <Link to={`/properties/${property.slug}`} className={` ${styles.btnGreen}`} state={{ slug: property.slug }}>See more</Link>
            </div>
        </div >
    )
}
