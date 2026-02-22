import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import API from "../API/API.mjs";

function CharacterGrid(props) {
  const { deleteCharacter } = props;
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const characters = await API.getCharacters();
        setCharacters(characters);
      } catch (error) {
        console.error("Error loading characters:", error);
      }
    };
    fetchCharacters();
  }, []);

  return (
    <Container>
      <h2 className="text-center mb-4">Characters</h2>
      <Row>
        {characters.map((character) => (
          <Col key={character.id} md={3} className="mb-4">
            <CharacterCard
              character={character}
              deleteCharacter={deleteCharacter}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

function CharacterCard(props) {
  const { character, deleteCharacter } = props;

  return (
    <Card className="text-center">
      <Card.Body>
        <Card.Title>{character.name}</Card.Title>
        <Card.Text>
          <strong>Fiction Genre:</strong> {character.fictionGenre}
          <br />
          <strong>Role:</strong> {character.role}
          <br />
          <strong>Hair:</strong> {character.hairColor}
          <br />
          <strong>Glasses:</strong> {character.glasses ? "Yes" : "No"}
          <br />
          <strong>Power:</strong> {character.hasPower ? "Yes" : "No"}
          <br />
          <strong>Gender:</strong> {character.gender}
        </Card.Text>
        <Button
          variant="danger"
          onClick={() => {
            console.log("Delete button clicked for ID:", character.id); // Log per debug
            deleteCharacter(character.id)
          }}
        >
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CharacterGrid;