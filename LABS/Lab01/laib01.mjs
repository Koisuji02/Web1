// 'use strict';
//import dayjs from "dayjs";


//! DOMINIO = personaggi di show televisivi (anime, cartoon, serie tv, film)

// Proprietà dei personaggi e valori possibili
const properties = ["name", "fictionGenre", "role", "hairColor", "glasses", "gender", "hasPower"];
const values = {
    name: ["Sheldon Cooper", "Saul Goodman", "Jon Snow", "Mykasa Ackerman", "Harry Potter", "Lara Croft", "Bruce Wayne", "Morpheus", "Frodo Baggins", "Trinity", "T'Challa", "Katniss Everdeen", "Jules Winnfield", "Ellen Ripley", "Doctor Strange", "Mulan", "Darth Vader", "Gandalf", "Hercules", "Wednesday Addams", "Shrek", "Storm", "Rick Sanchez", "Dexter Morgan", "Alice", "Groot", "Neo", "Luffy", "Walter White", "Mystique", "Pennywise", "Goku", "Elsa", "Voldemort", "Legolas", "Jack Sparrow", "Scarlet Witch"],
    fictionGenre: ["comedy", "drama", "fantasy", "adventure", "action", "sci-fi", "superhero", "dystopian", "crime", "historical", "mythology", "horror", "anime"],
    role: ["main", "secondary"],
    hairColor: ["brown", "black", "bald", "white", "blonde", "red", "blue", "none"],
    glasses: [true, false],
    gender: ["male", "female"],
    hasPower: [true, false]
};

// Costruttore di Character
//! LA COMBINAZIONE DELLE PROPRIETA' DEVE ESSERE UNICA
//! TUTTE LE PROPRIETA' DEVONO ESSERE DEFINITE

function Character(name, fictionGenre, role, hairColor, glasses, gender, hasPower) {
    this.id = -1;
    this.name = name;
    this.fictionGenre=fictionGenre;
    this.role=role;
    this.hairColor=hairColor;
    this.glasses=glasses;
    this.gender=gender;
    this.hasPower=hasPower;
    // visible andrà messo poi a false durante il gioco per togliere i personaggi non selezionati dall'ipotesi (se vera) o quelli selezionati dall'ipotesi (se falsa)
    this.visible = true;

    this.toString = () => {
        return `${this.name} is ${this.gender}, is a ${this.role} of a ${this.fictionGenre} fiction.\n${this.hairColor} hair, ${this.glasses ? 'wears glasses' : 'does not wear glasses'}, ${this.hasPower ? 'has powers' : 'has no power'}.\n`};
}


// Costruttore di Ipotesi
// Property = nome della proprietà
// Value = valore della proprietà
function Hypothesis(property, value) {
    this.id = -1;
    this.property = property;
    this.value = value;
    this.correct = false;

    this.toString = () => {
        return `Property = ${this.property}\nValue = '${this.value}'\nCorrect = ${this.correct}\n `;
    }
}

function Game(difficulty) {
    this.difficulty = difficulty;
    this.characterList = [];
    this.hypothesisList = [];
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

    //! E' segreto, non deve essere accessibile dall'esterno
    /*this.getSecretCharacter=() => {
        return this.secretCharacter;
    }*/

    this.addCharacter = (character) =>{
        // Controlla se il personaggio è già presente nella lista
        if (this.characterList.length === 0){
            character.id = 0;
            this.characterList.push(character);
        }
        else if (!this.characterList.some(c => c.id === character.id)) {
            character.id = this.characterList.length;
            this.characterList.push(character);
        }
    }

    this.deleteCharacter = (character) => {
        this.characterList = this.characterList.filter(c => c.id !== character.id);
    }

    this.findCharacter = (character) => {
        return this.characterList.find(c => c.id === character.id);
    }

    this.findById = (id) =>{
        return this.characterList.filter(s=>s.id===id);
    }

    this.findByName = (name) => {
        return this.characterList.filter(s=>s.name===name);
    }

    this.findByFictionGenre = (genre) => {
        return this.characterList.filter(s=>s.fictionGenre===genre);
    }

    this.findByRole = (role) => {
        return this.characterList.filter(s=>s.role===role);
    }

    this.findByHairColor=(color) => {
        return this.characterList.filter(s=>s.hairColor===color);
    }

    this.findByGlasses=(bool) => {
        return this.characterList.filter(s=>s.glasses==bool);
    }

    this.findByGender=(gender) => {
        return this.characterList.filter(s=>s.gender=gender);
    }

    this.findByPower=(bool) => {
        return this.characterList.filter(s=>s.hasPower==bool);
    }

    this.deletById=(id)=>{
        return this.characterList.filter(s=>s.id!=id);
    }

    this.findVisible = () => {
        return this.characterList.filter(c => c.visible);
    }

    this.findNotVisible = () => {
        return this.characterList.filter(c => !c.visible);
    }

    this.setSecretCharacter=() => { //setto il personaggio segreto
        this.secretCharacter=this.characterList[Math.floor(Math.random()*this.max)];
    }

    this.addHypothesis=(hypothesis) => {
        if(hypothesis.value===this.secretCharacter[hypothesis.property]) {
            hypothesis.correct=true;
        }
        hypothesis.id = this.hypothesisList.length;
        this.hypothesisList.push(hypothesis);
    }

    this.printHypothesis=() => {
        for (let hyp of this.hypothesisList) {
            console.log(hyp.toString());
        }
    }

    this.removeHypothesis = (hypothesis) => {
        this.hypothesisList = this.hypothesisList.filter(h => h.id !== hypothesis.id);
    }

    this.findHypothesis = (hypothesis) => {
        return this.hypothesisList.find(h => h.id === hypothesis.id);
    }

    this.findCorrects = () => {
        return this.hypothesisList.filter(h => h.correct);
    }

    this.findProperty = (property) => {
        // dà tutte le ipotesi con una certa proprietà
        return this.hypothesisList.filter(h => h.property === property);
    }

    this.toString = () => {
        console.log(`Game difficulty: ${this.difficulty}\n\nThe characters are:`);
          
        for (let i=0;i<this.max;i++) {
            console.log(this.characterList[i].toString());
        }
    }
}

const game = new Game("easy");  //creo un nuovo gioco

const SheldonCooper= new Character("Sheldon Cooper", "comedy", "main", "brown", false, "male", false);
const SaulGoodman= new Character("Saul Goodman", "drama", "main", "black", false, "male", false);
const JonSnow= new Character("Jon Snow", "fantasy", "main", "black", false, "male", false);
const MykasaAckerman = new Character("Mykasa Ackerman", "fantasy", "secondary", "black", false, "female", false);
const HarryPotter = new Character("Harry Potter", "fantasy", "main", "black", true, "male", true);
const LaraCroft = new Character("Lara Croft", "adventure", "main", "brown", false, "female", false);
const BruceWayne = new Character("Bruce Wayne", "action", "main", "black", false, "male", true);
const Morpheus = new Character("Morpheus", "sci-fi", "secondary", "bald", false, "male", true);
const FrodoBaggins = new Character("Frodo Baggins", "fantasy", "main", "brown", false, "male", true);
const Trinity = new Character("Trinity", "sci-fi", "main", "black", false, "female", true);
const TChalla = new Character("T'Challa", "superhero", "main", "black", false, "male", true);
const KatnissEverdeen = new Character("Katniss Everdeen", "dystopian", "main", "brown", false, "female", false);
const JulesWinnfield = new Character("Jules Winnfield", "crime", "secondary", "black", false, "male", false);
const EllenRipley = new Character("Ellen Ripley", "sci-fi", "main", "brown", false, "female", false);
const DoctorStrange = new Character("Doctor Strange", "superhero", "main", "brown", false, "male", true);
const Mulan = new Character("Mulan", "historical", "main", "black", false, "female", false);
const DarthVader = new Character("Darth Vader", "sci-fi", "main", "black", false, "male", true);
const Gandalf = new Character("Gandalf", "fantasy", "main", "white", false, "male", true);
const Hercules = new Character("Hercules", "mythology", "main", "brown", false, "male", true);
const WednesdayAddams = new Character("Wednesday Addams", "horror", "main", "black", true, "female", true);
const Shrek = new Character("Shrek", "fantasy", "main", "bald", false, "male", true);
const Storm = new Character("Storm", "superhero", "main", "white", false, "female", true);
const RickSanchez = new Character("Rick Sanchez", "sci-fi", "main", "blue", false, "male", true);
const DexterMorgan = new Character("Dexter Morgan", "crime", "main", "brown", false, "male", false);
const Alice = new Character("Alice", "fantasy", "main", "blonde", false, "female", true);
const Groot = new Character("Groot", "sci-fi", "secondary", "none", false, "male", true);
const Neo = new Character("Neo", "sci-fi", "main", "black", false, "male", true);
const Luffy = new Character("Luffy", "anime", "main", "black", false, "male", true);
const WalterWhite = new Character("Walter White", "drama", "main", "bald", false, "male", false);
const Mystique = new Character("Mystique", "superhero", "secondary", "red", false, "female", true);
const Pennywise = new Character("Pennywise", "horror", "main", "red", false, "male", true);
const Goku = new Character("Goku", "anime", "main", "black", false, "male", true);
const Elsa = new Character("Elsa", "fantasy", "main", "blonde", false, "female", true);
const Voldemort = new Character("Voldemort", "fantasy", "main", "bald", false, "male", true);
const Legolas = new Character("Legolas", "fantasy", "main", "blonde", false, "male", true);
const JackSparrow = new Character("Jack Sparrow", "adventure", "main", "brown", false, "male", false);
const ScarletWitch = new Character("Scarlet Witch", "superhero", "main", "red", false, "female", true);
game.addCharacter(SheldonCooper);
game.addCharacter(SaulGoodman);  
game.addCharacter(JonSnow);
game.addCharacter(MykasaAckerman);
game.addCharacter(HarryPotter);
game.addCharacter(LaraCroft);
game.addCharacter(BruceWayne);
game.addCharacter(Morpheus);
game.addCharacter(FrodoBaggins);
game.addCharacter(Trinity);
game.addCharacter(TChalla);
game.addCharacter(KatnissEverdeen);
game.addCharacter(JulesWinnfield);
game.addCharacter(EllenRipley);
game.addCharacter(DoctorStrange);
game.addCharacter(Mulan);
game.addCharacter(DarthVader);
game.addCharacter(Gandalf);
game.addCharacter(Hercules);
game.addCharacter(WednesdayAddams);
game.addCharacter(Shrek);
game.addCharacter(Storm);
game.addCharacter(RickSanchez);
game.addCharacter(DexterMorgan);
game.addCharacter(Alice);
game.addCharacter(Groot);
game.addCharacter(Neo);
game.addCharacter(Luffy);
game.addCharacter(WalterWhite);
game.addCharacter(Mystique);
game.addCharacter(Pennywise);
game.addCharacter(Goku);
game.addCharacter(Elsa);
game.addCharacter(Voldemort);
game.addCharacter(Legolas);
game.addCharacter(JackSparrow);
game.addCharacter(ScarletWitch);


game.setSecretCharacter();
game.toString();

console.log("Secret character: "+game.secretCharacter.name);

const hypothesis1=new Hypothesis("name", "Sheldon Cooper");
const hypothesis2=new Hypothesis("role", "main");
const hypothesis3=new Hypothesis("fictionGenre", "comedy");

game.addHypothesis(hypothesis1);  
game.addHypothesis(hypothesis2);
game.addHypothesis(hypothesis3);

game.printHypothesis();
