import "bootstrap-icons/font/bootstrap-icons.css";
import { Row, Col, Table, Button } from "react-bootstrap";
import AnswerForm from "./AnswerForm";
import { useState } from "react";

function Answers (props) {
  // non posso usare uno stato solo booleano, ma devo usare uno stato ternario perchè ho 3 modalità: view (form non visibile), add (form visibile per aggiungere) e edit (form visibile per modificare)
  const [mode, setMode] = useState("view");
  // uso un altro stato per tenere traccia della risposta che voglio modificare (la risposta è nella tabella, ma il form è in un altro posto [il form non è nella tabella; se fosse dentro, mi basterebbe usare delle props])
  const [editableAnswer, setEditableAnswer] = useState();

  const handleEdit = (answer) => {
    setEditableAnswer(answer);
    setMode("edit");
  }

  return(
    <>
    <Row>
      <Col as="h2">Answers:</Col>
    </Row>
    <Row>
      <Col lg={10} className="mx-auto">
        <AnswerTable answers={props.answers} voteUp={props.voteUp} handleEdit={handleEdit} deleteAnswer={props.deleteAnswer} />

        { mode === "view" && <Button variant="primary" onClick={() => setMode("add")}>Add</Button>}

        { mode === "add" && <AnswerForm addAnswer={(answer) => {props.addAnswer(answer); setMode("view");}} cancel={() => setMode("view")}/>}
        
        {/* devo usare key per fare in modo che quando clicco su un pulsante di Edit di una risposta e poi lo clicco su un'altra, React si accorge del cambiamento (basandosi sull'id dell'oggetto) e mi cambia il form */}
        { mode === "edit" && <AnswerForm key={editableAnswer.id} answer={editableAnswer} editAnswer={(answer) => {props.editAnswer(answer); setMode("view");}} cancel={() => setMode("view")} />}

      </Col>
    </Row>
    </>
  );
}

function AnswerTable (props) {
  const [sortOrder, setSortOrder] = useState("none");

  const sortedAnswers = [...props.answers];
  if(sortOrder === "asc")
    sortedAnswers.sort((a,b) => a.score - b.score);
  else if (sortOrder == "desc")
    sortedAnswers.sort((a,b) => b.score - a.score);

  const sortByScore = () => {
    setSortOrder(oldOrder => oldOrder === "asc" ? "desc" : "asc");
  }

  return (
    <Table striped>
      <thead>
        <tr>
          <th>Date</th>
          <th>Text</th>
          <th>Author</th>
          <th>Score <Button variant="link" className="text-black" onClick={sortByScore}><i className={sortOrder ==="asc" ? "bi bi-sort-numeric-up" : "bi bi-sort-numeric-down"}></i></Button></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        { sortedAnswers.map((ans) => <AnswerRow key={ans.id} answer={ans} voteUp={props.voteUp} handleEdit={props.handleEdit} deleteAnswer={props.deleteAnswer} />) }
      </tbody>
    </Table>
  );
}

function AnswerRow(props) {
  // ...props passa tutte le props che sono passate a AnswerRow (props è un oggetto) ad AnswerAction (questo perchè mi servono tutte le props di AnswerRow in AnswerAction)
  return(
    <tr><AnswerData answer={props.answer} /><AnswerAction {...props} /></tr>
  );
}

function AnswerData(props) {
  return(
    <>
      <td>{props.answer.date.format("YYYY-MM-DD")}</td>
      <td>{props.answer.text}</td>
      <td>{props.answer.email}</td>
      <td>{props.answer.score}</td>
    </>
  );
}

function AnswerAction(props) {
  return(
    <td>
      <Button variant="warning" onClick={() => props.voteUp(props.answer.id)}><i className="bi bi-arrow-up" /></Button>
      <Button variant="primary" className="mx-1" onClick={() => props.handleEdit(props.answer)}><i className="bi bi-pencil-square" /></Button> 
      <Button variant="danger"><i className="bi bi-trash" onClick={() => props.deleteAnswer(props.answer.id)} /></Button>
    </td>
  );
}

export default Answers;