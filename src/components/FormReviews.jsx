import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./FormContact&Reviews.module.css";
import { FaStar } from "react-icons/fa";

const initialData = {
    name: "",
    email: "",
    rating: 0,
    check_in: "",
    check_out: "",
    comment: "",
};

const apiUrl = import.meta.env.VITE_API_URL;

function FormReviews() {
    const [formData, setFormData] = useState(initialData);
    const [errorMessage, setErrorMessage] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const { slug } = useParams();

    function handleInput(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value || "",
        }));
    }

    function handleStarClick(rating) {
        setFormData(prev => ({
            ...prev,
            rating,
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

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validateForm()) return;

        const newReview = {
            user_name: formData.name,
            user_email: formData.email,
            review_text: formData.comment,
            rating: formData.rating,
            start_date: formData.check_in,
            end_date: formData.check_out,
        };

        console.log("📤 Sending review:", newReview);

        axios
            .post(`${apiUrl}/properties/${slug}/reviews`, newReview, {
                headers: { "Content-Type": "application/json" },
            })
            .then(() => {
                console.log("✅ Review sent successfully!");
                setSuccessMessage("Review submitted successfully! ✅");
                setFormData(initialData);
                setTimeout(() => setSuccessMessage(""), 3000);
            })
            .catch((err) => {
                console.error("❌ Error sending review:", err.response ? err.response.data : err.message);
                setErrorMessage({ general: "Error submitting the review. Please try again." });
            });
    }

    function validateForm() {
        let errorMessage = {};
        const today = new Date().toISOString().split("T")[0];
        const checkInDate = formData.check_in;
        const checkOutDate = formData.check_out;

        if (!formData.name || formData.name.trim().length < 3) {
            errorMessage.name = "Name must be at least 3 characters";
        }
        if (!validateEmail(formData.email)) {
            errorMessage.email = "Enter a valid email";
        }
        if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
            errorMessage.rating = "Please select a rating";
        }
        if (!validateDate(checkInDate) || checkInDate > today) {
            errorMessage.check_in = "Invalid date format or must be in the past";
        }
        if (!validateDate(checkOutDate) || checkInDate >= checkOutDate) {
            errorMessage.check_out = "Invalid date format or must be after check-in";
        }
        if (!formData.comment || formData.comment.length > 200) {
            errorMessage.comment = "Review must be less than 200 characters";
        }

        if (Object.keys(errorMessage).length > 0) {
            setErrorMessage(errorMessage);
            return false;
        }

        return true;
    }

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            {errorMessage.general && <p className={styles.errorMessage}>{errorMessage.general}</p>}

            <div>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Enter your full name"
                    onChange={handleInput}
                />
                {errorMessage.name && <p className={styles.errorMessage}>{errorMessage.name}</p>}
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    onChange={handleInput}
                />
                {errorMessage.email && <p className={styles.errorMessage}>{errorMessage.email}</p>}
            </div>

            <div>
                <label htmlFor="check_in">Check-in</label>
                <input
                    type="date"
                    name="check_in"
                    value={formData.check_in}
                    onChange={handleInput}
                    placeholder="YYYY/MM/DD"
                    lang="en"
                />
                {errorMessage.check_in && <p className={styles.errorMessage}>{errorMessage.check_in}</p>}
            </div>

            <div>
                <label htmlFor="check_out">Check-out</label>
                <input
                    type="date"
                    name="check_out"
                    value={formData.check_out}
                    onChange={handleInput}
                    placeholder="YYYY/MM/DD"
                    lang="en"
                />
                {errorMessage.check_out && <p className={styles.errorMessage}>{errorMessage.check_out}</p>}
            </div>

            {/* Rating con le stelle */}
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

            {/* Textarea per la recensione */}
            <div>
                <label htmlFor="comment">Leave your review</label>
                <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInput}
                    placeholder="Write your review"
                />
                {errorMessage.comment && <p className={styles.errorMessage}>{errorMessage.comment}</p>}
            </div>

            <div className={styles.buttonContainer}>
                <button className={styles.submitButton} type="submit">Send</button>
                <button className={styles.resetButton} type="button" onClick={handleReset}>Reset</button>
            </div>
        </form>
    );
}

export default FormReviews;
