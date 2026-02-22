import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Form, Alert, Spinner, Container } from "react-bootstrap";
import { IMAGES_BASE_URL } from "../API/API.mjs";

function DemoPage(props) {

  // STATO -> carte iniziali della demo
  const [initialCards, setInitialCards] = useState([]); // Array di 3 carte iniziali (inizialmente vuoto)

  // STATO -> carta da indovinare (oggetto carta)
  const [cardToGuess, setCardToGuess] = useState(null);

  // STATO -> indice scelto dall'utente per la posizione della nuova carta
  const [guessIndex, setGuessIndex] = useState(0);

  // STATO -> risultato del guess (oggetto con info se indovinato e dati carta)
  const [guessResult, setGuessResult] = useState(null);

  // STATO -> loading per mostrare spinner durante fetch/submit
  const [loading, setLoading] = useState(false);

  // STATO -> errori di caricamento o submit
  const [error, setError] = useState("");

  // STATO -> tutte le carte possedute (iniziali + vinte)
  const [allCards, setAllCards] = useState([]);

  // STATO -> timer per il round demo
  const [timer, setTimer] = useState(30);


  // useEffect: carica le carte demo all'avvio (solo una volta) [contiene solo chiamate API di GET che non modificano il db (quindi la doppia chiamata non è un problema)]
  useEffect(() => {
    const loadDemo = async () => {
      setLoading(true);       // mostra spinner di loading
      setError("");           // resetta errori
      setGuessResult(null);   // resetta risultato

      try {

        // CHIAMATA API per ottenere 3 carte iniziali random
        const cards = await props.API.getDemoInitialCards();
        setInitialCards(cards);
        setAllCards(cards); // all'inizio sono solo le iniziali
        
        // chiamata API per ottenere la carta da indovinare (esclude le iniziali, usa chiave 'exclude' come da backend)
        const excludeIds = cards.map(c => c.id);
        const card = await props.API.getDemoNextCard(excludeIds);

        // Se per errore il backend restituisce una carta già tra le iniziali, la scarto e riprovo (max 10 tentativi) [questo solo nella DEMO perchè non salvo nulla nel db]
        let attempts = 0;
        while (excludeIds.includes(card.id) && attempts < 10) {
          const retry = await props.API.getDemoNextCard(excludeIds);
          if (!excludeIds.includes(retry.id)) {
            setCardToGuess(retry);
            return;
          }
          attempts++;
        }
        setCardToGuess(card);
      } catch (err) {
        setError("Error loading demo cards.");
      } finally {
        setLoading(false);
      }
    };

    loadDemo(); // callback (prima definisco come const, poi chiaamo [solita sintassi])
  }, []);


  // questo useEffect gestisce il timer per il round demo (avviato quando viene mostrata la carta da indovinare e non c'è ancora un risultato)
  useEffect(() => {
    if (cardToGuess && !guessResult) {
      setTimer(30);
      const intervalId = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            clearInterval(intervalId);
            setGuessResult({ guessed: 0 }); // timeout = errore
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [cardToGuess, guessResult]);


  // GESTIONE submit posizione: invia la posizione scelta dall'utente
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    setError("");
    try {

      // chiamata API per inviare il guess (indice, id carta da indovinare, id carte iniziali)
      const result = await props.API.submitDemoGuess(Number(guessIndex), cardToGuess.id, initialCards.map(c => c.id));
      setGuessResult(result); // Salva il risultato (guessed 1 o 0, dati carta)

      if(result.guessed) {
        // inserisci la carta vinta nella posizione corretta tra le carte in possesso (con anche bad_luck_index)
        setAllCards(prev => insertCardSorted(prev, { ...cardToGuess, bad_luck_index: result.card.bad_luck_index }));
      }

    } catch (err) {
      setError("Error submitting your guess.");
    } finally {
      setLoading(false);
    }
  };


  // funzione per inserire la carta vinta nella posizione corretta (chiamata sopra nella handleSubmit)
  function insertCardSorted(cards, newCard) {
    const idx = cards.findIndex(c => c.bad_luck_index > newCard.bad_luck_index);
    if (idx === -1) return [...cards, newCard];
    return [...cards.slice(0, idx), newCard, ...cards.slice(idx)];
  }


  // handler per far ripartire la demo (new round demo)
  const handleNewDemo = () => {

    setInitialCards([]);
    setAllCards([]);
    setCardToGuess(null);
    setGuessIndex(0);
    setGuessResult(null);
    setError("");
    setLoading(false);

    // Ricarica le carte demo
    setTimeout(() => {
      window.scrollTo(0, 0);
      window.location.reload(); // reload demo page
    }, 100);
  };

  // Spinner se loading
  if (loading) return <Spinner animation="border" className="mt-5" />;
  // Messaggio di errore se presente
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;


  // layout a 2 sezioni orizzontali (sopra la carta da indovinare e il form, sotto le carte possedute)
  return (
    <Container className="demo-container">
      <div className="demo-top">
        <h2 className="beach-title">
          <span role="img" aria-label="shell">🐚</span> Demo Round
        </h2>
        <p className="beach-demo-desc">
          Try to guess where the new event fits among your cards by bad luck index!
        </p>
        {cardToGuess && !guessResult && (
          <Row className="align-items-start mt-4 flex-column flex-md-row gap-4 gap-md-0">
            <Col md={4} className="d-flex justify-content-center mb-3 mb-md-0">
              <Card className="beach-card beach-demo-card">
                <Card.Body className="p-2 pb-0 d-flex flex-column justify-content-between beach-demo-card-body">
                  <Card.Title className="beach-card-title">{cardToGuess.title}</Card.Title>
                  <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 beach-card-imgbox">
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
              <Button className="beach-btn beach-newgame-btn" onClick={handleNewDemo}>New Demo</Button>
            </div>
          </>
        )}
      </div>
      <div className="demo-bottom mt-4">
        <h5 className="beach-demo-cards-title"><span role="img" aria-label="shell">🏝️</span> Your Cards</h5>
        <Row className="g-2 justify-content-center">
          {(guessResult && guessResult.guessed
            ? allCards
            : initialCards)
            .slice()
            .sort((a, b) => a.bad_luck_index - b.bad_luck_index)
            .map(card => (
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
        {/* se finito il round demo, compare back to home */}
        {(!cardToGuess || guessResult) && (
          <div className="d-flex justify-content-center mt-4">
            <Button className="beach-btn beach-demo-btn" href="/">Back to Home</Button>
          </div>
        )}
      </div>
    </Container>
  );
}

export default DemoPage;
