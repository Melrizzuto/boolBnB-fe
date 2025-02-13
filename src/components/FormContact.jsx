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
    const [errorMessage, setErrorMessage] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const { slug } = useParams();

    function handleInput(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validateForm()) return;

        const newMessage = {
            sender_email: formData.sender_email,
            message_text: formData.message_text,
        };

        console.log("📤 Sending message:", newMessage);

        axios
            .post(`${apiUrl}/contact/${slug}`, newMessage) // ✅ Route corretta
            .then(() => {
                console.log("✅ Message sent successfully!");
                setSuccessMessage("Message sent successfully! ✅");
                setFormData(initialData);
                setTimeout(() => setSuccessMessage(""), 3000);
            })
            .catch((err) => {
                console.error("❌ Error sending message:", err.response ? err.response.data : err.message);
                setErrorMessage({ general: "Error sending message. Please try again." });
            });
    }

    function validateForm() {
        let errorMessage = {};

        if (!formData.sender_email || !/\S+@\S+\.\S+/.test(formData.sender_email)) {
            errorMessage.sender_email = "Enter a valid email";
        }
        if (!formData.message_text || formData.message_text.trim().length < 10 || formData.message_text.length > 500) {
            errorMessage.message_text = "Message must be between 10 and 500 characters";
        }

        if (Object.keys(errorMessage).length > 0) {
            setErrorMessage(errorMessage);
            return false;
        }

        return true;
    }

    function handleReset() {
        setFormData(initialData);
        setErrorMessage({});
        setSuccessMessage("");
    }

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            {errorMessage.general && <p className={styles.errorMessage}>{errorMessage.general}</p>}

            <div className={styles.formGroup}>
                <label htmlFor="sender_email">Email</label>
                <input
                    type="email"
                    name="sender_email"
                    value={formData.sender_email}
                    placeholder="Enter your email"
                    onChange={handleInput}
                />
                {errorMessage.sender_email && <p className={styles.errorMessage}>{errorMessage.sender_email}</p>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="message_text">What do you need?</label>
                <textarea
                    name="message_text"
                    value={formData.message_text}
                    placeholder="Enter your message"
                    onChange={handleInput}
                />
                {errorMessage.message_text && <p className={styles.errorMessage}>{errorMessage.message_text}</p>}
            </div>

            <div className={styles.buttonContainer}>
                <button className={styles.submitButton} type="submit">Send</button>
                <button className={styles.resetButton} type="button" onClick={handleReset}>Reset</button>
            </div>
        </form>
    );
}

export default FormContact;
