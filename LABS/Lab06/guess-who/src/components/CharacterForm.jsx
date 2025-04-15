import { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";

function CharacterForm(props) {
  const [formState, setFormState] = useState({
    name: "",
    fictionGenre: "",
    role: "",
    hairColor: "",
    glasses: false,
    gender: "",
    hasPower: false,
    visible: true,
    error: null,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validazione
    if (!formState.name || !formState.fictionGenre || !formState.role) {
      setFormState((prevState) => ({
        ...prevState,
        error: "I campi Name, Fiction Genre e Role sono obbligatori.",
      }));
      return;
    }

    // Aggiungi il personaggio
    props.addCharacter(formState);

    // Reset del form
    setFormState({
      name: "",
      fictionGenre: "",
      role: "",
      hairColor: "",
      glasses: false,
      gender: "",
      hasPower: false,
      visible: true,
      error: null,
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Row>
        <Col>
          <h3>Add a New Character</h3>
        </Col>
      </Row>
      {formState.error && <Alert variant="danger">{formState.error}</Alert>}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Fiction Genre</Form.Label>
            <Form.Control
              type="text"
              name="fictionGenre"
              value={formState.fictionGenre}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              name="role"
              value={formState.role}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Hair Color</Form.Label>
            <Form.Control
              type="text"
              name="hairColor"
              value={formState.hairColor}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Glasses"
              name="glasses"
              checked={formState.glasses}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Has Power"
              name="hasPower"
              checked={formState.hasPower}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Visible"
              name="visible"
              checked={formState.visible}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Button type="submit" variant="primary">
        Add Character
      </Button>
    </Form>
  );
}

export default CharacterForm;