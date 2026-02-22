// import
import express from 'express';
import morgan from 'morgan';
import {check, validationResult} from 'express-validator';
import {
  listCharacters,
  addCharacter,
  updateCharacter,
  deleteCharacterById,
  resetVisibility,
  updateVisibilityByHypothesis,
  setSecretCharacter,
  getHypothesesByGameId,
  addHypothesis,
  getGame
} from './dao.mjs';
import cors from 'cors';

// init
const app = express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));

// uso corsOptions per evitare il problema di CORS di permettere le richieste da ogni origine; in questo caso permetto le richieste solo da localhost:5173 (dove gira il client React)
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessState: 200
};

app.use(cors(corsOptions));

/*** ROUTES ***/

//! GET /api/characters
app.get('/api/characters', async (req, res) => {
  try {
    const characters = await listCharacters();
    res.json(characters);
  } catch {
    res.status(500).end();
  }
});

//! POST /api/characters
app.post('/api/characters', [
  check('name').isString().notEmpty(),
  check('fictionGenre').isString().notEmpty(),
  check('role').isString().notEmpty(),
  check('hairColor').isString().notEmpty(),
  check('glasses').isBoolean(),
  check('gender').isString().notEmpty(),
  check('hasPower').isBoolean()
], async (req, res) =>{

  //? controllo errori di validazione
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const newCharacter = req.body;
  try {
    const character = await addCharacter(newCharacter);
    res.status(201).json(character);
  }
  catch {
    res.status(503).json({ error: 'Impossible to create the character.' });
  }

});

//! PUT /api/characters/<id>
app.put(
  '/api/characters/:id',
  [
    check('name').isString().notEmpty(),
    check('fictionGenre').isString().notEmpty(),
    check('role').isString().notEmpty(),
    check('hairColor').isString().notEmpty(),
    check('glasses').isBoolean(),
    check('gender').isString().notEmpty(),
    check('hasPower').isBoolean()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(422).json({ errors: errors.array() });
    }

    const updatedCharacter = req.body;
    updatedCharacter.id = req.params.id;

    try {
      console.log('Updating character:', updatedCharacter);
      const character = await updateCharacter(updatedCharacter);
      if (character.error) {
        console.error('Character not found:', character);
        res.status(404).json(character);
      } else {
        console.log('Character updated successfully:', character);
        res.json(character); // Status 200 by default
      }
    } catch (e) {
      console.error('Error updating character:', e.message);
      res.status(503).json({ error: `Impossible to update character #${req.params.id}.` });
    }
  }
);

//! DELETE /api/characters/<id>
app.delete('/api/characters/:id', async (req, res) => {
  try {
    const result = await deleteCharacterById(req.params.id);
    if (result.error) {
      res.status(404).json(result);
    } else{
      res.status(204).end();
    }
  } catch {
    res.status(503).json({ error: `Impossible to delete character #${req.params.id}.` });
  }
});

//! POST /api/characters/reset-visibility
app.post('/api/characters/reset-visibility', async (req, res) => {
  try {
    await resetVisibility();
    res.status(204).end();
  } catch {
    res.status(503).json({ error: 'Impossible to reset visibility.' });
  }
});

//! POST /api/hypotheses/<id>/update-visibility
app.post('/api/hypotheses/:id/update-visibility', async (req, res) => {
  try {
    const hypothesis = req.body;
    await updateVisibilityByHypothesis(hypothesis);
    res.status(204).end();
  } catch {
    res.status(503).json({ error: 'Impossible to update visibility based on the hypothesis.' });
  }
});

//! POST /api/games/<id>/set-secret-character
app.post('/api/games/:id/set-secret-character', async (req, res) => {
  try {
    const game = await getGame(req.params.id);
    if (game.error) {
      res.status(404).json(game);
    } else{
      await setSecretCharacter(game);
      res.status(204).end();
    }
  } catch {
    res.status(503).json({ error: 'Impossible to set the secret character.' });
  }
});

//! GET /api/games/<id>/hypotheses
app.get('/api/games/:id/hypotheses', async (req, res) => {
  try {
    const game = await getGame(req.params.id);
    if (game.error) {
      res.status(404).json(game);
    } else{
      const hypotheses = await getHypothesesByGameId(req.params.id);
      res.json(hypotheses);
    }
  } catch {
    res.status(500).json({ error: 'Impossible to retrieve hypotheses for the game.' });
  }
});

//! POST /api/games/<id>/hypotheses
app.post(
  '/api/games/:id/hypotheses',
  [
    check('property').isString().notEmpty(),
    check('value').isString().notEmpty(),
    check('correct').isBoolean(),
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const newHypothesis = req.body;
    const gameId = req.params.id;
    const game = await getGame(gameId);

    if (game.error) {
      res.status(404).json(game);
    }
    else{
      try {
        const hypothesis = await addHypothesis(newHypothesis, gameId);
        res.status(201).json(hypothesis);
      } catch {
        res.status(503).json({ error: 'Impossible to add the hypothesis to the game.' });
      }
    }
  }
);

// start server
app.listen(port, () => {
  console.log(`API server started at http://localhost:${port}`);
});