const SERVER_URL = "http://localhost:3001";
// Costante per le immagini servite dal server
export const IMAGES_BASE_URL = SERVER_URL;

// GET /api/demo/initial-cards
const getDemoInitialCards = async () => {
  const response = await fetch(SERVER_URL + "/api/demo/initial-cards");
  if(response.ok) {
    return await response.json(); // [{id, title, image_path, bad_luck_index}]
  }
  else
    throw new Error("Internal server error");
};


// POST /api/demo/next-card
//! solo per la demo la exclude funziona da client (in quanto non salvo nulla nel db della partita demo [non c'è GAME nè GAMECARD di quel game])
const getDemoNextCard = async (excludeIds) => {
  const response = await fetch(SERVER_URL + "/api/demo/next-card", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ exclude: excludeIds })
  });
  if(response.ok) {
    return await response.json(); // {id, title, image_path}
  }
  else
    throw new Error("Internal server error");
};


// POST /api/demo/guessed
const submitDemoGuess = async (guessIndex, cardToGuessId, initialCards) => {
  const response = await fetch(SERVER_URL + '/api/demo/guessed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guessIndex, cardToGuessId, initialCards })
  });
  if(response.ok) {
    return await response.json(); // {guessed: true/false, card: {...}}
  }
  else
    throw new Error("Internal server error");
};

// GET /api/sessions/current (verifica se l'utente è loggato, come in week13)
const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    credentials: 'include',
  });
  if(response.ok) {
    return await response.json(); // {id, username, ...}
  }
  else {
    const err = await response.json();
    throw err;
  }
};

// POST /api/sessions (login)
const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + "/api/sessions", {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if(response.ok) {
    return await response.json(); // {id, username, ...}
  }
  else {
    const err = await response.json();
    throw err;
  }
};

// DELETE /api/sessions/current (logout)
const logOut = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    method: 'DELETE',
    credentials: 'include'
  });
  if(!response.ok) throw new Error("Logout failed");
};

// === API GIOCO VERO (autenticato) ===

// POST /api/games (crea nuova partita)
const createGame = async () => {
  const response = await fetch(SERVER_URL + "/api/games", {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  if(response.ok) {
    return await response.json(); // {id}
  } else throw new Error("Error creating game");
};

// GET /api/games/:gameId/initial-cards
const getInitialCards = async (gameId) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/initial-cards`, {
    credentials: 'include'
  });
  if(response.ok) {
    return await response.json(); // [{id, title, image_path, bad_luck_index}]
  } else throw new Error("Error loading initial cards");
};

// POST /api/games/:gameId/next-card
const getNextCard = async (gameId, excludeIds = []) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/next-card`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usedIds: excludeIds })
  });
  if(response.ok) {
    return await response.json(); // {id, title, image_path}
  } else throw new Error("Error extracting new card");
};

// PUT /api/games/:gameId/gamecards/:cardId/guessed
// cardId qui è l'ID della CARD, non della GAMECARD
const setCardGuessed = async (gameId, cardId, guessIndex, initialCards) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/cards/${cardId}/guessed`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guessIndex, initialCards })
  });
  if(response.ok) {
    return await response.json(); // {guessed: 1, card: {...}} or {guessed: 0}
  } else throw new Error("Error submitting guess");
};

// PUT /api/games/:gameId/end
const endGame = async (gameId, result) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/end`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ result })
  });
  if(response.ok) {
    return await response.json(); // {changes: 1}
  } else throw new Error("Error ending game");
};

// GET /api/games/:gameId/gamecards
const getGameCards = async (gameId) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/gamecards`, {
    credentials: 'include'
  });
  if(response.ok) {
    return await response.json(); // array of {gameCard, card}
  } else throw new Error("Error retrieving game cards");
};

/*// DELETE /api/games/:gameId
const deleteGame = async (gameId) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if(response.ok) {
    return await response.json();
  } else throw new Error("Error deleting game");
};*/

// GET /api/games (lista partite utente)
const getGames = async () => {
  const response = await fetch(SERVER_URL + "/api/games", {
    credentials: 'include'
  });
  if(response.ok) {
    return await response.json();
  } else throw new Error("Error retrieving games");
};

const API = { getDemoInitialCards, getDemoNextCard, submitDemoGuess, getUserInfo, logIn, logOut,
  createGame, getInitialCards, getNextCard, setCardGuessed, endGame, getGameCards, getGames };
export default API;
