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

        const newProperties = {
            title: formData.title,
            type_name: formData.type_name,
            address: formData.address,
            city: formData.city,
            num_rooms: formData.num_rooms,
            num_beds: formData.num_beds,
            num_bathrooms: formData.num_bathrooms,
            square_meters: formData.square_meters,
            description: formData.description,
            image: formData.image,
        };

        axios
            .post(apiUrl + "/properties", newProperties)
            .then((res) => {
                console.log("Immobile aggiunto con successo")
                setFormData(initialData)
            })
            .catch((err) => {
                console.log("Errore nell'aggiunta della proprietà:", err)
            })
    }

    function handleReset() {
        setFormData(initialData);
        setErrorMessage({});
        setIsFormValid(null);
    }

    function validateForm() {
        let errorMessage = {};
        if (!formData.type_name) {
            errorMessage.type_name = "Enter the property type.";
        }
        if (!formData.title || typeof formData.title !== 'string' || formData.title.trim() === '' || formData.title.length < 3) {
            errorMessage.title = "Enter a valid title.";
        }
        if (!formData.address || typeof formData.address !== 'string' || formData.address.trim() === '' || formData.address.length < 3) {
            errorMessage.address = "Enter a valid address.";
        }
        if (!formData.city || typeof formData.city !== 'string' || formData.city.trim() === '' || formData.city.length < 3) {
            errorMessage.city = "Enter a valid city.";
        }
        if (!formData.description || typeof formData.description !== 'string' || formData.description.trim() === '' || formData.description.length < 100) {
            errorMessage.description = "Review must be less than 100 characters";
        }
        if (!formData.image || typeof formData.image !== 'string' || formData.image.trim() === '') {
            errorMessage.image = "Enter a valid image url.";
        }
        if (!formData.num_rooms || formData.num_rooms <= 0) {
            errorMessage.num_rooms = "The number of rooms cannot be 0.";
        }
        if (!formData.num_beds || formData.num_beds <= 0) {
            errorMessage.num_beds = "The number of beds cannot be 0.";
        }
        if (!formData.num_bathrooms || formData.num_bathrooms <= 0) {
            errorMessage.num_bathrooms = "The number of bathrooms cannot be 0.";
        }
        if (!formData.square_meters || formData.square_meters <= 0) {
            errorMessage.square_meters = "Enter the size of the property in square meters.";
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
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Enter a title"
                    value={formData.title}
                    onChange={handleInput}
                />
                {errorMessage.title && <p style={{ color: 'red' }}>{errorMessage.title}</p>}
            </div>
            <div>
                <label htmlFor="type_name">Type</label>
                <input type="text"
                    name="type_name"
                    placeholder={formData.type_name}
                    value={formData.type_name}
                    onChange={handleInput}
                />
                {errorMessage.type_name && <p style={{ color: 'red' }}>{errorMessage.type_name}</p>}
            </div>
            <div>
                <label htmlFor="address">Address</label>
                <input
                    type="text"
                    name="address"
                    placeholder="Enter the property address"
                    value={formData.address}
                    onChange={handleInput}
                />
                {errorMessage.address && <p style={{ color: 'red' }}>{errorMessage.address}</p>}
            </div>
            <div>
                <label htmlFor="city">City</label>
                <input
                    type="text"
                    name="city"
                    placeholder="Enter the city"
                    value={formData.city}
                    onChange={handleInput}
                />
                {errorMessage.city && <p style={{ color: 'red' }}>{errorMessage.city}</p>}
            </div>
            <div>
                <label htmlFor="roomsCount">Rooms number</label>
                <input
                    type="number"
                    name="num_rooms"
                    placeholder="How many rooms are there?"
                    value={formData.num_rooms}
                    onChange={handleInput}
                />
                {errorMessage.num_rooms && <p style={{ color: 'red' }}>{errorMessage.num_rooms}</p>}
            </div>
            <div>
                <label htmlFor="num_beds">Beds number</label>
                <input
                    type="number"
                    name="num_beds"
                    placeholder="How many beds are there?"
                    value={formData.num_beds}
                    onChange={handleInput}
                />
                {errorMessage.num_beds && <p style={{ color: 'red' }}>{errorMessage.num_beds}</p>}
            </div>
            <div>
                <label htmlFor="num_bathrooms">Bathrooms number</label>
                <input
                    type="number"
                    name="num_bathrooms"
                    placeholder="How many bathrooms are there?"
                    value={formData.num_bathrooms}
                    onChange={handleInput}
                />
                {errorMessage.num_bathrooms && <p style={{ color: 'red' }}>{errorMessage.num_bathrooms}</p>}
            </div>
            <div>
                <label htmlFor="squareMeters">Square meters</label>
                <input
                    type="number"
                    name="square_meters"
                    placeholder="Enter the size in square meters"
                    value={formData.square_meters}
                    onChange={handleInput}
                />
                {errorMessage.square_meters && <p style={{ color: 'red' }}>{errorMessage.square_meters}</p>}
            </div>
            <div>
                <label htmlFor="description">Add a description</label>
                <textarea
                    name="description"
                    placeholder="Write a description"
                    value={formData.description}
                    onChange={handleInput}
                >
                </textarea>
                {errorMessage.description && <p style={{ color: 'red' }}>{errorMessage.description}</p>}
            </div>
            <div>
                <label htmlFor="image">Upload an image</label>
                <input
                    type="text"
                    name="image"
                    placeholder="Enter an image url"
                    value={formData.image}
                    onChange={handleInput}
                />
                {errorMessage.image && <p style={{ color: 'red' }}>{errorMessage.image}</p>}
            </div>
            <button type='submit' className={styles.submitButton}>Submit</button>
            <button type='button' className={styles.resetButton} onClick={handleReset}>Reset</button>
        </form>
    )
}

export default FormProperties;