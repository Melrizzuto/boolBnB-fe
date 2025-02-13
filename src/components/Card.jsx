import { Link } from "react-router-dom";

export default function Card({ property }) {

    const imageUrl = `http://localhost:3000/${property.image}`;
    console.log(property);


    return (
        <div className="card" style={{ width: "18rem", height: "370px" }}>
            <img src={imageUrl} className="card-img-top"
                alt={property.title}
                style={{ objectFit: "cover", height: "200px" }}
            />
            <div className="card-body" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <h5 className="card-title text-center">{property.title}</h5>
                <p className="fw-lighter">{property.total_votes} Likes</p>
                <Link to={`/properties/${property.slug}`} className="btn btn-primary">See more</Link>
            </div>
        </div >
    )
}
