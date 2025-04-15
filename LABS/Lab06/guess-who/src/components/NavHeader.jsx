import { Container, Navbar } from 'react-bootstrap';

function NavHeader () {
  return(
    <Navbar bg='primary' data-bs-theme='dark'>
      <Container fluid>
        <Navbar.Brand>GuessWho?</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default NavHeader;