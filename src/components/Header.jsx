import {Link} from "react-router-dom";
function Header() {
    return (
        <header className="debug">
            <h1>Header</h1>
            <Link to="/search">Ricerca Avanzata</Link>
        </header>
    );
}

export default Header;