import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            {/* Logo + tagline */}
            <div className={styles.logoContainer}>
                <Link to="/" className={styles.logo}>BOOLBNB</Link>
                <p className={styles.tagline}>
                    Unique homes, <br />
                    unforgettable experiences.
                </p>
            </div>

            {/* Social Icons */}
            <div className={styles.socialIcons}>
                <a href="#" className={styles.icon}>
                    <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="#" className={styles.icon}>
                    <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="#" className={styles.icon}>
                    <FontAwesomeIcon icon={faInstagram} />
                </a>
            </div>

            {/* Footer Text */}
            <div className={styles.footerText}>
                <p>Made with love by Team 1</p>
                <p>&#169; 2025 All Rights Reserved</p>
            </div>
        </footer>
    );
};

export default Footer;
