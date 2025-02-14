import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./FormContact&Reviews.module.css";
import { FaStar } from "react-icons/fa";

const initialData = {
    user_name: "",
    user_email: "",
    rating: 0,
    start_date: "",
    end_date: "",
    review_text: "",
};

const apiUrl = import.meta.env.VITE_API_URL;

function FormReviews({ updateReviews }) {
    const [reviews, setReviews] = useState([]);
    const [formData, setFormData] = useState(initialData);
    const [errorMessage, setErrorMessage] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const { slug } = useParams();

    const defaultPlaceholders = {
        user_name: "Enter your full name",
        user_email: "Enter your email",
        review_text: "Write your review",
        start_date: "YYYY-MM-DD",
        end_date: "YYYY-MM-DD"
    };

    const hoverPlaceholders = {
        user_name: "Min. 3 characters",
        user_email: "Email must contain '@'",
        review_text: "Message must be between 10 and 500 characters",
        start_date: "Enter a valid date (YYYY-MM-DD)",
        end_date: "Must be after check-in"
    };

    const [placeholders, setPlaceholders] = useState(defaultPlaceholders);

    function handleInput(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value || "",
        }));
    }

    function handleMouseEnter(e) {
        const field = e.target.name;
        setPlaceholders(prev => ({
            ...prev,
            [field]: hoverPlaceholders[field]
        }));
    }

    function handleMouseLeave(e) {
        const field = e.target.name;
        setPlaceholders(prev => ({
            ...prev,
            [field]: defaultPlaceholders[field]
        }));
    }
    // Funzione per recuperare le recensioni dal backend
    //function fetchReviews() {
    //    axios.get(`${apiUrl}/${slug}/reviews`)
    //        .then(response => setReviews(response.data)) // Aggiorna le recensioni nello stato
    //        .catch(error => console.error("Errore nel recupero delle recensioni:", error));
    //}

    // Recupera le recensioni al caricamento della pagina
    //useEffect(() => {
    //    fetchReviews();
    //}, [slug]);

    function handleStarClick(rating) {
        setFormData(prev => ({
            ...prev,
            rating: rating,
        }));
    }

    function handleReset() {
        setFormData(initialData);
        setErrorMessage({});
        setSuccessMessage("");
    }

    function validateDate(date) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(date);
    }

    function validateForm() {
        let errors = {};
        const today = new Date().toISOString().split("T")[0];

        if (!formData.user_name || formData.user_name.length < 3) {
            errors.user_name = "Name must be at least 3 characters";
        }
        if (!formData.user_email.includes("@")) {
            errors.user_email = "Email must contain '@'";
        }
        if (formData.review_text.length < 10 || formData.review_text.length > 500) {
            errors.review_text = "Message must be between 10 and 500 characters";
        }
        if (!validateDate(formData.start_date) || formData.start_date > today) {
            errors.start_date = "Check-in date must be today or earlier";
        }
        if (!validateDate(formData.end_date) || formData.end_date <= formData.start_date) {
            errors.end_date = "Check-out must be after check-in";
        }
        if (formData.rating < 1 || formData.rating > 5) {
            errors.rating = "Please select a rating between 1 and 5";
        }
        setErrorMessage(errors);
        return Object.keys(errors).length === 0;
    }


    function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) return;

        axios.post(`${apiUrl}/${slug}/reviews`, formData, {
            headers: { "Content-Type": "application/json" }
        })
            .then(() => {
                setSuccessMessage("Review submitted successfully!");
                setFormData(initialData);
                updateReviews(); // Aggiorna le recensioni dopo l'invio
                setTimeout(() => setSuccessMessage(""), 3000);
            })
            .catch((err) => {
                console.error("❌ Error sending review:", err.response ? err.response.data : err.message);
                setErrorMessage({ general: "Error submitting the review. Please try again." });
            });
    }
    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            {errorMessage.general && <p className={styles.errorMessage}>{errorMessage.general}</p>}
            {/* Prima riga: Nome ed Email */}
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="user_name">Name</label>
                    <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        placeholder={placeholders.user_name}
                        onChange={handleInput}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />
                    {errorMessage.user_name && <p className={styles.errorMessage}>{errorMessage.user_name}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="user_email">Email</label>
                    <input
                        type="email"
                        name="user_email"
                        value={formData.user_email}
                        placeholder={placeholders.user_email}
                        onChange={handleInput}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />
                    {errorMessage.user_email && <p className={styles.errorMessage}>{errorMessage.user_email}</p>}
                </div>
            </div>

            {/* Seconda riga: Check-in e Check-out */}
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="start_date">Check-in</label>
                    <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInput}
                    />
                    {errorMessage.start_date && <p className={styles.errorMessage}>{errorMessage.start_date}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="end_date">Check-out</label>
                    <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInput}
                    />
                    {errorMessage.end_date && <p className={styles.errorMessage}>{errorMessage.end_date}</p>}
                </div>
            </div>


            <div>
                <label>Rating</label>
                <div className={styles.starRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            className={`${styles.star} ${formData.rating >= star ? styles.selectedStar : ""}`}
                            onClick={() => handleStarClick(star)}
                        />
                    ))}
                </div>
                {errorMessage.rating && <p className={styles.errorMessage}>{errorMessage.rating}</p>}
            </div>

            <div>
                <label htmlFor="review_text">Leave your review</label>
                <textarea
                    name="review_text"
                    value={formData.review_text}
                    placeholder={placeholders.review_text}
                    onChange={handleInput}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                />
                {errorMessage.review_text && <p className={styles.errorMessage}>{errorMessage.review_text}</p>}
            </div>

            <div className={styles.buttonContainer}>
                <button className={styles.submitButton} type="submit">Send</button>
                <button className={styles.resetButton} type="button" onClick={handleReset}>Reset</button>
            </div>
        </form>
    );
}

export default FormReviews;
