import { useState } from 'react';
import axios from 'axios';
import styles from "./FormProperties.module.css";

const initialData = {
    title: "",
    type_name: "",
    address: "",
    city: "",
    num_rooms: "",
    num_beds: "",
    num_bathrooms: "",
    square_meters: "",
    description: "",
    image: "",
}

const apiUrl = import.meta.env.VITE_API_URL;

function FormProperties() {

    const [formData, setFormData] = useState(initialData);
    const [isFormValid, setIsFormValid] = useState(null);
    const [errorMessage, setErrorMessage] = useState({});

    function handleInput(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) return;

        axios
            .post(apiUrl + "/properties", formData)
            .then(() => {
                console.log("Immobile aggiunto con successo");
                setFormData(initialData);
            })
            .catch((err) => {
                console.log("Errore nell'aggiunta della proprietà:", err);
            });
    }

    function handleReset() {
        setFormData(initialData);
        setErrorMessage({});
        setIsFormValid(null);
    }

    function validateForm() {
        let errors = {};
        if (!formData.type_name) errors.type_name = "Enter the property type.";
        if (!formData.title || formData.title.trim().length < 3) errors.title = "Enter a valid title.";
        if (!formData.address || formData.address.trim().length < 3) errors.address = "Enter a valid address.";
        if (!formData.city || formData.city.trim().length < 3) errors.city = "Enter a valid city.";
        if (!formData.description || formData.description.trim().length < 100) errors.description = "Description must be at least 100 characters.";
        if (!formData.image) errors.image = "Enter a valid image url.";
        if (!formData.num_rooms || formData.num_rooms <= 0) errors.num_rooms = "The number of rooms cannot be 0.";
        if (!formData.num_beds || formData.num_beds <= 0) errors.num_beds = "The number of beds cannot be 0.";
        if (!formData.num_bathrooms || formData.num_bathrooms <= 0) errors.num_bathrooms = "The number of bathrooms cannot be 0.";
        if (!formData.square_meters || formData.square_meters <= 0) errors.square_meters = "Enter the size of the property in square meters.";

        setErrorMessage(errors);
        return Object.keys(errors).length === 0;
    }

    return (
        <form onSubmit={handleSubmit} className={styles.formPropertiesContainer}>
            {Object.keys(initialData).map((key) => (
                <div key={key} className={styles.formPropertiesGroup}>
                    <label htmlFor={key} className={styles.formPropertiesLabel}>{key.replace('_', ' ')}</label>
                    {key === 'description' ? (
                        <textarea
                            name={key}
                            placeholder={`Enter ${key}`}
                            value={formData[key]}
                            onChange={handleInput}
                            className={styles.formPropertiesTextarea}
                        />
                    ) : (
                        <input
                            type={key.includes('num') || key.includes('square') ? 'number' : 'text'}
                            name={key}
                            placeholder={`Enter ${key}`}
                            value={formData[key]}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                        />
                    )}
                    {errorMessage[key] && <p className={styles.formPropertiesErrorMessage}>{errorMessage[key]}</p>}
                </div>
            ))}
            <div className={styles.formPropertiesButtonContainer}>
                <button type='submit' className={styles.formPropertiesSubmitButton}>Submit</button>
                <button type='button' className={styles.formPropertiesResetButton} onClick={handleReset}>Reset</button>
            </div>
        </form>
    );
}

export default FormProperties;
