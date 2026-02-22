import { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Container, Alert } from "react-bootstrap";

function ProfilePage({ API, user }) {

  // STATO -> lista delle partite concluse dell'utente
  const [games, setGames] = useState([]);

  // STATO -> gestisce il caricamento asincrono (il loading)
  const [loading, setLoading] = useState(true);

  // STATO -> eventuali errori di caricamento
  const [error, setError] = useState("");

  // STATO -> per mappare ogni gameId alle sue carte (iniziali + vinte)
  const [gameCards, setGameCards] = useState({}); // { gameId: [cards] }


  // qui useEffect viene eseguito al mounting del componente o quando cambia user; carica la cronologia delle partite dell'utente
  useEffect(() => {

    // Funzione asincrona per caricare i dati delle partite
    const loadGames = async () => {
      setLoading(true); // mostra spinner di caricamento
      setError("");    // resetta eventuali errori precedenti

      try {
        
        const gamesList = await API.getGames();
        // filtra tenendo solo le partite concluse (result diverso da null)
        const finishedGames = gamesList.filter(game => game.result !== null);
        setGames(finishedGames);

        // per ogni partita conclusa, carica le carte associate
        const cardsObj = {};
        for (const g of finishedGames) {
          const cards = await API.getGameCards(g.id); // carte del game g
          // prende carte iniziali (initial === 1; aggiunge la proprietà round: null per uniformità)
          const initial = cards.filter(obj => obj.gameCard.initial === 1).map(obj => ({...obj.card, round: null}));

          // prende carte vinte (initial === 0 e guessed === 1); aggiunge round in cui sono state vinte)
          const won = cards.filter(obj => obj.gameCard.initial === 0 && obj.gameCard.guessed === 1)
            .map(obj => ({...obj.card, round: obj.gameCard.round_number}));

          // ordino le carte -> prima iniziali, poi vinte in ordine di round
          cardsObj[g.id] = [...initial, ...won.sort((a,b) => a.round - b.round)];
        }

        setGameCards(cardsObj); // Aggiorna lo stato con tutte le carte per partita
      } catch (err) {
        setError("Error loading your game history.");
      } finally {
        setLoading(false); // nasconde lo spinner alla fine
      }
    };

    // qui chiamo la callback (solo se utente è loggato)
    if (user) loadGames();
  }, [user]);

  // se utente non loggato -> warning
  if (!user) return <Alert variant="warning" className="mt-5">You must be logged in to see your profile!</Alert>;
  // caricamento dei dati -> spinner
  if (loading) return <Spinner animation="border" className="mt-5" />;
  // eventuali errori -> alert
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;

  // ordina i games per data di creazione (più recente in cima)
  const sortedGames = [...games].sort((a, b) => b.created_at.valueOf() - a.created_at.valueOf());

  const totalGames = sortedGames.length; // uso totalgames per numerare le partite dell'utente (non seguo l'id dei games, in quanto sono tra più utenti quindi si perde il senso del game #N per l'utente)

  return (
    <Container className="profile-container mt-4">
      <h2 className="beach-title mb-4">Your Game History</h2>
      {/* se non ci sono game conclusi, mostra un alert */}
      {games.length === 0 ? (
        <Alert variant="info">No games played yet!</Alert>
      ) : (
        // altrimenti visualizza le partite in una griglia responsive di Card (Card = quadrato che contiene i dati della partita, solo estetico)
        <Row className="g-4">
          {sortedGames.map((game, idx) => (
            <Col key={game.id} xs={12} md={6} lg={4}>
              <Card className="beach-card beach-profile-card mb-3">
                <Card.Body>
                  {/* n° progressivo della partita (Game #N) */}
                  <Card.Title className="beach-card-title">Game #{totalGames - idx}</Card.Title>
                  {/* win/lose con colorazione */}
                  <div className="beach-profile-result mb-2">
                    Result: <b className={game.result === 'win' ? 'beach-profile-win' : 'beach-profile-lose'}>{game.result}</b>
                  </div>
                  {/* lista delle carte raccolte nella partita */}
                  <div className="beach-profile-cards">
                    <b>Cards collected:</b>
                    <ul className="beach-profile-cardlist">
                      {/* per ogni carta -> title + round_number se guessed [ovvero se ha round != null o undefined] */}
                      {gameCards[game.id]?.map(card => (
                        <li key={card.id}>
                          {card.title}
                          {card.round !== null && card.round !== undefined ? (
                            <span className="beach-profile-round"> (won in round {card.round})</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* date e ora del game */}
                  <div className="beach-profile-date mt-2">
                    <small>Played on: {new Date(game.created_at).toLocaleString()}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default ProfilePage;