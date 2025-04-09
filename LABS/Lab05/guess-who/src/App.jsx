import "bootstrap/dist/css/bootstrap.min.css";
//import { useState } from "react";
import { Container } from "react-bootstrap";

import NavHeader from "./components/NavHeader";
import CharacterGrid from "./components/CharacterGrid";
import HypothesisBuilder from "./components/HypothesisBuilder";
import Footer from "./components/Footer";
import { Character, Hypothesis, Game } from "./models/models.mjs";


function App() {

  const characters = [
    { id: 0, name: 'Sheldon Cooper', fictionGenre: 'comedy', role: 'main', hairColor: 'brown', glasses: false, gender: 'male', hasPower: false, visible: true },
    { id: 1, name: 'Saul Goodman', fictionGenre: 'drama', role: 'main', hairColor: 'black', glasses: false, gender: 'male', hasPower: false, visible: true },
    { id: 2, name: 'Jon Snow', fictionGenre: 'fantasy', role: 'main', hairColor: 'black', glasses: false, gender: 'male', hasPower: false, visible: true },
    { id: 3, name: 'Mykasa Ackerman', fictionGenre: 'fantasy', role: 'secondary', hairColor: 'black', glasses: false, gender: 'female', hasPower: false, visible: true },
    { id: 4, name: 'Harry Potter', fictionGenre: 'fantasy', role: 'main', hairColor: 'black', glasses: true, gender: 'male', hasPower: true, visible: true }
  ];

  return (
    <>
      <NavHeader />
      <Container fluid className="mt-3">
        <HypothesisBuilder />
        <CharacterGrid characters={characters} />
      </Container>
      <Footer />
    </>
  )
}

export default App
