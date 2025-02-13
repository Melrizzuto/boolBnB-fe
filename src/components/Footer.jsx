import { Link } from 'react-router-dom';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.logo}>
                <Link to="/" className={styles.logoLink}>LOGO</Link>
            </div>
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
            <div className={styles.footerText}>
                <p>Made with love by Team 1</p>
                <p>&#169; 2025 All Rights Reserved</p>
            </div>
        </footer>
    );
};

export default Footer;
