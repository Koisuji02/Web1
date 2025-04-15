import dayjs from "dayjs";

// Costruttore di Answer
//! metto come default di score il valore 0 se non presente, ma come faccio a saltarlo? mi conviene metterlo in fondo per usare il default
function Answer(text, username, date, score=0) {
    this.text = text;
    this.username = username;
    this.date = dayjs(date); // converto la stringa data in un oggetto dayjs
    this.score = score;

    // se c'è un metodo toString in JavaScript, questo viene automaticamente chiamato in Stampa (come in Java)
    this.toString = () => {
        return `${this.username} replied '${this.text}' on ${this.date.format('YYYY-MM-DD')} and got score of ${this.score} `;
    }
}

// Costruttore di Question
function Question(text, username, date) {
    this.text = text;
    this.username = username;
    this.date = dayjs(date);
    this.answers = []; // all'inizio, la domanda avrà 0 risposte, si aggiungeranno man mano

    // metodo addAnswer (definisco nella classe come arrow function)
    this.add = (answer) =>{
        this.answers.push(answer);
    }

    this.find = (username) => {
        // senza metodo funzionale
        /*const foundAnswers = []
        for(const ans of this.answers){
            if(ans.username === username)
                foundAnswers.push(ans);
        }
        return foundAnswers;*/
        // metodo funzionale
        return this.answers.filter(ans => ans.username === username);
    }

    this.afterDate = (date) => {
        return this.answers.filter(ans => ans.date.isAfter(dayjs(date)));
    }

    this.listByDate = () => {

        return [...this.answers].sort((a,b) => (a.date.isAfter(b.date) ? 1 : -1));
        // return [...this.answers].sort((a,b) => (a.date.isAfter(b.date) ? -1 : 1)); con il sort opposto
        //! [...array] per copiare array e quindi non modificare l'array originale, ma crearne una copia e darla in return ordinata
    }

    this.listByScore = () => {
        // DECRESCENTE
        return [...this.answers].sort((a,b) => b.score - a.score);
    }
}

const question = new Question('Is JS better than Python?', 'Mattia Domizio', '2025-03-03');
const firstAnswer = new Answer('Yes', 'Luca Mannella', '2025-03-04', -10);
const secondAnswer = new Answer('No', 'Guido van Rossum', '2025-03-07', 5);
const thirdAnswer = new Answer('No 2', 'Albert Einstein', '2025-03-08');
const fourthAnswer = new Answer('I don\'t know', 'Luca Mannella', '2025-03-09')

question.add(firstAnswer);
question.add(secondAnswer);
question.add(thirdAnswer);
question.add(fourthAnswer);

const answersByLuca = question.find('Luca Mannella');
console.log(question);
console.log("\nAnswers by Luca: " + answersByLuca);
console.log('\nBy date: ' + question.listByDate());
console.log('\nBy score: ' + question.listByScore());
console.log('\nAfter 2025-03-06: ' + question.afterDate('2025-03-06'));