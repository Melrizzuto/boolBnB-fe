import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    //const [properties, setProperties] = useState([]);
    const [isFormValid, setIsFormValid] = useState(null);
    const [errorMessage, setErrorMessage] = useState({});
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [feedbackType, setFeedbackType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [propertySlug, setPropertySlug] = useState(null);

    //const navigate = useNavigate();

    const defaultPlaceholders = {
        title: "Enter a title",
        address: "Enter the property address",
        city: "Enter the city",
        description: "Write a description",
        num_rooms: "How many rooms are there?",
        num_bathrooms: "How many bathrooms are there?",
        num_beds: "How many beds are there?",
        square_meters: "Enter the size in square meters"
    };

    const hoverPlaceholders = {
        title: "Min. 3 characters",
        address: "Min. 3 characters",
        city: "Min. 3 characters",
        description: "Description must be at least 30 characters.",
        num_rooms: "The number of rooms cannot be less than or equal to 0.",
        num_bathrooms: "The number of bathrooms cannot be less than or equal to 0.",
        num_beds: "The number of beds cannot be less than or equal to 0.",
        square_meters: "The number of square meters cannot be less than or equal to 0."
    };

    const [placeholders, setPlaceholders] = useState(defaultPlaceholders);

    useEffect(() => {
        axios.get("http://localhost:3000/api/property-types")
            .then(response => {
                setPropertyTypes(response.data);
            })
            .catch(error => {
                console.error("Error loading property types:", error);
            });
    }, []);

    //useEffect(() => {
    // Carica tutte le proprietà iniziali
    //    axios.get("http://localhost:3000/properties")
    //        .then(response => {
    //            setProperties(response.data);  // Salva tutte le proprietà
    //        })
    //        .catch(error => {
    //            console.error("Error loading properties:", error);
    //        });
    //}, []);

    function handleInput(e) {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
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
            user_email: "host@example.com",
        };

        axios.post("http://localhost:3000/properties", newProperty)
            .then((res) => {
                setPropertySlug(res.data.slug);
                setFeedbackMessage("✅ Property added successfully!");
                setFeedbackType("success");
                setShowModal(true);
                //setProperties(prevProperties => Array.isArray(prevProperties) ? [...prevProperties, res.data] : [res.data]);
                setFormData(initialData);
            })
            .catch(() => {
                setFeedbackMessage("❌ Error adding property. Please try again later.");
                setFeedbackType("error");
            })
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
        if (!formData.num_rooms || formData.num_rooms <= 0) errors.num_rooms = "The number of rooms cannot be less than or equal to 0.";
        if (!formData.num_beds || formData.num_beds <= 0) errors.num_beds = "The number of beds cannot be less than or equal to 0.";
        if (!formData.num_bathrooms || formData.num_bathrooms <= 0) errors.num_bathrooms = "The number of bathrooms cannot be less than or equal to 0.";
        if (!formData.square_meters || formData.square_meters <= 0) errors.square_meters = "The number of square meters cannot be less than or equal to 0.";

        if (Object.keys(errors).length > 0) {
            setErrorMessage(errors);
            return false;
        }

        setIsFormValid(true);
        return true;
    }

    //useEffect(() => {
    // Quando la lista delle proprietà viene aggiornata, trova la nuova proprietà aggiunta
    //    if (properties.length > 0) {
    // Trova l'ultima proprietà aggiunta (quella con id massimo o altro criterio)
    //        const newProperty = properties[properties.length - 1];
    //setPropertySlug(newProperty.slug);  // Salva lo slug
    //    }
    //}, [properties]);

    //useEffect(() => {
    // Quando lo slug cambia (cioè dopo aver aggiunto la proprietà), naviga alla pagina di dettaglio
    //    if (propertySlug) {
    //        navigate(`/properties/${propertySlug}`);  // Vai alla pagina della proprietà usando lo slug
    //   }
    //}, [propertySlug, navigate]);

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
                            placeholder={placeholders.title}
                            value={formData.title}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
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
                            placeholder={placeholders.address}
                            value={formData.address}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
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
                            placeholder={placeholders.city}
                            value={formData.city}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        />
                        {errorMessage.city && <p className={styles.formPropertiesErrorMessage}>{errorMessage.city}</p>}
                    </div>

                    <div className={styles.formPropertiesGroup}>
                        <label htmlFor="num_rooms">Rooms number</label>
                        <input
                            id="num_rooms"
                            type="number"
                            name="num_rooms"
                            placeholder={placeholders.num_rooms}
                            value={formData.num_rooms}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        />
                        {errorMessage.num_rooms && <p className={styles.formPropertiesErrorMessage}>{errorMessage.num_rooms}</p>}
                    </div>

                    <div className={styles.formPropertiesGroup}>
                        <label htmlFor="num_beds">Beds number</label>
                        <input
                            id="num_beds"
                            type="number"
                            name="num_beds"
                            placeholder={placeholders.num_beds}
                            value={formData.num_beds}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
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
                            placeholder={placeholders.num_bathrooms}
                            value={formData.num_bathrooms}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        />
                        {errorMessage.num_bathrooms && <p className={styles.formPropertiesErrorMessage}>{errorMessage.num_bathrooms}</p>}
                    </div>

                    <div className={styles.formPropertiesGroup}>
                        <label htmlFor="squareMeters">Square meters</label>
                        <input
                            type="number"
                            name="square_meters"
                            placeholder={placeholders.square_meters}
                            value={formData.square_meters}
                            onChange={handleInput}
                            className={styles.formPropertiesInput}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
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
                        placeholder={placeholders.description}
                        value={formData.description}
                        onChange={handleInput}
                        className={styles.formPropertiesTextarea}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
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
                            <Link className={styles.formPropertiesSubmitButton} to={`/properties/${propertySlug}`} state={{ slug: propertySlug }}>Go to Detail page </Link>
                            <button type="button" className={styles.formPropertiesResetButton} onClick={() => setShowModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FormProperties;