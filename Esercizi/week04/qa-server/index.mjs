// import
import express from 'express';
import morgan from 'morgan';
import {check, validationResult} from 'express-validator';
//! IMPORTATI AUTOMATICAMENTE DA DAO, altrimenti importare manualmente
import {listQuestions, getQuestion, listAnswersOf, addAnswer, updateAnswer, voteAnswer} from './dao.mjs';

// init
const app = express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));

/* ROUTES */

// GET /api/questions
app.get('/api/questions', (req, res) => {
  listQuestions()
  // converte questions in json e manda in response
  .then(questions => res.json(questions))
  // se errore, manda status 500 e termina response
  .catch(() => res.status(500).end());
});

// GET /api/questions/<id>
// uso async/await per gestire promise in modo asincrono (in modo che aspetto che la question sia stata presa per proseguire)
app.get('/api/questions/:id', async (request, response) => {
  try {
    const question = await getQuestion(request.params.id);
    if(question.error) {
      response.status(404).json(question);
    } else {
      // mette automaticamente lo status a 200
      response.json(question);
    }
  }
  catch {
    response.status(500).end();
  }
});

// GET /api/questions/<id>/answers
app.get('/api/questions/:id/answers', async (req, res) => {
  try {
    const answers = await listAnswersOf(req.params.id);
    res.json(answers);
  } catch {
    res.status(500).end();
  }
});

// POST /api/questions/<id>/answers
// uso express-validator per validare i dati in input (middleware) nel formato app.post('path', middleware, callback)
app.post('/api/questions/:id/answers',
  [
  check('text').notEmpty(),
  check('email').isEmail(),
  check('score').isNumeric(),
  check('date').isDate({format: 'YYYY-MM-DD', strictMode: true})
  ], 
  async (req, res) => {
    // validationResult(req) ritorna un oggetto con i risultati della validazione dato dalle varie check() del middleware express-validator sopra
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }

    const newAnswer = req.body;
    const questionId = req.params.id;

    try {
      const id = await addAnswer(newAnswer, questionId);
      // location() setta l'header Location della response con il path del nuovo oggetto creato
      res.status(201).location(id).end();
    } catch(e) {
      console.error(`ERROR: ${e.message}`);
      res.status(503).json({error: 'Impossible to create the answer.'});
    }
  }
);

// PUT /api/answers/<id>
app.put('/api/answers/:id', [
  check('text').notEmpty(),
  check('email').isEmail(),
  check('score').isNumeric(),
  check('date').isDate({format: 'YYYY-MM-DD', strictMode: true})
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const answerToUpdate = req.body;
  answerToUpdate.id = req.params.id;

  try {
    await updateAnswer(answerToUpdate);
    res.status(200).end();
  } catch {
    res.status(503).json({'error': `Impossible to update answer #${req.params.id}.`});
  }
});

// POST /api/answers/<id>/vote
app.post('/api/answers/:id/vote', [
  check('vote').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const answerId = req.params.id;
  try {
    const num = await voteAnswer(answerId, req.body.vote);
    if(num === 1)
      res.status(204).end();
    else
      throw new Error(`Error in casting a vote for answer #${answerId}`);
  } catch(e) {
    res.status(503).json({error: e.message});
  }
});

// far partire il server
app.listen(port, () => { console.log(`API server started at http://localhost:${port}`); });