"use strict";

const names = " Luigi De Russis, Luca Scibetta, Fulvio Corno, Francesca Russo";

// creare array dai nomi
const nameArray = names.split(",");

// rimuovere gli spazi extra
for(let i=0; i<nameArray.length; i++){
  nameArray[i] = nameArray[i].trim();
}

// creazione degli acronimi
const acronyms = [];

for(let name of nameArray) {
  const words = name.split(" ");
  let initials = "";
  for(const word of words){
    initials += word[0];
  }
  acronyms.push(initials);
}

// stampare il risultato
for(let i=0; i <nameArray.length; i++)
  console.log(`${acronyms[i]} - ${nameArray[i]}`);
