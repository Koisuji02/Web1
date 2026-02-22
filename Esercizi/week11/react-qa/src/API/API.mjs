import { Answer, Question } from "../models/QAModels.mjs";

const SERVER_URL = "http://localhost:3001";

// tutte le domande
// GET /api/questions
const getQuestions = async () => {
  const response = await fetch(SERVER_URL + "/api/questions");

  // essendo una Promise, devo usare ok per verificare se la risposta è andata a buon fine, oppure lancio un errore; inoltre gli errori HTTP non vengono visti come errori da fetch (ogni risposta [indipendentemente dal codice di stato] viene considerata una risposta valida, quindi non viene lanciata un'eccezione); la fetch rileva solo problemi di rete !!!
  // per questo motivo, devo controllare se la risposta è ok (200) o meno
  if(response.ok) {

    // usiamo il metodo json() per convertire la risposta in un oggetto JSON in quanto il body di una risposta HTTP è trasformabile in un oggetto JSON
    const questionsJson = await response.json();

    // posso usare return di un oggetto restituito da map perchè questa crea un nuovo array
    return questionsJson.map(q => new Question(q.id, q.text, q.email, q.userId, q.date));
  }
  else
    throw new Error("Internal server error");
}

// tutte le risposte di una certa domanda
// GET /api/questions/<id>/answers
const getAnswers = async (questionId) => {
  const response = await fetch(`${SERVER_URL}/api/questions/${questionId}/answers`);
  if(response.ok) {
    const answersJson = await response.json();
    return answersJson.map(ans => new Answer(ans.id, ans.text, ans.email, ans.userId, ans.date, ans.score));
  }
  else
    throw new Error("Ops, there is an error on the server.");
}

// uso l'oggetto API per esportare le funzioni che voglio rendere disponibili all'esterno (più modulare)
const API = { getAnswers, getQuestions };
export default API;