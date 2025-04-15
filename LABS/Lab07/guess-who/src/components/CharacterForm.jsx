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

    if (!formState.name || !formState.fictionGenre || !formState.role) {
      setFormState((prevState) => ({
        ...prevState,
        error: "Name, Fiction Genre, and Role are required.",
      }));
      return;
    }

    props.addCharacter(formState);

    setFormState({
      name: "",
      fictionGenre: "",
      role: "",
      hairColor: "",
      glasses: false,
      gender: "",
      hasPower: false,
      error: null,
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <h3>Add a New Character</h3>
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
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              type="text"
              name="gender"
              value={formState.gender}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
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
      </Row>
      <Row>
        <Col md={6}>
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
      </Row>
      <Button type="submit" variant="primary">
        Add Character
      </Button>
    </Form>
  );
}

export default CharacterForm;