import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SearchBarHome.module.css";

const SearchBarHome = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if(searchTerm.trim()){
            navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
        };
    };
    return(
        <form onSubmit={handleSearch} className={styles.form}>
            <input
                type="text"
                placeholder="Cerca per città o indirizzo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchBar}
                />
            <button className={styles.btn}>Cerca</button>
      </form>
    );

};

export default SearchBarHome;