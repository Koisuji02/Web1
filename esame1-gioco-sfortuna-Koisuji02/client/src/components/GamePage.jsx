import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Form, Alert, Spinner, Container } from "react-bootstrap";
import { IMAGES_BASE_URL } from "../API/API.mjs";

function GamePage({ API, user, navigate, onGameActiveChange }) {
  // Game state
  const [gameId, setGameId] = useState(null);
  // STATO -> initialCards: array delle 3 carte iniziali
  const [initialCards, setInitialCards] = useState([]);
  // STATO -> allCards: tutte le carte possedute (iniziali + vinte)
  const [allCards, setAllCards] = useState([]);
  // STATO -> cardToGuess: carta da indovinare nel round corrente
  const [cardToGuess, setCardToGuess] = useState(null);
  // STATO -> guessIndex: posizione scelta dall'utente per la nuova carta
  const [guessIndex, setGuessIndex] = useState(0);
  // STATO -> guessResult: risultato del round (oggetto con info se indovinato)
  const [guessResult, setGuessResult] = useState(null);
  // STATO -> loading: true se in attesa di risposta API
  const [loading, setLoading] = useState(false);
  // STATO -> error: messaggio di errore da mostrare
  const [error, setError] = useState("");
  // STATO -> timer: secondi rimasti per rispondere al round
  const [timer, setTimer] = useState(30);
  // STATO -> intervalId: id dell'intervallo del timer (per clearInterval)
  const [intervalId, setIntervalId] = useState(null);
  // STATO -> round: numero del round corrente
  const [round, setRound] = useState(1);
  // STATO -> won: numero di carte vinte
  const [won, setWon] = useState(0);
  // STATO -> lost: numero di carte perse
  const [lost, setLost] = useState(0);
  // STATO -> gameEnded: true se la partita è terminata (win/lose)
  const [gameEnded, setGameEnded] = useState(false);

  // Start a new game (POST /api/games)
  const handleNewGame = async () => {

    if (onGameActiveChange) onGameActiveChange(true); // disabilita navbar
    setLoading(true);
    setError("");
    setGameEnded(false);
    setGameId(null);
    setInitialCards([]);
    setAllCards([]);
    setCardToGuess(null);
    setGuessIndex(0);
    setGuessResult(null);
    setRound(1);
    setWon(0);
    setLost(0);
    
    try {

      const { id } = await API.createGame();
      setGameId(id);
      // prendi le 3 initial cards
      const cards = await API.getInitialCards(id);
      setInitialCards(cards);
      setAllCards(cards);

      // prendi la 1^ carta da indovinare (escludendo le iniziali)
      const excludeIds = cards.map(c => c.id);
      const card = await API.getNextCard(id, excludeIds);
      setCardToGuess(card);
      
    } catch (err) {
      setError("Error creating the game.");
    } finally {
      setLoading(false);
    }
  };

  // Next round (get new card, escludendo quelle già possedute)
  const handleNewRound = async () => {

    setGuessResult(null);
    setGuessIndex(0);
    setTimer(30);
    setLoading(true);
    setError("");

    try {
      // Esclude tutte le carte già possedute
      const excludeIds = allCards.map(c => c.id);
      const card = await API.getNextCard(gameId, excludeIds);
      setCardToGuess(card);
      setRound(r => r + 1);
    } catch (err) {
      setError("No more cards available.");
    } finally {
      setLoading(false);
    }
  };

  // qui useEffect per gestire il timer del round (se la carta da indovinare è presente e non c'è risultato, parte il timer)
  useEffect(() => {
    // se c'è una carta da indovinare, il round non è finito e la partita non è finita
    if (cardToGuess && !guessResult && !gameEnded) {
      setTimer(30);
      // avvia timer
      const id = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            clearInterval(id);
            setIntervalId(null);
            // Uso una callback per avere accesso ai valori aggiornati degli state
            handleTimeout();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      setIntervalId(id);

      // clearInterval quando cambia round o il componente si smonta
      return () => clearInterval(id);
    } else if (intervalId) {
      // se il round è finito o la partita è finita, pulisci il timer
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [cardToGuess, guessResult, gameEnded]);  // handleTimeout: chiamato quando il timer scade (risposta persa)
  const handleTimeout = async () => {
    // prevengo chiamate multiple
    if (guessResult || gameEnded) return;
    
    setGuessResult({ guessed: 0 });
    
    // calcolo direttamente i nuovi valori
    const newLost = lost + 1;
    setLost(newLost);
    
    // controllo la fine del gioco con i valori corretti
    checkEndGame(won, newLost);
    
    // invia tutti gli id delle carte possedute, ordinati per bad_luck_index
    const sortedIds = allCards.slice().sort((a, b) => a.bad_luck_index - b.bad_luck_index).map(c => c.id);
    // invia -1 come guessIndex per indicare timeout al server
    await API.setCardGuessed(gameId, cardToGuess.id, -1, sortedIds);
  };
  // handler per invia la posizione scelta dall'utente per la carta
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // invia tutti gli id delle carte possedute (iniziali + vinte), ordinati per bad_luck_index
      const sortedIds = allCards.slice().sort((a, b) => a.bad_luck_index - b.bad_luck_index).map(c => c.id);
      const result = await API.setCardGuessed(gameId, cardToGuess.id, Number(guessIndex), sortedIds);
      setGuessResult(result);      if (result.guessed) {
        // Se la carta è stata vinta, aggiungila all'array ordinato
        setAllCards(prev => insertCardSorted(prev, { ...cardToGuess, bad_luck_index: result.card.bad_luck_index }));
        const newWon = won + 1;
        setWon(newWon);
        checkEndGame(newWon, lost);
      } else {
        const newLost = lost + 1;
        setLost(newLost);
        checkEndGame(won, newLost);
      }
    } catch (err) {
      setError("Error submitting the answer.");
    } finally {
      setLoading(false);
    }
  };

  // insertCardSorted -> inserisce la carta vinta nella posizione corretta (ordinamento per bad_luck_index)
  function insertCardSorted(cards, newCard) {
    const idx = cards.findIndex(c => c.bad_luck_index > newCard.bad_luck_index);
    if (idx === -1) return [...cards, newCard];
    return [...cards.slice(0, idx), newCard, ...cards.slice(idx)];
  }  // checkEndGame -> controlla se la partita è finita (3 vinte o 3 perse)
  function checkEndGame(w, l) {
    // protezione per evitare chiamate multiple
    if (gameEnded) return;
    
    if (w >= 3 || l >= 3) {
      setGameEnded(true);
      API.endGame(gameId, w >= 3 ? "win" : "lose");
      if (onGameActiveChange) onGameActiveChange(false); // riabilita la navbar
    }
  }

  // Spinner if loading
  if (!user) return <Alert variant="warning" className="mt-5">You must be logged in to play!</Alert>;
  if (loading) return <Spinner animation="border" className="mt-5" />;
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;

  // se non c'è partita attiva, mostra il bottone per iniziare
  if (!gameId) {
    return (
      <Container className="game-container d-flex flex-column align-items-center justify-content-center mt-5">
        <h2 className="beach-title mb-4">Unlucky Holidays Game</h2>
        <Button className="beach-btn beach-newgame-btn" onClick={handleNewGame}>New Game</Button>
      </Container>
    );
  }

  // se la partita è finita, mostra il riepilogo e i bottoni per nuova partita o tornare alla home
  if (gameEnded) {
    return (
      <Container className="game-container d-flex flex-column align-items-center justify-content-center mt-5">
        <h2 className="beach-title mb-4">Game Over!</h2>
        <Alert variant={won >= 3 ? "success" : "danger"}>
          {won >= 3 ? "You won!" : "You lost!"}
        </Alert>
        <h5 className="beach-demo-cards-title mt-4">Your cards</h5>
        <Row className="g-2 justify-content-center">
          {allCards.slice().sort((a, b) => a.bad_luck_index - b.bad_luck_index).map(card => (
            <Col key={card.id} xs={6} sm={4} md={2} className="d-flex justify-content-center">
              <Card className="beach-card beach-demo-card">
                <Card.Body className="p-2 pb-0 d-flex flex-column justify-content-between beach-demo-card-body">
                  <Card.Title className="beach-card-title">{card.title}</Card.Title>
                  <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 beach-card-imgbox">
                    <Card.Img src={`${IMAGES_BASE_URL}/${card.image_path}`} alt={card.title} className="beach-card-img" />
                  </div>
                  <div className="beach-card-badluck">
                    Bad Luck: <b>{card.bad_luck_index}</b>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button className="beach-btn beach-newgame-btn" onClick={() => { if (onGameActiveChange) onGameActiveChange(true); handleNewGame(); }}>New Game</Button>
          <Button className="beach-btn beach-home-btn" onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </Container>
    );
  }

  // UI del round corrente (carta da indovinare, timer, form per la posizione)
  return (
    <Container className="game-container">
      <div className="demo-top">
        <h2 className="beach-title mt-4 mb-2">Round {round}</h2>
        <p className="beach-demo-desc">
          Guess where the new card fits among your cards!
        </p>
        {cardToGuess && !guessResult && (
          <Row className="align-items-start mt-4 flex-column flex-md-row gap-4 gap-md-0">
            <Col md={4} className="d-flex justify-content-center mb-3 mb-md-0">
              <Card className="beach-card beach-demo-card">
                <Card.Body className="p-2 pb-0 d-flex flex-column justify-content-between beach-demo-card-body">
                  <Card.Title className="beach-card-title">{cardToGuess.title}</Card.Title>                  <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 beach-card-imgbox">
                    <Card.Img src={`${IMAGES_BASE_URL}/${cardToGuess.image_path}`} alt={cardToGuess.title} className="beach-card-img" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={8} className="d-flex flex-column align-items-center align-items-md-start justify-content-center">
              <div className={`mb-3 d-flex align-items-center gap-2 beach-timer-text${timer <= 5 ? ' timer-danger' : ''}`}>
                <span className="hourglass-anim" role="img" aria-label="hourglass">⏳</span> Time left: {timer}s
              </div>
              <Form onSubmit={handleSubmit} className="beach-card beach-demo-form w-100 d-flex flex-column align-items-center">
                <Form.Label className="beach-form-label w-100 text-center mb-3 beach-form-label-guess">
                  Where would you place this card?
                </Form.Label>
                <Form.Group className="w-100">
                  <div className="position-buttons-container">
                    {Array.from({ length: allCards.length + 1 }).map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`position-button${Number(guessIndex) === idx ? ' active' : ''}`}
                        onClick={() => setGuessIndex(idx)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </Form.Group>
                <div className="d-flex justify-content-center w-100 mt-3">
                  <Button type="submit" className="beach-btn beach-demo-btn">Submit</Button>
                </div>
              </Form>
            </Col>
          </Row>
        )}

        {/* Mostra il risultato del round appena giocato */}
        {guessResult && (
          <>
            <Alert variant={guessResult.guessed ? "success" : "danger"} className="mt-3">
              {guessResult.guessed ? (
                <b>You won the card!</b>
              ) : (
                <b>You lost the card!</b>
              )}
            </Alert>
            <div className="d-flex justify-content-center gap-3 mt-3">
              {!gameEnded && <Button className="beach-btn beach-newgame-btn" onClick={handleNewRound}>New Round</Button>}
            </div>
          </>
        )}
      </div>
      <div className="demo-bottom mt-4">
        <h5 className="beach-demo-cards-title"><span role="img" aria-label="shell">🏝️</span> Your cards</h5>
        <Row className="g-2 justify-content-center">
          {allCards.slice().sort((a, b) => a.bad_luck_index - b.bad_luck_index).map(card => (
            <Col key={card.id} xs={6} sm={4} md={2} className="d-flex justify-content-center">
              <Card className="beach-card beach-demo-card">
                <Card.Body className="p-2 pb-0 d-flex flex-column justify-content-between beach-demo-card-body">
                  <Card.Title className="beach-card-title">{card.title}</Card.Title>
                  <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 beach-card-imgbox">
                    <Card.Img src={`${IMAGES_BASE_URL}/${card.image_path}`} alt={card.title} className="beach-card-img" />
                  </div>
                  <div className="beach-card-badluck">
                    Bad Luck: <b>{card.bad_luck_index}</b>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}

export default GamePage;