import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Container } from "react-bootstrap";

import NavHeader from "./components/NavHeader";
import CharacterGrid from "./components/CharacterGrid";
import CharacterForm from "./components/CharacterForm";
import Footer from "./components/Footer";

function App() {
  const [characters, setCharacters] = useState([
    { id: 0, name: 'Sheldon Cooper', fictionGenre: 'comedy', role: 'main', hairColor: 'brown', glasses: false, gender: 'male', hasPower: false, visible: true },
    { id: 1, name: 'Saul Goodman', fictionGenre: 'drama', role: 'main', hairColor: 'black', glasses: false, gender: 'male', hasPower: false, visible: true },
    { id: 2, name: 'Jon Snow', fictionGenre: 'fantasy', role: 'main', hairColor: 'black', glasses: false, gender: 'male', hasPower: false, visible: true },
    { id: 3, name: 'Mykasa Ackerman', fictionGenre: 'fantasy', role: 'secondary', hairColor: 'black', glasses: false, gender: 'female', hasPower: false, visible: true },
    { id: 4, name: 'Harry Potter', fictionGenre: 'fantasy', role: 'main', hairColor: 'black', glasses: true, gender: 'male', hasPower: true, visible: true }
  ]);

  const addCharacter = (character) => {
    setCharacters((oldCharacters) => {
      const newId = Math.max(...oldCharacters.map((char) => char.id)) + 1;
      const newCharacter = { id: newId, ...character };
      return [...oldCharacters, newCharacter];
    });
  };

  const updateCharacter = (character) => {
    setCharacters((oldCharacters) =>
      oldCharacters.map((char) =>
        char.id === character.id ? { ...char, ...character } : char
      )
    );
  };

  return (
    <>
      <NavHeader />
      <Container fluid className="mt-3">
        <CharacterForm addCharacter={addCharacter} />
        <CharacterGrid characters={characters} />
      </Container>
      <Footer />
    </>
  );
}

export default App;