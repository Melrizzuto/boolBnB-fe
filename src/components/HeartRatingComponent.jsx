import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "./HeartRatingComponent.module.css";

const apiUrl = import.meta.env.VITE_API_URL;

function HeartRatingComponent({ slug }) {
    const [likes, setLikes] = useState(0);
    const [clicked, setClicked] = useState(false);
    

    useEffect(() => {
        if (!slug) return;

        axios
            .get(`http://localhost:3000/properties/${slug}`)
            .then((res) => {
                setLikes(res.data.property.likes);
            })
            .catch((err) => {
                console.log("Errore nel recupero dei dettagli della proprietà", err);
            });
    }, [slug]);

    function addLike() {
        setClicked(true);
        axios
            .patch(`${apiUrl}/${slug}/like`)
            .then((res) => {
                setLikes(res.data.property.likes);
            })
            .catch((err) => {
                console.log("Errore nell'inserimento del like", err);
            });

        // reset animazione dopo un breve intervallo
        setTimeout(() => setClicked(false), 300);
    }

    return (
        <button onClick={addLike} className={styles.likeButton}>
            <FontAwesomeIcon icon={faHeart} className={`${styles.heartIcon} ${clicked ? styles.clicked : ""}`} />
            <span className={styles.likesCount}>{likes}</span>
        </button>
    );
}

export default HeartRatingComponent;
