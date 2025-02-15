import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { FaSearch, FaHome } from "react-icons/fa";

function Header() {
    const [scrolled, setScrolled] = useState(false);

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
                    <Link to="/search" className={styles.searchButton}>
                        <FaSearch /> <span className={styles.textBtn}>Search your fav</span>
                    </Link>
                    <Link to="/add" className={styles.addButton}>
                        <FaHome /> <span className={styles.textBtn}>Add new</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
