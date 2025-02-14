import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./FormContact&Reviews.module.css";

const initialData = {
    sender_email: "",
    message_text: ""
};

const apiUrl = import.meta.env.VITE_API_URL;

function FormContact() {
    const [formData, setFormData] = useState(initialData);
    const [isFormValid, setIsFormValid] = useState(null);
    const [errorMessage, setErrorMessage] = useState({});
    const { slug } = useParams();

    const [placeholders, setPlaceholders] = useState({
        sender_email: "Enter your email",
        message_text: "Enter your message"
    });

    function handleInput(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    function handleMouseEnter(field) {
        setPlaceholders((prev) => ({
            ...prev,
            [field]: getHoverPlaceholder(field)
        }));
    }

    function handleMouseLeave(field) {
        setPlaceholders((prev) => ({
            ...prev,
            [field]: getDefaultPlaceholder(field)
        }));
    }

    function getHoverPlaceholder(field) {
        const hints = {
            sender_email: "Email must contain '@'",
            message_text: "Message must be between 10 and 500 characters"
        };
        return hints[field] || placeholders[field];
    }

    function getDefaultPlaceholder(field) {
        return {
            sender_email: "Enter your email",
            message_text: "Enter your message"
        }[field];
    }

    function validateForm() {
        let errorMessage = {};
        if (!formData.sender_email || !/\S+@\S+\.\S+/.test(formData.sender_email)) {
            errorMessage.sender_email = "Enter a valid email";
        }
        if (!formData.message_text || formData.message_text.trim().length < 10 || formData.message_text.length > 500) {
            errorMessage.message_text = "Enter a valid message";
        }
        if (Object.keys(errorMessage).length > 0) {
            setErrorMessage(errorMessage);
            return false;
        }

        setIsFormValid(true);
        return true;
    }

    function handleReset() {
        setFormData(initialData);
        setErrorMessage({});
        setIsFormValid(null);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newEmail = {
            property_id: slug,
            sender_email: formData.sender_email,
            message_text: formData.message_text,
        };

        console.log("\ud83d\udce4 Sending review:", newEmail);

        axios
            .post(`${apiUrl}/${slug}/contact`, newEmail)
            .then(() => {
                console.log("Email sent successfully!");
                setFormData(initialData);
            })
            .catch((err) => {
                console.log("Error sending email", err);
            });
    }

    return (
        <form className={styles.formContainer}>
            <div className={styles.formGroup}>
                <label htmlFor="sender_email">Email</label>
                <input
                    type="email"
                    name="sender_email"
                    value={formData.sender_email}
                    placeholder={placeholders.sender_email}
                    onChange={handleInput}
                    onMouseEnter={() => handleMouseEnter("sender_email")}
                    onMouseLeave={() => handleMouseLeave("sender_email")}
                />
                {errorMessage.sender_email && <p className={styles.errorMessage}>{errorMessage.sender_email}</p>}
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="message_text">What do you need?</label>
                <textarea
                    name="message_text"
                    value={formData.message_text}
                    placeholder={placeholders.message_text}
                    onChange={handleInput}
                    onMouseEnter={() => handleMouseEnter("message_text")}
                    onMouseLeave={() => handleMouseLeave("message_text")}
                ></textarea>
                {errorMessage.message_text && <p className={styles.errorMessage}>{errorMessage.message_text}</p>}
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.submitButton} onClick={handleSubmit}>Send</button>
                <button className={styles.resetButton} onClick={handleReset}>Reset</button>
            </div>
        </form>
    );
}

export default FormContact;