import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Routes, Route } from "react-router";

import { Character } from "./models/models.mjs";
import DefaultLayout from "./components/DefaultLayout";
import CharacterGrid from "./components/CharacterGrid";
import CharacterForm from "./components/CharacterForm";
import HypothesisForm from "./components/HypothesisForm";
import CharacterDescription from "./components/CharacterDescription";
import NotFound from "./components/NotFound";

const fakeCharacters = [
  new Character(0, 'Sheldon Cooper', 'comedy', 'main', 'brown', false, 'male', false, true),
  new Character(1, 'Saul Goodman', 'drama', 'main', 'black', false, 'male', false, true),
  new Character(2, 'Jon Snow', 'fantasy', 'main', 'black', false, 'male', false, true),
  new Character(3, 'Mykasa Ackerman', 'fantasy', 'secondary', 'black', false, 'female', false, true),
  new Character(4, 'Harry Potter', 'fantasy', 'main', 'black', true, 'male', true, true),
];

function App() {
  const [characters, setCharacters] = useState(fakeCharacters);

  const addCharacter = (character) => {
    setCharacters((oldCharacters) => {
      const newId = Math.max(...oldCharacters.map((char) => char.id)) + 1;
      const newCharacter = new Character(newId, ...Object.values(character));
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

  const deleteCharacter = (characterId) => {
    setCharacters((oldCharacters) =>
      oldCharacters.filter((char) => char.id !== characterId)
    );
  };

  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route
          path="/"
          element={
            <>
              <HypothesisForm />
              <CharacterGrid
                characters={characters}
                updateCharacter={updateCharacter}
                deleteCharacter={deleteCharacter}
              />
              <CharacterForm addCharacter={addCharacter} />
            </>
          }
        />
        <Route
          path="/characters/:characterId"
          element={<CharacterDescription characters={characters} />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;