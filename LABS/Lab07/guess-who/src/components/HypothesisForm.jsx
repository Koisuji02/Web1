import { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";

function HypothesisForm() {
  const [formState, setFormState] = useState({
    property: "",
    value: "",
    error: null,
  });

  const navigate = useNavigate();

  const propertyOptions = {
    fictionGenre: ["comedy", "drama", "fantasy", "action"],
    role: ["main", "secondary"],
    hairColor: ["brown", "black", "blonde", "red"],
    glasses: ["true", "false"],
    gender: ["male", "female"],
    hasPower: ["true", "false"],
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === "property" && { value: "" }), // Reset del secondo campo se cambia la proprietà
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formState.property || !formState.value) {
      setFormState((prevState) => ({
        ...prevState,
        error: "Both Property and Value are required.",
      }));
      return;
    }

    console.log("Hypothesis submitted:", formState);
    setFormState({ property: "", value: "", error: null });

    // Reindirizza alla home
    navigate("/");
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <h3>Compose Your Hypothesis</h3>
      {formState.error && <Alert variant="danger">{formState.error}</Alert>}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Property</Form.Label>
            <Form.Select
              name="property"
              value={formState.property}
              onChange={handleChange}
              required
            >
              <option value="">Select a property</option>
              {Object.keys(propertyOptions).map((property) => (
                <option key={property} value={property}>
                  {property}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Value</Form.Label>
            <Form.Select
              name="value"
              value={formState.value}
              onChange={handleChange}
              required
              disabled={!formState.property} // Disabilita se non è selezionata una proprietà
            >
              <option value="">Select a value</option>
              {formState.property &&
                propertyOptions[formState.property].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Button type="submit" variant="primary">
        Submit Hypothesis
      </Button>
      <Button
        variant="secondary"
        className="ms-2"
        onClick={() => navigate("/")}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default HypothesisForm;