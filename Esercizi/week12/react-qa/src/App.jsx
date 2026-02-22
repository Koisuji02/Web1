import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

import { Answer } from "./models/QAModels.mjs";
import DefaultLayout from "./components/DefaultLayout";
import QuestionDescription from "./components/QuestionDescription";
import Answers from "./components/Answers";
import Questions from "./components/Questions";
import { Routes, Route } from "react-router";
import { AnswerForm, EditAnswerForm } from "./components/AnswerForm";
import NotFound from "./components/NotFound";
import API from "./API/API.mjs";

function App() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const getQuestions = async () => {
      const questions = await API.getQuestions();
      setQuestions(questions);
    }
    getQuestions();
  }, []);

  return (
    <Routes>
      <Route element={ <DefaultLayout /> } >
        <Route path="/" element={ <Questions questions={questions}/> } />
        <Route path="/questions/:questionId" element={ <QuestionDescription questions={questions} /> } >
          <Route index element={ <Answers /> } />
          <Route path="answers/new" element={ <AnswerForm addAnswer={true} /> } />
          <Route path="answers/:answerId/edit" element={ <EditAnswerForm editAnswer={true} /> } />
        </Route>
        <Route path="*" element={ <NotFound /> } />
      </Route>
    </Routes>
  )

}

export default App;