import { Table, Button, ButtonGroup } from 'react-bootstrap';

function HypothesisBuilder() {
  // Dati per le proprietà e i relativi valori
  const hypotheses = [
    { property: 'fictionGenre', options: ['comedy', 'drama', 'fantasy', 'adventure', 'action', 'sci-fi', 'superhero', 'dystopian', 'crime', 'historical', 'mythology', 'horror', 'anime'] },
    { property: 'role', options: ['main', 'secondary'] },
    { property: 'hairColor', options: ['brown', 'black', 'white', 'bald', 'blue', 'blonde', 'none', 'red'] },
    { property: 'glasses', options: [true, false] },
    { property: 'gender', options: ['male', 'female'] },
    { property: 'hasPower', options: [true, false] }
  ];

  return (
    <div className="mb-4">
      <h2 className="text-center">Compose Your Hypothesis</h2>
      <Table bordered className="text-center">
        <thead>
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {hypotheses.map((hypothesis, index) => (
            <tr key={index}>
              <td>{hypothesis.property}</td>
              <td>
                <HypothesisButton options={hypothesis.options} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function HypothesisButton(props) {
  const { options } = props; // Estraggo le opzioni da props

  return (
    <ButtonGroup>
      {options.map((option, index) => (
        <Button key={index} variant="outline-secondary" className="mx-1">
          {option}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export default HypothesisBuilder;