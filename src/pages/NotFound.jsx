import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <h1 className={styles.heading}>404</h1>
        <p className={styles.message}>Oooooops.. <br></br> the page you are looking for does not exist.</p>
        <Link to="/" className={styles.homeLink}>Go back</Link>
      </div>
    </div>
  );
}

export default NotFound;