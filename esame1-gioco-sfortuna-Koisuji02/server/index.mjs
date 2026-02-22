import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import { check, validationResult } from 'express-validator';
import { getUser, getCardById, createGame, getGameById, listGamesByUser, addCardToGame, getCardsOfGame, setCardGuessed, getRandomCards, checkCardPosition, updateGameResult,
  //deleteGameById
} from './dao.mjs';

// INIT DI EXPRESS
const app = express();
const port = 3001;

// MIDDLEWARE
app.use(express.json());
app.use(morgan('dev'));

// EXPRESS STATIC per le immagini delle mie carte
app.use(express.static('public'));

// CORS -> permette al client di comunicare con il server usando porte diverse (5173 per il client React e 3001 per il server Express)
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200, // per vecchi browser
  credentials: true // per auth
};
app.use(cors(corsOptions));

// PASSPORT -> Local Strategy per autenticazione con username e password (usando la strategia locale di Passport.js)
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if(!user) return cb(null, false, 'Incorrect username or password.');
  return cb(null, user);
}));

// SERIALIZZAZIONE UTENTE PER SESSIONE -> quando l'utente si logga, viene serializzato per la sessione (per memorizzare i dati dell'utente e poterlo riconoscere in seguito)
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

// DESERIALIZZAZIONE UTENTE PER SESSIONE -> quando l'utente fa una richiesta, viene deserializzato per ottenere i dati dell'utente dalla sessione (recupera i dati dell'utente dalla sessione)
passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

// middleware per verificare se l'utente è loggato (middleware perchè seguito dal next())
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Not authorized' });
};

// impostazione della sessione
app.use(session({
  secret: "shhhhh... it's a secret!", // chiave segreta per firmare il cookie
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

//! Game Ownership Check Middleware (per fare il controllo se l'utente è il proprietario del gioco)
const isGameOwner = async (req, res, next) => {
  try {
    // supporta sia :gameId che :id come parametri (in alcune route uso id in altre gameId)
    const gameId = req.params.gameId || req.params.id;

    const game = await getGameById(gameId);
    if (game.error) return res.status(404).json(game); // se non trova la partita, ritorna 404

    // Controlla che l'utente loggato sia il proprietario della partita
    if (game.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access Denied, not your game!' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// =========  ROUTES PUBBLICHE (utenti non registrati)  ========

// DEMO -> round iniziale con 3 carte casuali
app.get('/api/demo/initial-cards', async (req, res) => {
  try {
    // prende le 3 carte iniziali casuali dal database
    const cards = await getRandomCards(3);
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DEMO -> round iniziale con 3 carte casuali, momento in cui esce la carta da indovinare (la 4^ carta)
app.post('/api/demo/next-card', async (req, res) => {
  try {
    // ricevo dal body l'array delle carte già mostrate (ids)
    //? supporta sia 'exclude' che 'usedIds' a seconda di dove chiamo (se da demo o da game)
    const exclude = req.body.exclude || req.body.usedIds || [];

    // estraggo una nuova carta casuale dal DB, escludendo quelle già uscite
    const cards = await getRandomCards(1, exclude);
    if (cards.length === 0) return res.status(404).json({ error: 'No more cards available!' });

    const card = cards[0];
    // nel json non torno il bad_luck_index perchè non deve essere mostrato
    res.json({ id: card.id, title: card.title, image_path: card.image_path });
    
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DEMO -> verifica se la carta è stata indovinata (utente anonimo, 1 round) [controlla se la posizione ipotizzata per la carta è corretta rispetto alle carte iniziali]
app.post('/api/demo/guessed',
  [
    check('guessIndex').isInt({ min: 0, max: 3 }),
    check('cardToGuessId').isInt({ min: 1 }),
    check('initialCards').isArray({ min: 3, max: 3 }),
    check('initialCards.*').isInt({ min: 1 })
  ],
  async (req, res) => {
    // controlla se ci sono errori di validazione nei dati inviati
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const { guessIndex, cardToGuessId, initialCards } = req.body;
      // prendiamo le carte iniziali e la carta da indovinare
      const initial = await Promise.all(initialCards.map(id => getCardById(id)));
      const cardToGuess = await getCardById(cardToGuessId);

      // controllo ulteriore -> se carta da indovinare e carte iniziali non sono valide, ritorno error 400
      if (!cardToGuess || initial.length !== 3) return res.status(400).json({ error: 'Not valid cards!' });

      // chiamo checkCardPosition per vedere se posizione ipotizzata è corretta (convertendo da true->1, false->0 [più comodo poi per il db])
      const guessed = checkCardPosition(guessIndex, cardToGuess, initial) ? 1 : 0;
      if (guessed === 1) {
        res.json({ guessed: 1, card: cardToGuess });
      } else {
        res.json({ guessed: 0 });
      }

    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// ============= ROUTES AUTENTICATE (utenti registrati) ============

// CREA NUOVA PARTITA PER UTENTE LOGGATO (crea la partita con ended_at e result NULL)
app.post('/api/games',
  [],
  isLoggedIn,
  async (req, res) => {
    try {
      // Genera la data di creazione lato backend
      const created_at = new Date().toISOString();
      const game = { user_id: req.user.id, created_at };
      const id = await createGame(game);

      res.status(201).json({ id });
    } catch (err) {
      res.status(503).json({ error: err.message });
    }
  }
);

// END GAME (aggiorna ended_at e result)
app.put('/api/games/:gameId/end',
  [
    check('result').isIn(['win', 'lose'])
  ],
  isLoggedIn, isGameOwner,
  async (req, res) => {
    // controllo errori di validazione
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const { result } = req.body;
      const ended_at = new Date().toISOString(); // Passo la data/ora attuale come stringa ISO
      const changes = await updateGameResult(req.params.gameId, result, ended_at);
      if (changes === 0) return res.status(404).json({ error: 'Partita non trovata!' });
      res.json({ changes });
    } catch (err) {
      res.status(503).json({ error: err.message });
    }
  }
);

// GET DATI DELLA PARTITA PER UTENTE LOGGATO
app.get('/api/games/:gameId', isLoggedIn, isGameOwner, async (req, res) => {
  try {

    // prendo il game dall'id, controllo se esiste (altrimenti 404) e lo ritorno
    const game = await getGameById(req.params.gameId);
    if (game.error) res.status(404).json(game);
    else res.json(game);

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET CARTE INIZIALI DELLA PARTITA PER UTENTE LOGGATO
app.get('/api/games/:gameId/initial-cards', isLoggedIn, isGameOwner, async (req, res) => {
  try {
    const newInitialCards = await getRandomCards(3);
    if (newInitialCards.length < 3) {
      return res.status(400).json({ error: 'Not enough cards available for initial draw!' });
    }

    // Inserisci le carte iniziali in GAMECARD
    for (const card of newInitialCards) {
      await addCardToGame({
        game_id: parseInt(req.params.gameId),
        card_id: card.id,
        round_number: null,
        initial: 1,
        guessed: null
      });
    }

    res.json(newInitialCards);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET ALL GAMES DI UN UTENTE (LOGGATO)
app.get('/api/games', isLoggedIn, async (req, res) => {
  try {
    // prendo lo user dalla req
    const games = await listGamesByUser(req.user.id);
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ADD CARD TO GAME PER UTENTE LOGGATO (come la demo, ma salva in GAMECARD)
app.post('/api/games/:gameId/next-card', isLoggedIn, isGameOwner, async (req, res) => {
  try {
    // prende tutte le carte già uscite in questa partita
    const cardsOfGame = await getCardsOfGame(req.params.gameId); // [{gameCard, card}]
    const usedIds = cardsOfGame.map(obj => obj.card.id);

    // prende nuova carta casuale dal db (escludendo quelle già uscite)
    const newCards = await getRandomCards(1, usedIds);

    if (newCards.length === 0) return res.status(404).json({ error: 'No more cards available!' });
    const newCard = newCards[0];
    // calcolo round_number della carta (max round_number + 1 tra le carte non iniziali)
    const maxRound = Math.max(0, ...cardsOfGame.filter(obj => obj.gameCard.initial === 0).map(obj => obj.gameCard.round_number || 0));
    // salvo nuova carta in GAMECARD
    const gamecard = {
      game_id: parseInt(req.params.gameId),
      card_id: newCard.id,
      initial: 0,
      guessed: null,
      round_number: maxRound + 1
    };
    await addCardToGame(gamecard);

    // do in risposta la carta aggiunta SENZA bad_luck_index (come nella demo, che lo mostra solo se indovinata)
    res.json({ id: newCard.id, title: newCard.title, image_path: newCard.image_path });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET ALL CARDS OF A GAME (uso la stessa funzione sia per prendere le carte a partita finita, sia per prendere le carte di una partita in corso [e quindi avere anche bad_luck_index])
app.get('/api/games/:gameId/gamecards', isLoggedIn, isGameOwner, async (req, res) => {
  try {
    // accedo ai dati del game per sapere se è conclusa
    const game = await getGameById(req.params.gameId);
    const cards = await getCardsOfGame(req.params.gameId);

    let filteredCards;
    // partita finita: restituisco solo id, title della cards
    if (game.ended_at && game.result) {
      filteredCards = cards.map(obj => ({
        gameCard: obj.gameCard,
        card: {
          id: obj.card.id,
          title: obj.card.title
        }
      }));
    } else {
      // partita in corso: restituisco tutto (incluso bad_luck_index e image_path)
      filteredCards = cards;
    }
    res.json(filteredCards);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// UPDATE GAMECARD GUESS (usa l'ID della CARD anziché della GAMECARD)
app.put('/api/games/:gameId/cards/:cardId/guessed',
  [
    check('guessIndex').optional().isInt({ min: -1, max: 6 }), // -1 per timeout
    check('initialCards').optional().isArray({ min: 3, max: 6 }),
    check('initialCards.*').optional().isInt({ min: 1 })
  ],
  isLoggedIn, isGameOwner,
  async (req, res) => {
    // controllo errori di validazione
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      // prendo i dati dal body
      const { guessIndex, initialCards } = req.body;
      const cardId = parseInt(req.params.cardId);
      const gameId = parseInt(req.params.gameId);
      
      // prendo le carte iniziali dal db
      const initial = await Promise.all(initialCards.map(id => getCardById(id)));
      
      // prendo la carta da indovinare
      const cardToGuess = await getCardById(cardId);
      if (!cardToGuess || initial.length < 3) return res.status(400).json({ error: 'Not valid cards!' });
      
      // prendo la GAMECARD associata alla carta e al gioco corrente
      const cardsOfGame = await getCardsOfGame(gameId);
      const gameCardObj = cardsOfGame.find(obj => obj.card.id === cardId && obj.gameCard.game_id === gameId);
      
      if (!gameCardObj) return res.status(400).json({ error: 'GameCard not found!' });
      
      // verifico se la posizione è corretta
      // Se guessIndex è -1 (timeout), la carta è automaticamente persa
      let guessed;
      if (guessIndex === -1) {
        guessed = 0; // Timeout = carta persa
      } else {
        guessed = checkCardPosition(guessIndex, cardToGuess, initial) ? 1 : 0;
      }
      
      // aggiorno la GAMECARD con l'esito
      const gameCard = { id: gameCardObj.gameCard.id, guessed: guessed };
      const changes = await setCardGuessed(gameCard);
      
      if (changes === 0) {
        return res.status(404).json({ error: 'GameCard not found or already updated!' });
      }
      else {
        // restituisco la risposta appropriata
        if (guessed === 1) {
          res.json({ guessed: 1, card: cardToGuess });
        } else {
          res.json({ guessed: 0 });
        }
      }
    } catch (err) {
      console.error('Error in /api/games/:gameId/cards/:cardId/guessed:', err);
      res.status(503).json({ error: err.message });
    }
  }
);

// GET SUMMARY OF GAME
app.get('/api/games/:gameId/summary', isLoggedIn, isGameOwner, async (req, res) => {
  try {
    const game = await getGameById(req.params.gameId);
    const cards = await getCardsOfGame(req.params.gameId); // [{ gameCard, card }] -> servono entrambe per il riepilogo
    if (game.error) return res.status(404).json(game); // game not found 404

    //! restituisco solo id, title (NON IL bad_luck_index)
    const initialCards = cards.filter(c => c.gameCard.initial === 1).map(obj => ({
      id: obj.card.id,
      title: obj.card.title
    }));
    const wonCards = cards.filter(c => c.gameCard.initial === 0 && c.gameCard.guessed === 1).map(obj => ({
      id: obj.card.id,
      title: obj.card.title
    }));
    const lostCards = cards.filter(c => c.gameCard.initial === 0 && c.gameCard.guessed === 0).map(obj => ({
      id: obj.card.id,
      title: obj.card.title
    }));
    res.json({
      game,
      initialCards,
      wonCards,
      lostCards,
      totalCollected: initialCards.length + wonCards.length,
      totalLost: lostCards.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ================== AUTENTICAZIONE ================

// Login
app.post('/api/sessions', passport.authenticate('local'), function(req, res) {
  return res.status(201).json(req.user);
});

// Stato sessione (loggato o no)
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) res.json(req.user);
  else res.status(401).json({ error: 'Not authenticated' });
});

// Logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

/*// DELETE GAME (solo se non conclusa)
app.delete('/api/games/:gameId', isLoggedIn, isGameOwner, async (req, res) => {
  try {
    const game = await getGameById(req.params.gameId);
    if (game.ended_at || game.result) {
      return res.status(400).json({ error: 'Cannot delete a finished game!' });
    }
    await deleteGameById(req.params.gameId);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});*/

// far partire il server
app.listen(port, () => { console.log(`API server started at http://localhost:${port}`); });