import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import styles from "./FormContact.module.css";

const initialData = {
    name: "",
    rating: "",
    check_in: null,
    check_out: null,
    comment: "",
}

const apiUrl = import.meta.env.VITE_API_URL;

function FormReviews() {
    const [formData, setFormData] = useState(initialData);
    const [isFormValid, setIsFormValid] = useState(null);
    const [errorMessage, setErrorMessage] = useState({});

    const { slug } = useParams();

    function handleInput(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) return;

        const newReview = {
            name: formData.name,
            rating: formData.rating,
            check_in: formData.check_in,
            check_out: formData.check_out,
            review: formData.comment,
        }

        axios
            .post(`${apiUrl}/properties/${slug}/reviews`, newReview)
            .then((res) => {
                console.log("Review sent successfully!");
                setFormData(initialData);
            })
            .catch((err) => {
                console.log("Error sending review", err);
            })
    }

    function validateForm() {
        let errorMessage = {};

        const checkInDate = new Date(formData.check_in);
        const checkOutDate = new Date(formData.check_out);
        const today = new Date();

        if (!formData.name || typeof formData.name !== 'string' || formData.name.trim() === '' || formData.name.length < 3) {
            errorMessage.name = "Enter a valid name";
        }
        if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
            errorMessage.rating = "Enter a valid rating";
        }
        if (!formData.check_in || today > checkInDate || checkInDate > checkOutDate) {
            errorMessage.check_in = "Enter a valid check-in date";
        }
        if (!formData.check_out || today > checkOutDate || checkInDate > checkOutDate) {
            errorMessage.check_out = "Enter a valid check-out date";
        }
        if (!formData.comment || formData.comment.length > 500) {
            errorMessage.comment = "Enter a valid comment";
        }

        if (Object.keys(errorMessage).length > 0) {
            setErrorMessage(errorMessage);
            return false;
        }

        setIsFormValid(true);
        return true;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    name="name"
                    onChange={handleInput}
                />
                {errorMessage.name && <p className={styles.errorMessage}>{errorMessage.name}</p>}
            </div>
            <div>
                <label htmlFor="rating">Rating</label>
                <input
                    type="number"
                    name="rating"
                    onChange={handleInput}
                />
                {errorMessage.rating && <p className={styles.errorMessage}>{errorMessage.rating}</p>}
            </div>
            <div>
                <label htmlFor="check_in">Check-in</label>
                <input
                    type="date"
                    name="check_in"
                    value={formData.check_in}
                    onChange={handleInput}
                />
                {errorMessage.check_in && <p className={styles.errorMessage}>{errorMessage.check_in}</p>}
            </div>
            <div>
                <label htmlFor="check_out">Check-out</label>
                <input
                    type="date"
                    name="check_out"
                    value={formData.check_out}
                />
                {errorMessage.check_out && <p className={styles.errorMessage}>{errorMessage.check_out}</p>}
            </div>
            <div>
                <label htmlFor="comment">Lascia la tua recensione</label>
                <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInput}
                >
                </textarea>
                {errorMessage.comment && <p className={styles.errorMessage}>{errorMessage.comment}</p>}
            </div>
            <button type="submit">Send Review</button>
        </form>
    )
}

export default FormReviews;