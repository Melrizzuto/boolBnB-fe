import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import { FaTimes, FaHome, FaBars } from "react-icons/fa";
import SearchBarHome from "./SearchBarHome";

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    // Effetto cambio colore in base allo scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    });

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
            <div className={styles.container}>
                {/* LOGO */}
                <Link to="/" className={styles.logo}>
                    BOOLBNB
                </Link>

                 {/* Bottone Hamburger (visibile solo sotto i 548px) */}
                 {(location.pathname !== "/search" && location.pathname !== "/add") && 
                    <button 
                        className={styles.hamburger} 
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                 }
                

                {/* NAVBAR MOBILE*/}
                <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}>
                    {(location.pathname !== "/search" && location.pathname !== "/add") && <div className={styles.searchContainer}>Cerca: <SearchBarHome /></div>}
                    <div className="d-flex align-items-center">
                        <span className="pe-2">Aggiungi un nuovo immobile:</span>
                        <Link to="/add" className={styles.addButton} onClick={() => setMenuOpen(false)}>
                            <FaHome /> <span className={styles.textBtn}>Add new</span>
                        </Link>
                    </div>
                    
                </div>

                {/* NAVBAR DESKTOP */}
                <div className={styles.buttonsContainer}>
                    {(location.pathname !== "/search" && location.pathname !== "/add") && <SearchBarHome />}
                    <Link to="/add" className={styles.addButton}>
                        <FaHome /> <span className={styles.textBtn}>Add new</span>
                    </Link>    
                </div>
            </div>
        </header>
    );
}

export default Header;
