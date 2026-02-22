import { Character, Hypothesis, Game } from "../models/models.mjs";

const SERVER_URL = "http://localhost:3001";

// **CHARACTERS**

// GET /api/characters
const getCharacters = async () => {
  const response = await fetch(`${SERVER_URL}/api/characters`);
  if (response.ok) {
    const charactersJson = await response.json();
    return charactersJson.map(
      (c) =>
        new Character(
          c.id,
          c.name,
          c.fictionGenre,
          c.role,
          c.hairColor,
          c.glasses,
          c.gender,
          c.hasPower
        )
    );
  } else {
    throw new Error("Error retrieving characters from the server.");
  }
};

// POST /api/characters
const addCharacter = async (character) => {
  const response = await fetch(`${SERVER_URL}/api/characters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(character),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error creating new character.");
  }
  return response.json();
};

// PUT /api/characters/:id
const updateCharacter = async (character) => {
  const response = await fetch(`${SERVER_URL}/api/characters/${character.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(character),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error updating character.");
  }
  return response.json();
};

// DELETE /api/characters/:id
const deleteCharacter = async (id) => {
  const response = await fetch(`${SERVER_URL}/api/characters/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error deleting character.");
  }
};

// POST /api/characters/reset-visibility
const resetVisibility = async () => {
  const response = await fetch(`${SERVER_URL}/api/characters/reset-visibility`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Error resetting visibility.");
  }
};

// **HYPOTHESES**

// POST /api/hypotheses/:id/update-visibility
const updateVisibilityByHypothesis = async (id, hypothesis) => {
  const response = await fetch(`${SERVER_URL}/api/hypotheses/${id}/update-visibility`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hypothesis),
  });
  if (!response.ok) {
    throw new Error("Error updating visibility based on hypothesis.");
  }
};

// **GAMES**

// GET /api/games/:id/hypotheses
const getHypothesesByGameId = async (gameId) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/hypotheses`);
  if (response.ok) {
    const hypothesesJson = await response.json();
    return hypothesesJson.map(
      (h) => new Hypothesis(h.property, h.value, h.correct)
    );
  } else {
    throw new Error("Error retrieving hypotheses for the game.");
  }
};

// POST /api/games/:id/hypotheses
const addHypothesis = async (gameId, hypothesis) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/hypotheses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hypothesis),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error adding hypothesis.");
  }
  return response.json();
};

// POST /api/games/:id/set-secret-character
const setSecretCharacter = async (gameId) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/set-secret-character`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Error setting the secret character.");
  }
};

// **EXPORT API**
const API = {
  getCharacters,
  addCharacter,
  updateCharacter,
  deleteCharacter,
  resetVisibility,
  updateVisibilityByHypothesis,
  getHypothesesByGameId,
  addHypothesis,
  setSecretCharacter,
};

export default API;