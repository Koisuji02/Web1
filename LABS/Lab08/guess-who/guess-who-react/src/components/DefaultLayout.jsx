import { Container } from "react-bootstrap";
import { Outlet } from "react-router";
import NavHeader from "./NavHeader";
import Footer from "./Footer";

function DefaultLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavHeader />
      <Container fluid className="mt-3 mb-3 flex-grow-1">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}

export default DefaultLayout;