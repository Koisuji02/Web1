import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Routes, Route } from "react-router";

import { Character } from "./models/models.mjs";
import DefaultLayout from "./components/DefaultLayout";
import CharacterGrid from "./components/CharacterGrid";
import CharacterForm from "./components/CharacterForm";
import HypothesisForm from "./components/HypothesisForm";
import NotFound from "./components/NotFound";

const fakeCharacters = [
  new Character(0, 'Sheldon Cooper', 'comedy', 'main', 'brown', false, 'male', false),
  new Character(1, 'Saul Goodman', 'drama', 'main', 'black', false, 'male', false),
  new Character(2, 'Jon Snow', 'fantasy', 'main', 'black', false, 'male', false),
  new Character(3, 'Mykasa Ackerman', 'fantasy', 'secondary', 'black', false, 'female', false),
  new Character(4, 'Harry Potter', 'fantasy', 'main', 'black', true, 'male', true),
];

function App() {
  const [characters, setCharacters] = useState(fakeCharacters);

  const addCharacter = (character) => {
    setCharacters((oldCharacters) => {
      const newId = Math.max(...oldCharacters.map((char) => char.id), 0) + 1; // Calcola il nuovo ID
      const newCharacter = new Character(
        newId, // Passa l'ID come primo parametro
        character.name,
        character.fictionGenre,
        character.role,
        character.hairColor,
        character.glasses,
        character.gender,
        character.hasPower
      );
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
    //console.log("Deleting character with ID:", characterId);
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
              <CharacterGrid
                characters={characters}
                updateCharacter={updateCharacter}
                deleteCharacter={deleteCharacter}
              />
            </>
          }
        />
        <Route
          path="/add-character"
          element={<CharacterForm addCharacter={addCharacter} />}
        />
        <Route
          path="/add-hypothesis"
          element={<HypothesisForm />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;