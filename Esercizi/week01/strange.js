/* Strange JS behaviors and where to find (some of) them */
'use strict';

//! PER RUNNARE LO SCRIPT SI FA SUL TERMINALE: node strange.js

const type = typeof NaN;
console.log('NaN is a ' + type); // number

//! CONFRONTARE NaN con qualcosa da sempre false (NaN è unico)
console.log(`NaN === NaN? ${NaN === NaN}\n`); // false
console.log(`NaN == NaN? ${NaN == NaN}`); // false
//! Per verificare se un valore è NaN si usa isNaN()
console.log(`isNaN(NaN)? ${isNaN(NaN)}`); // true

//! confrontare null e undefined con == è sempre true, ma con === è false
console.log(`null === undefined? ${null === undefined}`); // false
console.log(`null == undefined? ${null == undefined}\n`); // true

//! confrontare null e false con == è sempre false, ma farlo con '' è true
console.log(`null == false? ${null == false}`); // false
console.log(`'' == false? ${'' == false}`); // true

//! confrontare 3 con true con == è false perchè 3 è un number
console.log(`3 == true? ${3 == true}`); // false
console.log(`0 == -0? ${0 == -0}\n`); // true

console.log(`true + true = ${true + true}`); // 2 perchè true è 1
console.log(`true !== 1? ${true !== 1}\n`); // true perchè true è un boolean, quindi non è uguale a 1 con il confronto stretto

console.log(`5 + '10' = ${5 + '10'}`); // 510 perchè 5 è un number e '10' è una stringa e l'operatore + fa da concatenazione
console.log(`'5' - 1 = ${'5' - 1}\n`); // 4, ma invece il meno non concatena quindi traduce la stringa in number

console.log(`1 < 2 < 3? ${1 < 2 < 3}`); // true perchè 1 < 2 è true e true < 3 è true
console.log(`3 > 2 > 1? ${3 > 2 > 1}\n`); // false perchè 3 > 2 è true e true > 1 è false
console.log(`0.2 + 0.1 === 0.3? ${0.2 + 0.1 === 0.3}\n`); // false perchè i numeri in JS sono a 64 bit e quindi non possono rappresentare tutti i numeri in modo preciso

console.log('b' + 'a' + (+ 'a') + 'a'); // ba NaN a perchè (+'a') viene convertito in number ma non lo è quindi NaN