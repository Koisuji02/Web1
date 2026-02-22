import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import API from "./API/API.mjs";

import DefaultLayout from "./components/DefaultLayout";
import CharacterGrid from "./components/CharacterGrid";
import CharacterForm from "./components/CharacterForm";
import HypothesisForm from "./components/HypothesisForm";
import NotFound from "./components/NotFound";

function App() {
  const [characters, setCharacters] = useState([]);

  // Carica i personaggi dal server all'avvio
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

  const addCharacter = async (character) => {
    try {
      const newCharacter = await API.addCharacter(character);
      setCharacters((oldCharacters) => [...oldCharacters, newCharacter]);
    } catch (error) {
      console.error("Error adding character:", error);
    }
  };

  const updateCharacter = async (character) => {
    try {
      const updatedCharacter = await API.updateCharacter(character);
      setCharacters((oldCharacters) =>
        oldCharacters.map((char) =>
          char.id === updatedCharacter.id ? updatedCharacter : char
        )
      );
    } catch (error) {
      console.error("Error updating character:", error);
    }
  };

  const deleteCharacter = async (characterId) => {
    try {
      await API.deleteCharacter(characterId);
      setCharacters((oldCharacters) =>
        oldCharacters.filter((char) => char.id !== characterId)
      );
    } catch (error) {
      console.error("Error deleting character:", error);
    }
  };

  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route
          path="/"
          element={
            <CharacterGrid
              updateCharacter={updateCharacter}
              deleteCharacter={deleteCharacter}
            />
          }
        />
        <Route
          path="/add-character"
          element={<CharacterForm addCharacter={addCharacter} />}
        />
        <Route path="/add-hypothesis" element={<HypothesisForm />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;