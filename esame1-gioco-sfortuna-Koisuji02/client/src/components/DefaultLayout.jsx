import { Outlet } from "react-router";
import NavHeader from "./NavHeader";
import { Container, Alert } from "react-bootstrap";

// ricorda che si usa <> all'inizio e </> alla fine per includere tutti gli elementi React all'interno (non ci possono essere 2 componenti "padri" in React)
function DefaultLayout(props) {
  return (
    <>
      <NavHeader user={props.user} handleLogout={props.handleLogout} gameActive={props.gameActive} />
      <Container className="mt-3">
        {/* Messaggi di alert globali (login/logout/error) */}
        {props.message && props.message.msg && (
          <Alert variant={props.message.type || "info"} onClose={() => props.setMessage("")} dismissible>
            {props.message.msg}
          </Alert>
        )}
        {/* OUTLET serve per renderizzare le pagine figlie all'interno del LAYOUT */}
        <Outlet />
      </Container>
    </>
  );
}

export default DefaultLayout;
