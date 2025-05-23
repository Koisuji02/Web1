"use strict";

const scores = [-20, -5, -1, 100, -3, 30, 50, 10];
const betterScores = [];
let NN = 0;

for (let s of scores) {
  if(s>=0)
    betterScores.push(s);
}

NN = scores.length - betterScores.length;

// VERSIONE CON MIN (devo prendere 2 valori minimi)
/*
let minScore = Math.min(...betterScores);
let index = betterScores.indexOf(minScore);
betterScores.splice(index, 1);

minScore = Math.min(...betterScores);
index = betterScores.indexOf(minScore);
betterScores.splice(index, 1);
*/

// VERSIONE CON SORT
betterScores.sort((a, b) => a-b); // come in Java tipo
// 2 shift perchè devo prendere i 2 minimi
betterScores.shift();
betterScores.shift();

let avg = 0;
for (let s of betterScores)
  avg += s;

avg /= betterScores.length;
avg = Math.round(avg); // come in Java devo arrotondare

for(let i=0; i<NN+2; i++)
  betterScores.push(avg);

console.log(scores);
console.log(betterScores);
