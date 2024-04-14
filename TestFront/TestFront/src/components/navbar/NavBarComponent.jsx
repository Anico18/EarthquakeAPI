import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import styles from './NavBarComponent.module.scss';

const NavBarComponent = () => {
    return (
            <Navbar expand="lg" className={styles.nav}>
                <Container>
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link style={{paddingTop: '0.5rem', paddingRight: '1rem'}} to={"/"}>Home</Link>
                        <Link style={{paddingTop: '0.5rem', paddingRight: '1rem'}} to={"/Comments"}>Comentarios</Link>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
        </Navbar>
    );
}

export default NavBarComponent;