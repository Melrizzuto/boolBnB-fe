import { useState } from 'react';
import axios from 'axios';

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
            errorMessage.type_name = "Inserisci il tipo di proprietà.";
        }
        if (!formData.title || typeof formData.title !== 'string' || formData.title.trim() === '' || formData.title.length < 3) {
            errorMessage.title = "Inserisci un titolo valido.";
        }
        if (!formData.address || typeof formData.address !== 'string' || formData.address.trim() === '' || formData.address.length < 3) {
            errorMessage.address = "Inserisci un indirizzo valido.";
        }
        if (!formData.city || typeof formData.city !== 'string' || formData.city.trim() === '' || formData.city.length < 3) {
            errorMessage.city = "Inserisci una città valida.";
        }
        if (!formData.description || typeof formData.description !== 'string' || formData.description.trim() === '') {
            errorMessage.description = "Inserisci una descrizione.";
        }
        if (!formData.image || typeof formData.image !== 'string' || formData.image.trim() === '') {
            errorMessage.image = "Inserisci un'immagine valida.";
        }
        if (!formData.num_rooms || formData.num_rooms <= 0) {
            errorMessage.num_rooms = "Il numero di stanze deve essere maggiore di 0.";
        }
        if (!formData.num_beds || formData.num_beds <= 0) {
            errorMessage.num_beds = "Il numero di letti deve essere maggiore di 0.";
        }
        if (!formData.num_bathrooms || formData.num_bathrooms <= 0) {
            errorMessage.num_bathrooms = "Il numero dei bagni deve essere maggiore di 0.";
        }
        if (!formData.square_meters || formData.square_meters <= 0) {
            errorMessage.square_meters = "Inserisci la grandezza in metri quadrati dell'immobile.";
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
                <label htmlFor="title">Titolo</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInput}
                />
                {errorMessage.title && <p style={{ color: 'red' }}>{errorMessage.title}</p>}
            </div>
            <div>
                <label htmlFor="type_name">Tipologia</label>
                <input type="text"
                    name="type_name"
                    value={formData.type_name}
                    onChange={handleInput}
                />
                {errorMessage.type_name && <p style={{ color: 'red' }}>{errorMessage.type_name}</p>}
            </div>
            <div>
                <label htmlFor="address">Via e numero civico</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInput}
                />
                {errorMessage.address && <p style={{ color: 'red' }}>{errorMessage.address}</p>}
            </div>
            <div>
                <label htmlFor="city">Città</label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInput}
                />
                {errorMessage.city && <p style={{ color: 'red' }}>{errorMessage.city}</p>}
            </div>
            <div>
                <label htmlFor="roomsCount">Numero stanze</label>
                <input
                    type="number"
                    name="num_rooms"
                    value={formData.num_rooms}
                    onChange={handleInput}
                />
                {errorMessage.num_rooms && <p style={{ color: 'red' }}>{errorMessage.num_rooms}</p>}
            </div>
            <div>
                <label htmlFor="num_beds">Numero letti</label>
                <input
                    type="number"
                    name="num_beds"
                    value={formData.num_beds}
                    onChange={handleInput}
                />
                {errorMessage.num_beds && <p style={{ color: 'red' }}>{errorMessage.num_beds}</p>}
            </div>
            <div>
                <label htmlFor="num_bathrooms">Numero bagni</label>
                <input
                    type="number"
                    name="num_bathrooms"
                    value={formData.num_bathrooms}
                    onChange={handleInput}
                />
                {errorMessage.num_bathrooms && <p style={{ color: 'red' }}>{errorMessage.num_bathrooms}</p>}
            </div>
            <div>
                <label htmlFor="squareMeters">Metri quadrati</label>
                <input
                    type="number"
                    name="square_meters"
                    value={formData.square_meters}
                    onChange={handleInput}
                />
                {errorMessage.square_meters && <p style={{ color: 'red' }}>{errorMessage.square_meters}</p>}
            </div>
            <div>
                <label htmlFor="description">Descrizione immobile</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInput}
                >
                </textarea>
                {errorMessage.description && <p style={{ color: 'red' }}>{errorMessage.description}</p>}
            </div>
            <div>
                <label htmlFor="image">Inserisci immagine immobile</label>
                <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInput}
                />
                {errorMessage.image && <p style={{ color: 'red' }}>{errorMessage.image}</p>}
            </div>
            <button type='submit'>Submit</button>
            <button type='button' onClick={handleReset}>Reset</button>
        </form>
    )
}

export default FormProperties;