import { useActionState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import dayjs from "dayjs";

function AnswerForm(props) {
  
  const initialState = {
    // al posto di scrivere props.answer.text per edit e "" per add, uso la sintassi di optional chaining (props.answer?.text)
    text: props.answer?.text,
    email: props.answer?.email,
    // qua uso ?? per dire che se non c'è la data (nel caso di add) uso dayjs() (la data di oggi); funziona così: elemento1 ?? elemento2 => se elemento1 è undefined o null allora uso elemento2
    date: props.answer?.date ?? dayjs()
  };
  
  const handleSubmit = async (prevState, formData) => {
    // creo un oggetto {} dal FormData
    const answer = Object.fromEntries(formData.entries());

    // esempio di validazione
    if(answer.text.trim() === "") {
      answer.error = "The answer can't be empty, please fix it!";
      return answer;
    }
    
    if(props.addAnswer)
      // aggiungo la risposta allo stato in App
      props.addAnswer(answer);
    else
      // modifico la risposta
      props.editAnswer({id: props.answer.id, ...answer});

    // ritorno lo stato del form
    return initialState;
  }

  const [state, formAction] = useActionState(handleSubmit, initialState);

  return(
    <>
      { state.error && <Alert variant="secondary">{state.error}</Alert> }
      <Form action={formAction}>
        <Form.Group className="mb-3">
          <Form.Label>Text</Form.Label>
          <Form.Control name="text" type="text" required={true} minLength={2} defaultValue={state.text}></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>email</Form.Label>
          <Form.Control name="email" type="email" required={true} defaultValue={state.email}></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control name="date" type="date" required={true} min={dayjs().format("YYYY-MM-DD")} defaultValue={state.date.format("YYYY-MM-DD")}></Form.Control>
        </Form.Group>
        { props.addAnswer && <Button variant="primary" type="submit">Add</Button> }
        { props.editAnswer && <Button variant="success" type="submit">Update</Button> }
        {/* il caratter " " è un modo per aggiungere uno spazio in React*/}
        {" "}
        <Button variant="danger" onClick={props.cancel}>Cancel</Button>
      </Form>
    </>
  );
}

export default AnswerForm;