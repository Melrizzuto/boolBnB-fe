import { Link } from "react-router-dom";
import styles from "./Jumbotron.module.css";

export default function Jumbotron({ scrollToCards }) {
    return (
        <section className={styles.jumbotron}>

            <h1 className={styles.title}>BoolBnB</h1>
            <h4 className={styles.subtitle}>
                Find your perfect stay. Unique homes, unforgettable experiences.
            </h4>

            <div className={styles.buttonContainer}>

                <button className={styles.btnOutline} onClick={scrollToCards}>
                    View All
                </button>

                <Link to="/search" className={styles.btnGreen}>
                    Find Your Perfect Home
                </Link>

            </div>

        </section>
    );
}