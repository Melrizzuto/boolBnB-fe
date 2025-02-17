import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./FormProperties.module.css";

const initialData = {
    title: "",
    type_id: "",
    address: "",
    city: "",
    num_rooms: "",
    num_beds: "",
    num_bathrooms: "",
    square_meters: "",
    description: "",
    image: "",
};

function FormProperties() {
    const [formData, setFormData] = useState(initialData);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [isFormValid, setIsFormValid] = useState(null);
    const [errorMessage, setErrorMessage] = useState({});
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [feedbackType, setFeedbackType] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:3000/api/property-types")
            .then(response => {
                setPropertyTypes(response.data);
            })
            .catch(error => {
                console.error("Error loading property types:", error);
            });
    }, []);

    function handleInput(e) {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) return;

        const newProperty = {
            title: formData.title,
            type_id: parseInt(formData.type_id, 10) || null,
            address: formData.address,
            city: formData.city,
            num_rooms: parseInt(formData.num_rooms, 10) || 0,
            num_beds: parseInt(formData.num_beds, 10) || 0,
            num_bathrooms: parseInt(formData.num_bathrooms, 10) || 0,
            square_meters: parseInt(formData.square_meters, 10) || 0,
            description: formData.description.trim() || "No description available",
            image: formData.image.trim() || "https://example.com/default.jpg",
            user_name: "Host",
            user_email: "host@example.com"
        };

        axios.post("http://localhost:3000/properties", newProperty)
            .then(() => {
                setFeedbackMessage("✅ Property added successfully!");
                setFeedbackType("success");
                setShowModal(true);
                setFormData(initialData);
            })
            .catch(() => {
                setFeedbackMessage("❌ Error adding property. Please try again later.");
                setFeedbackType("error");
            });
    }

    function handleReset() {
        setFormData(initialData);
        setErrorMessage({});
        setIsFormValid(null);
        setFeedbackMessage(null);
    }

    function validateForm() {
        let errors = {};
        if (!formData.type_id) errors.type_id = "Select a property type.";
        if (!formData.title || formData.title.trim().length < 3) errors.title = "Enter a valid title.";
        if (!formData.address || formData.address.trim().length < 3) errors.address = "Enter a valid address.";
        if (!formData.city || formData.city.trim().length < 3) errors.city = "Enter a valid city.";
        if (!formData.description || formData.description.trim().length < 30) errors.description = "Description must be at least 30 characters.";
        if (!formData.image) errors.image = "Enter a valid image URL.";
        if (!formData.num_rooms || formData.num_rooms <= 0) errors.num_rooms = "Number of rooms cannot be 0.";
        if (!formData.num_beds || formData.num_beds <= 0) errors.num_beds = "Number of beds cannot be 0.";
        if (!formData.num_bathrooms || formData.num_bathrooms <= 0) errors.num_bathrooms = "Number of bathrooms cannot be 0.";
        if (!formData.square_meters || formData.square_meters <= 0) errors.square_meters = "Enter the property size in square meters.";

        if (Object.keys(errors).length > 0) {
            setErrorMessage(errors);
            return false;
        }

        setIsFormValid(true);
        return true;
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.formPropertiesContainer}>

                {/* Prima riga */}
                <div className={styles.formPropertiesRow}>
                    <div className={styles.formPropertiesGroup}>
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="Enter a title"
                            value={formData.title}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                        />
                        {errorMessage.title && <p className={styles.formPropertiesErrorMessage}>{errorMessage.title}</p>}
                    </div>

                    <div className={styles.formPropertiesGroup}>
                        <label htmlFor="type_id">Type</label>
                        <select id="type_id" name="type_id" value={formData.type_id} onChange={handleInput} className={styles.formPropertiesInput}>
                            <option value="">Select a type</option>
                            {propertyTypes.length > 0 ? (
                                propertyTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))
                            ) : (
                                <option disabled>Loading types...</option>
                            )}
                        </select>
                        {errorMessage.type_id && <p className={styles.formPropertiesErrorMessage}>{errorMessage.type_id}</p>}
                    </div>

                    <div className={styles.formPropertiesGroup}>
                        <label htmlFor="address">Address</label>
                        <input
                            id="address"
                            type="text"
                            name="address"
                            placeholder="Enter the property address"
                            value={formData.address}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                        />
                        {errorMessage.address && <p className={styles.formPropertiesErrorMessage}>{errorMessage.address}</p>}
                    </div>
                </div>

                {/* Seconda riga */}
                <div className={styles.formPropertiesRow}>
                    <div className={styles.formPropertiesGroup}>
                        <label htmlFor="city">City</label>
                        <input
                            id="city"
                            type="text"
                            name="city"
                            placeholder="Enter the city"
                            value={formData.city}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                        />
                        {errorMessage.city && <p className={styles.formPropertiesErrorMessage}>{errorMessage.city}</p>}
                    </div>

                    <div className={styles.formPropertiesGroup}>
                        <label htmlFor="num_rooms">Rooms number</label>
                        <input
                            id="num_rooms"
                            type="number"
                            name="num_rooms"
                            placeholder="How many rooms are there?"
                            value={formData.num_rooms}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                        />
                        {errorMessage.num_rooms && <p className={styles.formPropertiesErrorMessage}>{errorMessage.num_rooms}</p>}
                    </div>

                    <div className={styles.formPropertiesGroup}>
                        <label htmlFor="num_beds">Beds number</label>
                        <input
                            id="num_beds"
                            type="number"
                            name="num_beds"
                            placeholder="How many beds are there?"
                            value={formData.num_beds}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                        />
                        {errorMessage.num_beds && <p className={styles.formPropertiesErrorMessage}>{errorMessage.num_beds}</p>}
                    </div>
                </div>

                {/* Terza riga */}
                <div className={styles.formPropertiesRow}>
                    <div className={styles.formPropertiesGroup}>
                        <label htmlFor="num_bathrooms">Bathrooms number</label>
                        <input
                            type="number"
                            name="num_bathrooms"
                            placeholder="How many bathrooms are there?"
                            value={formData.num_bathrooms}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                        />
                        {errorMessage.num_bathrooms && <p className={styles.formPropertiesErrorMessage}>{errorMessage.num_bathrooms}</p>}
                    </div>

                    <div className={styles.formPropertiesGroup}>
                        <label htmlFor="squareMeters">Square meters</label>
                        <input
                            type="number"
                            name="square_meters"
                            placeholder="Enter the size in square meters"
                            value={formData.square_meters}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                        />
                        {errorMessage.square_meters && <p className={styles.formPropertiesErrorMessage}>{errorMessage.square_meters}</p>}
                    </div>
                    <div className={styles.formPropertiesRow}>
                        <div className={styles.formPropertiesGroup}>
                            <label htmlFor="image">Upload an image</label>
                            <input
                                id="image"
                                type="text"
                                name="image"
                                placeholder="Enter an image URL"
                                value={formData.image}
                                onChange={handleInput}
                                className={styles.formPropertiesInput}
                            />
                            {errorMessage.image && <p className={styles.formPropertiesErrorMessage}>{errorMessage.image}</p>}
                        </div>
                    </div>


                </div>

                {/* Riga per description */}
                <div className={styles.formPropertiesGroup}>
                    <label htmlFor="description">Add a description</label>
                    <textarea
                        name="description"
                        placeholder="Write a description"
                        value={formData.description}
                        onChange={handleInput}
                        className={styles.formPropertiesTextarea}
                    ></textarea>
                    {errorMessage.description && <p className={styles.formPropertiesErrorMessage}>{errorMessage.description}</p>}
                </div>
                {/* Bottoni */}
                <div className={styles.formPropertiesButtonContainer}>
                    <button type="submit" className={styles.formPropertiesSubmitButton}>Add</button>
                    <button type="button" className={styles.formPropertiesResetButton} onClick={handleReset}>Reset</button>
                </div>

            </form>
            {/* Bootstrap Modal */}
            <div className={`modal fade ${showModal ? "show d-block" : "d-none"}`} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header justify-content-between">
                            <h5 className="modal-title">{feedbackType === "success" ? "Success" : "Error"}</h5>
                        </div>
                        <div className="modal-body">
                            <p>{feedbackMessage}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className={styles.formPropertiesSubmitButton} onClick={() => window.location.href = "/"}>Go to Homepage</button>
                            <button type="button" className={styles.formPropertiesResetButton} onClick={() => setShowModal(false)}>Close</button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FormProperties;