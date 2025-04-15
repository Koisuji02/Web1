import { useParams } from "react-router";
import { Row, Col } from "react-bootstrap";

function CharacterDescription(props) {
  const { characterId } = useParams();
  const character = props.characters.find((char) => char.id === parseInt(characterId));

  return (
    <>
      {character ? (
        <>
          <Row>
            <Col>
              <h2>{character.name}</h2>
              <p><strong>Fiction Genre:</strong> {character.fictionGenre}</p>
              <p><strong>Role:</strong> {character.role}</p>
              <p><strong>Hair Color:</strong> {character.hairColor}</p>
              <p><strong>Glasses:</strong> {character.glasses ? "Yes" : "No"}</p>
              <p><strong>Power:</strong> {character.hasPower ? "Yes" : "No"}</p>
              <p><strong>Visible:</strong> {character.visible ? "Yes" : "No"}</p>
            </Col>
          </Row>
        </>
      ) : (
        <Row>
          <Col>
            <p className="lead">Character not found!</p>
          </Col>
        </Row>
      )}
    </>
  );
}

export default CharacterDescription;