import { Col, Row } from 'react-bootstrap';
import { Outlet, useParams } from "react-router";

function QuestionDescription (props) {
  const  {questionId} = useParams();
  const question = props.questions[questionId-1];

  return(
    <>
      {/* OPERATORE TERNARIO, se c'è domanda renderizza, altrimenti Domanda non trovata */}
      { question ?
      <>
        <Row>
          <Col md={6} as='p'>
            <strong>Question #{question.id}:</strong>
          </Col>
          <Col md={6} as='p' className='text-end'>
            Asked by <span className='badge rounded-pill text-bg-secondary'>{question.email}</span>
          </Col>
        </Row>
        <Row>
          <Col as='p' className='lead'>{question.text}</Col>
        </Row>
        {/* OUTLET mi permette di vedere la Route figlio, in questo caso le Answers della Question */}
        <Outlet />
      </> :
      <Row>
        <Col as="p" className="lead">The selected question is not available!</Col>
      </Row> }
    </>
  );
}

export default QuestionDescription;