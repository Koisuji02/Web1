//import dayjs from 'dayjs';

// Costruttore di Character
function Character(name, fictionGenre, role, hairColor, glasses, gender, hasPower) {
    this.id = null; // ID sarà assegnato dal database (autoincrementale)
    this.name = name;
    this.fictionGenre = fictionGenre;
    this.role = role;
    this.hairColor = hairColor;
    this.glasses = glasses;
    this.gender = gender;
    this.hasPower = hasPower;
    this.visible = true;

    this.toString = () => {
        return `${this.name} is ${this.gender}, is a ${this.role} of a ${this.fictionGenre} fiction.\n${this.hairColor} hair, ${this.glasses ? 'wears glasses' : 'does not wear glasses'}, ${this.hasPower ? 'has powers' : 'has no power'}.\n`};
}

// Costruttore di Ipotesi
function Hypothesis(property, value, correct) {
    this.id = null; // ID sarà assegnato dal database
    this.property = property;
    this.value = value;
    this.correct = correct;

    this.toString = () => {
        return `Property = ${this.property}\nValue = '${this.value}'\nCorrect = ${this.correct}\n `;
    }
}

// Costruttore di Game
function Game(difficulty) {
    this.id = null; // ID sarà assegnato dal database
    this.difficulty = difficulty;
    //this.hypothesisList = [];
    this.secretCharacter = null;
    this.max = 0;

    if(this.difficulty=="easy") {
        this.max=12;
    }
    else if(this.difficulty=="medium") {
        this.max=24;
    }
    else if(this.difficulty=="hard") {
        this.max=36;
    }
    else {
        console.log("Invalid difficulty");
        return;
    }
}


//! IMPORTANTE -> esportiamo i costruttori per poterli utilizzare in altri file
export { Character, Hypothesis, Game };