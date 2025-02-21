import { useState, useEffect, useRef } from "react";
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
    images: [],
};

function FormProperties() {
    const [formData, setFormData] = useState(initialData);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [isFormValid, setIsFormValid] = useState(null);
    const [errorMessage, setErrorMessage] = useState({});
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [feedbackType, setFeedbackType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [propertySlug, setPropertySlug] = useState(null);
    const [coverImg, setCoverImg] = useState(null);
    const [coverImgPreviews, setCoverImgPreviews] = useState([]);
    const [secondaryImages, setSecondaryImages] = useState([]);
    const [secondaryImagesPreviews, setSecondaryImagesPreviews] = useState([]);
    const coverImgRef = useRef(null);
    const secondaryImagesRef = useRef(null);

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
            .then((response) => {
                setPropertyTypes(response.data);
            })
            .catch((error) => {
                console.error("Error loading property types:", error);
            });
    }, []);

    /* useEffect(() => {
         return () => {
             imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
         };
     }, [imagePreviews]);*/

    function handleInput(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleCoverImgChange(e) {
        const file = e.target.files[0];
        if (file) {
            setCoverImg(file);
            setCoverImgPreviews(URL.createObjectURL(file));
        }
    }

    function handleSecondaryImgChange(e) {
        const files = Array.from(e.target.files);
        if (files.length > 4 || secondaryImages.length + files.length > 4) {
            alert("Puoi caricare massimo 4 immagini");
            return;
        }
        setSecondaryImages((prev) => [...prev, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setSecondaryImagesPreviews((prev) => [...prev, ...newPreviews]);
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

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) return;
        try {

            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("type_id", formData.type_id);
            formDataToSend.append("address", formData.address);
            formDataToSend.append("city", formData.city);
            formDataToSend.append("num_rooms", formData.num_rooms);
            formDataToSend.append("num_beds", formData.num_beds);
            formDataToSend.append("num_bathrooms", formData.num_bathrooms);
            formDataToSend.append("square_meters", formData.square_meters);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("user_name", "Host");
            formDataToSend.append("user_email", "host@example.com");
            if (coverImg) {
                formDataToSend.append("cover_img", coverImg)
            }
            console.log("Cover Image:", coverImg);
            const propRes = await axios.post(
                "http://localhost:3000/properties",
                formDataToSend);
            const slug = propRes.data.slug;
            setPropertySlug(slug);
            setFeedbackMessage("✅ Property added successfully!");

            if (secondaryImages.length > 0) {
                const imagesFormData = new FormData();
                secondaryImages.forEach((img) => {
                    imagesFormData.append('images', img);
                });

                try {
                    await axios.post(
                        `http://localhost:3000/properties/${slug}/images`,
                        imagesFormData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            }
                        }
                    );
                } catch (error) {
                    console.error("Errore nel caricamento delle immagini:", error);
                    throw error;
                }
            }
            console.log("Cover Image:", coverImg);
            setFeedbackType("success");
            setShowModal(true);
            // Resettare i campi
            setFormData(initialData);
            setIsFormValid(true);
            setCoverImg(null);
            setCoverImgPreviews(null);
            setSecondaryImages([]);
            setSecondaryImagesPreviews([]);
        } catch (err) {
            if (err.response) {
                // Errore dal server
                setFeedbackMessage(`❌ ${err.response.data.message}`);
            } else {
                setFeedbackMessage("❌ Errore di connessione.");
            }
            setFeedbackType("error");
            setShowModal(true);
        }

    }

    function handleReset() {
        setFormData(initialData);
        setErrorMessage({});
        setIsFormValid(null);
        setFeedbackMessage(null);
        setCoverImg(null);
        setCoverImgPreviews(null);
        setSecondaryImages([]);
        setSecondaryImagesPreviews([]);
        if (coverImgRef.current) coverImgRef.current.value = "";
        if (secondaryImagesRef.current) secondaryImagesRef.current.value = "";
    }

    function validateForm() {
        let errors = {};
        if (!formData.type_id) errors.type_id = "Select a property type.";
        if (!formData.title || formData.title.trim().length < 3) errors.title = "Enter a valid title.";
        if (!formData.address || formData.address.trim().length < 3) errors.address = "Enter a valid address.";
        if (!formData.city || formData.city.trim().length < 3) errors.city = "Enter a valid city.";
        if (formData.description && formData.description.trim().length < 30) errors.description = "Description must be at least 30 characters.";
        //if (!formData.images) errors.image = "Enter a valid image URL.";
        //if (!formData.images) errors.image = "Please upload an image.";
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
                            <label htmlFor="cover_image">Cover image</label>
                            <input
                                ref={coverImgRef}
                                id="image"
                                type="file"
                                name="cover_img"
                                accept="image/*"
                                placeholder="Upload your cover image"
                                // value={formData.images}
                                onChange={handleCoverImgChange}
                                className={styles.formPropertiesInput}
                            />

                            {coverImgPreviews instanceof String || typeof coverImgPreviews === "string" ? (
                                <div>
                                    <img
                                        src={coverImgPreviews}
                                        alt="Cover Preview"
                                        style={{ width: 100, height: 100 }}
                                    />
                                </div>
                            ) : null}
                            <label htmlFor="images">Secondary images (optional)</label>
                            <input
                                ref={secondaryImagesRef}
                                id="image"
                                type="file"
                                name="images"
                                multiple
                                accept="image/*"
                                onChange={handleSecondaryImgChange}
                                className={styles.formPropertiesInput}
                                placeholder="Upload your four images"
                                lang="en"
                            />
                            {secondaryImagesPreviews.length > 0 && (
                                <div>
                                    {secondaryImagesPreviews.map((preview, index) => (
                                        <img
                                            key={index}
                                            src={preview}
                                            alt={`Preview ${index}`}
                                            style={{ width: 100, height: 100, margin: 5 }}
                                        />
                                    ))}
                                </div>
                            )}
                            {/*<div className={styles.imagePreviews}>
                                {imagePreviews.map((preview, index) => (
                                    <img key={index} src={preview} alt={`Preview ${index}`} style={{ width: 100, height: 100, margin: 5 }} />
                                ))}
                            </div>*/}
                            {errorMessage.image && <p className={styles.formPropertiesErrorMessage}>{errorMessage.image}</p>}
                        </div>
                    </div>
                </div>

                {/* Riga per description */}
                <div className={styles.formPropertiesGroup}>
                    <label htmlFor="description">Add a description (optional)</label>
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
