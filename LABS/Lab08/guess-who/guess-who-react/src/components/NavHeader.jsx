import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router";

function NavHeader() {
  return (
    <Navbar
      bg="primary"
      variant="dark"
      expand="lg"
      className="border-bottom border-dark"
    >
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold text-uppercase text-white"
          style={{ fontSize: "1.5rem" }}
        >
          GuessWho?
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link
              as={Link}
              to="/"
              className="btn btn-dark text-white mx-2"
              style={{ textDecoration: "none" }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/add-character"
              className="btn btn-dark text-white mx-2"
              style={{ textDecoration: "none" }}
            >
              Add Character
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/add-hypothesis"
              className="btn btn-dark text-white mx-2"
              style={{ textDecoration: "none" }}
            >
              Add Hypothesis
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavHeader;