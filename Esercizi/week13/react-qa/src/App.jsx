import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

import DefaultLayout from "./components/DefaultLayout";
import QuestionDescription from "./components/QuestionDescription";
import Answers from "./components/Answers";
import Questions from "./components/Questions";
import { Routes, Route, Navigate } from "react-router";
import { AnswerForm, EditAnswerForm } from "./components/AnswerForm";
import { LoginForm } from "./components/AuthComponents";
import NotFound from "./components/NotFound";
import API from "./API/API.mjs";

function App() {
  const [questions, setQuestions] = useState([]);

  //! aggiunti per auth
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    const getQuestions = async () => {
      const questions = await API.getQuestions();
      setQuestions(questions);
    }
    getQuestions();
  }, []);

  //! aggiunto per auth
  // quando l'app parte, facciamo una richiesta al server per vedere se l'utente è loggato
  useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo(); // we have the user info here
      setLoggedIn(true);
      setUser(user);
    };
    checkAuth();
  }, []);

  //! aggiunto per auth
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
      setUser(user);
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  //! aggiunto per auth (analogo a login)
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setMessage('');
  };

  {/* ROUTES
    
    - / => tutte le domande (index)
    - /questions/:qid => domanda "id" con le sue risposte

    OPZIONE 1:
    - /questions/:qid/answers/new => nuova risposta
    - /questions/:qid/answers/:aid/edit => modifica risposta

    OPZIONE 2:
    - /answers/:aid/edit => modifica risposta

    - * => pagina not found

    */}

  return (
    <Routes>
      {/* Layout gestisce i messaggi di alert di errori di login */}
      <Route element={ <DefaultLayout loggedIn={loggedIn} handleLogout={handleLogout} message={message} setMessage={setMessage} /> } >
        <Route path="/" element={ <Questions questions={questions}/> } />
        <Route path="/questions/:questionId" element={ <QuestionDescription questions={questions} /> } >
          <Route index element={ <Answers user={user} /> } />
          <Route path="answers/new" element={loggedIn ? <AnswerForm addAnswer={true} user={user} /> : <Navigate replace to='/' />} />
          <Route path="answers/:answerId/edit" element={loggedIn ? <EditAnswerForm editAnswer={true} /> : <Navigate replace to='/' />} /> 
        </Route>

        //! aggiunto per auth (se utente loggato, mi manda alla home; altrimenti mi fa vedere il form di login)
        <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginForm handleLogin={handleLogin} />} />
        <Route path="*" element={ <NotFound /> } />
      </Route>
    </Routes>
  )

}

export default App;