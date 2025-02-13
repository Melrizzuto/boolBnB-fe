import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const initialData = {
    sender_name: "",
    sender_email: "",
    message_text: ""
};
const apiUrl = import.meta.env.VITE_API_URL;

function FormContact() {
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

        const newEmail = {
            property_id: slug,
            sender_name: formData.sender_name,
            sender_email: formData.sender_email,
            message_text: formData.message_text,
        }

        axios
            .post(`${apiUrl}/properties/${slug}/contact`, newEmail)
            .then((res) => {
                console.log("Email inviata con successo!");
                setFormData(initialData);
            })
            .catch((err) => {
                console.log("Errore nell'invio dell'email", err);
            });
    }

    function validateForm() {
        let errorMessage = {};
        if (!formData.sender_name || typeof formData.sender_name !== 'string' || formData.sender_name.trim() === '' || formData.sender_name.length < 3) {
            errorMessage.sender_name = "Inserisci un nome valido"
        }
        if (!formData.sender_email) {
            errorMessage.sender_email = "Inserisci un'email valida"
        }
        if (!formData.message_text || typeof formData.message_text !== 'string' || formData.message_text.trim() === '' || formData.message_text.length < 10 || formData.message_text.length > 500) {
            errorMessage.message_text = "Inserisci un messaggio valido"
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
                <label htmlFor="sender_name">Nome</label>
                <input
                    type="text"
                    name="sender_name"
                    value={formData.sender_name}
                    onChange={handleInput}
                />
                {errorMessage.sender_name && <p style={{ color: 'red' }}>{errorMessage.sender_name}</p>}
            </div>
            <div>
                <label htmlFor="sender_email">Email</label>
                <input
                    type="email"
                    name="sender_email"
                    value={formData.sender_email}
                    onChange={handleInput}
                />
                {errorMessage.sender_email && <p style={{ color: 'red' }}>{errorMessage.sender_email}</p>}
            </div>
            <div>
                <label htmlFor="message_text">Messaggio</label>
                <textarea
                    name="message_text"
                    value={formData.message_text}
                    onChange={handleInput}
                >
                </textarea>
                {errorMessage.message_text && <p style={{ color: 'red' }}>{errorMessage.message_text}</p>}
            </div>
            <button type="submit">Invia email</button>
        </form>
    )
}

export default FormContact;