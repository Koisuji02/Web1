// import
import express from 'express';
import morgan from 'morgan';
import {check, validationResult} from 'express-validator';
import {listQuestions, getQuestion, listAnswersOf, addAnswer, updateAnswer, voteAnswer} from './dao.mjs';
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
  // uso anche optionsSuccessState per evitare problemi con le versioni più vecchie di alcuni browser (questo perchè Cors prima di mandare una richiesta manda una richiesta 204; ad alcuni browser non piace) [browser legacy]
  optionsSuccessState: 200
};

app.use(cors(corsOptions));

/* ROUTES */

// GET /api/questions
app.get('/api/questions', (req, res) => {
  listQuestions()
  .then(questions => res.json(questions))
  .catch(() => res.status(500).end());
});

// GET /api/questions/<id>
app.get('/api/questions/:id', async (request, response) => {
  try {
    const question = await getQuestion(request.params.id);
    if(question.error) {
      response.status(404).json(question);
    } else {
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
app.post('/api/questions/:id/answers', [
  check('text').notEmpty(),
  check('email').isEmail(),
  check('score').isNumeric(),
  check('date').isDate({format: 'YYYY-MM-DD', strictMode: true})
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const newAnswer = req.body;
  const questionId = req.params.id;

  try {
    const id = await addAnswer(newAnswer, questionId);
    res.status(201).location(id).end();
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(503).json({error: 'Impossible to create the answer.'});
  }
});

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