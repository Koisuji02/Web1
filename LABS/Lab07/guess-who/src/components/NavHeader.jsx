import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router";

function NavHeader() {
  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container fluid>
        <Link to="/" className="navbar-brand">
          Guess Who?
        </Link>
      </Container>
    </Navbar>
  );
}

export default NavHeader;