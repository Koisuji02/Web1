import sqlite from 'sqlite3';

const db = new sqlite.Database('questions.sqlite', (err) => {
    // throw eccezione di err
    if (err) throw err;
});

let sql = 'SELECT * FROM answer'; // prendo tutto dalla tabella answer
let results = [];

db.all(sql, [], (err, rows) => {
    if (err) throw err;
    for (let row of rows)
        results.push(row);
});

for (let r of results)
    console.log(r);

//! Output: [] perché il ciclo for viene eseguito prima che la callback di db.all() venga chiamata in quanto è asincrona
//? Per risolvere il problema, si può spostare il ciclo for dentro la callback di db.all(), invece che salvare i risultati in un vettore e poi stamparli