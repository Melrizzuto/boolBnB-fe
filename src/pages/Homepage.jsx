import axios from "axios";
import { useState, useEffect, useRef } from "react";

import Jumbotron from "../components/Jumbotron";
import Card from "../components/Card";

export default function Homepage() {

    //stato per le properties e per il caricamento
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const cardsRef = useRef(null); //creo un ref per le cards

    //funzione per recuperare i dati dal server
    function fetchProperties() {
        // effettuo richiesta GET per ottenere i dati dal server
        axios.get(`http://localhost:3000/properties`)
            .then((response) => {
                // ordino le properties in base al numero di likes
                const sortedProperties = response.data.results.sort((a, b) => b.likes - a.likes);

                // quando ottengo i dati aggiorno lo stato delle properties
                setProperties(sortedProperties);
                console.log(sortedProperties);
                setLoading(false);
            })
            .catch((error) => {
                // stampo eventuali errori in console
                console.error("Error loading data:", error);
            });
    }

    // useEffect per chiamare l'API al caricamento della pagina
    useEffect(() => {
        fetchProperties();
    }, []);

    return (
        <>
            <Jumbotron scrollToCards={() => cardsRef.current?.scrollIntoView({ behavior: "smooth" })} />
            <div ref={cardsRef}>
                {loading ? (
                    <p>Loading properties...</p>
                ) : properties && properties.length > 0 ? (
                    <div className="container-sm">
                        <div className="row d-flex justify-content-center">
                            {properties.map((property) => (
                                <div key={property.id} className="col-md-3 mb-4">
                                    <Card key={property.id} property={property} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>No properties found.</p>
                )}
            </div>
        </>
    )
}