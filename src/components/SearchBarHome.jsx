import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div>
            <input
                type="text"
                placeholder="Cerca per città o indirizzo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            <button onClick={handleSearch}>Cerca</button>
      </div>
    );

};

export default SearchBarHome;