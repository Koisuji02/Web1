import { Container, Navbar, Nav } from 'react-bootstrap';
// Link = componente di React Router per creare link interni senza ricaricare la pagina
import { Link } from "react-router";
import { LogoutButton } from './AuthComponents';

function NavHeader(props) {
  // props.user: oggetto utente loggato (null se non loggato)
  // props.handleLogout: funzione per gestire il logout
  // props.gameActive: true se il gioco è in corso (navbar da disabilitare completamente)
  
  return(
    <Navbar className="beach-navbar" expand="lg">
      <Container fluid>
        {/* logo decorativo, NON più un link */}
        <span className="beach-navbar-brand" style={{cursor: 'default'}}>
          <span role="img" aria-label="beach">🏖️</span> Unlucky Holidays
        </span>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          {/* Se gameActive è true, non mostrare nessun link */}
          {!props.gameActive && (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="beach-nav-link">Home</Nav.Link>
              <Nav.Link as={Link} to="/demo" className="beach-nav-link">Demo</Nav.Link>
              {props.user && <Nav.Link as={Link} to="/game" className="beach-nav-link">Game</Nav.Link>}
              {props.user && <Nav.Link as={Link} to="/profile" className="beach-nav-link">Profile</Nav.Link>}
            </Nav>
          )}
          {/* Login/Logout visibili solo se gameActive è false */}
          {!props.gameActive && (props.user ? 
            <LogoutButton logout={props.handleLogout} className="beach-btn beach-logout-btn" /> :
            <Link to='/login' className='btn beach-btn beach-login-btn'>Login</Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavHeader;