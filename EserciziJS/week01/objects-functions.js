"use strict";

// oggetto
const movie = {
  title: 'Forrest Gump',
  genre: 'Drama',
  duration: 142
};

console.log(movie.title);
console.log(movie['title']);

delete movie.genre;

for(const prop in movie){
  console.log(`${prop} is ${movie[prop]}`);
}

// funzione costruttore
function Movie(title, genre, duration) {
  this.title = title;
  this.genre = genre;
  this.duration = duration;
  this.isLong = () => this.duration > 120; // metodo
}

let forrest = new Movie("Forrest Gump", "Drama", 142);
console.log(forrest.isLong());

// copia di oggetto
const titanic = Object.assign({}, movie);
console.log(titanic);

Object.assign(movie, {budget: '200 millions USD'});
console.log(movie);

const titanic2 = {... movie};