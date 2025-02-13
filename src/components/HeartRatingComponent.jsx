import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

const apiUrl = import.meta.env.VITE_API_URL;

function HeartRatingComponent() {
    const [likes, setLikes] = useState(0);

    const { slug } = useParams();

    useEffect(() => {
        axios
            .get(`${apiUrl}/${slug}`)
            .then((res) => {
                setLikes(res.data.property.likes)
            })
            .catch((err) => {
                console.log("Errore nel recupero dei dettagli della proprietà", err)
            });
    }, [slug]);

    function addLike() {
        axios
            .patch(`${apiUrl}/${slug}/like`)
            .then((res) => {
                setLikes(res.data.property.likes);
                console.log("Like aggiunto con successo!", updateLikes);
            })
            .catch((err) => {
                console.log("Errore nell'inserimento del like", err)
            })
    }

    return (
        <button onClick={addLike}>
            <FontAwesomeIcon icon={faHeart} />
            {likes}
        </button>
    )
}
export default HeartRatingComponent;