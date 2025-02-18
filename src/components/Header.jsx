import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import { FaSearch, FaHome } from "react-icons/fa";
import SearchBarHome from "./SearchBarHome";

function Header() {
    const [scrolled, setScrolled] = useState(false);
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

                {/* NAVBAR */}
                <nav className={styles.nav}>
                </nav>

                {/* PULSANTI A DESTRA */}
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
