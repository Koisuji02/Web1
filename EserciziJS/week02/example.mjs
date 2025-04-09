// 'use strict';
//! un vantaggio dei file.mjs è non dover scrivere ad inizio file 'use strict' perchè automatico

// CommonJS (importare, non standard di JS, ma standard in nodeJS)
//const dayjs = require('dayjs')

// ES module (standard di JS, da usare nei browser)
import dayjs from 'dayjs'; // il primo dayjs è sarebbe la costante chiamata dayjs dove mettiamo la libreria

//! La scrittura con import funziona in nodeJS (in locale) solo se rinominiamo il file exercise.mjs (module JS)

let oggi = dayjs();
console.log(oggi);
console.log(oggi.format("YYYY-MM-DD"));