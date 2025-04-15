// 'use strict';
import sqlite from "sqlite3";
//! IMPORTANTE
import { Character, Hypothesis, Game } from "./models.mjs";

// Creazione del database e connessione
const db = new sqlite.Database("db.sqlite", (err) => {
  if (err) throw err;
});


/*** DAO -> CHARACTER ***/

// recuperare tutti i characters
export const listCharacters = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM CHARACTER";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const characters = rows.map(
                    (c) => new Character(c.name, c.fictionGenre, c.role, c.hairColor, c.glasses, c.gender, c.hasPower)
                );
                characters.forEach((character, index) => (character.id = rows[index].id));
                resolve(characters);
            }
        });
    });
};

// aggiungere un nuovo character al mio db (non uso più liste di personaggi parallele per evitare problemi di sincronizzazione)
export const addCharacter = (character) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO CHARACTER (name, fictionGenre, role, hairColor, glasses, gender, hasPower, visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(
            sql,
            [character.name, character.fictionGenre, character.role, character.hairColor, character.glasses, character.gender, character.hasPower, true],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    character.id = this.lastID;
                    resolve(character);
                }
            }
        );
    });
};

// eliminare un character tramite id
export const deleteCharacterById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM CHARACTER WHERE id = ?`;
        db.run(sql, [id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(id);
            }
        });
    });
};

// metodo per eliminare un personaggio (direttamente oggetto personaggio)
export const deleteCharacter = (character) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM CHARACTER WHERE id = ?`;
        db.run(sql, [character.id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(character);
            }
        });
    });
};

// aggiornare un character esistente
export const updateCharacter = (character) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE CHARACTER SET name = ?, fictionGenre = ?, role = ?, hairColor = ?, glasses = ?, gender = ?, hasPower = ?, visible = ? WHERE id = ?`;
        db.run(
            sql,
            [character.name, character.fictionGenre, character.role, character.hairColor, character.glasses, character.gender, character.hasPower, character.id, character.visible],
            function (err) {
                if (err) {
                    console.error('SQL error:', err.message);
                    reject(err);
                } else {
                    console.log('Rows updated:', this.changes);
                    if (this.changes === 0) {
                        resolve({ error: 'Character not found.' });
                    } else {
                        resolve(character);
                    }
                }
            }
        );
    });
};

// filtro per nome
export const filterCharactersByName = (name) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM CHARACTER WHERE name = ?`;
        db.all(sql, [name], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const characters = rows.map((c) => new Character(c.name, c.fictionGenre, c.role, c.hairColor, c.glasses, c.gender, c.hasPower));
                characters.forEach((character, index) => (character.id = rows[index].id));
                resolve(characters);
            }
        });
    });
};

// filtro per genere
export const filterCharactersByFictionGenre = (genre) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM CHARACTER WHERE fictionGenre = ?`;
        db.all(sql, [genre], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const characters = rows.map((c) => new Character(c.name, c.fictionGenre, c.role, c.hairColor, c.glasses, c.gender, c.hasPower));
                characters.forEach((character, index) => (character.id = rows[index].id));
                resolve(characters);
            }
        });
    });
};

// filtro per ruolo
export const filterCharactersByRole = (role) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM CHARACTER WHERE role = ?`;
        db.all(sql, [role], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const characters = rows.map((c) => new Character(c.name, c.fictionGenre, c.role, c.hairColor, c.glasses, c.gender, c.hasPower));
                characters.forEach((character, index) => (character.id = rows[index].id));
                resolve(characters);
            }
        });
    });
};

// filtro per colore dei capelli
export const filterCharactersByHairColor = (color) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM CHARACTER WHERE hairColor = ?`;
        db.all(sql, [color], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const characters = rows.map((c) => new Character(c.name, c.fictionGenre, c.role, c.hairColor, c.glasses, c.gender, c.hasPower));
                characters.forEach((character, index) => (character.id = rows[index].id));
                resolve(characters);
            }
        });
    });
};

// filtro per occhiali
export const filterCharactersByGlasses = (hasGlasses) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM CHARACTER WHERE glasses = ?`;
        db.all(sql, [hasGlasses], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const characters = rows.map((c) => new Character(c.name, c.fictionGenre, c.role, c.hairColor, c.glasses, c.gender, c.hasPower));
                characters.forEach((character, index) => (character.id = rows[index].id));
                resolve(characters);
            }
        });
    });
};

// filtro per genere
export const filterCharactersByGender = (gender) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM CHARACTER WHERE gender = ?`;
        db.all(sql, [gender], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const characters = rows.map((c) => new Character(c.name, c.fictionGenre, c.role, c.hairColor, c.glasses, c.gender, c.hasPower));
                characters.forEach((character, index) => (character.id = rows[index].id));
                resolve(characters);
            }
        });
    });
};

// filtro per presenza di poteri
export const filterCharactersByPower = (hasPower) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM CHARACTER WHERE hasPower = ?`;
        db.all(sql, [hasPower], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const characters = rows.map((c) => new Character(c.name, c.fictionGenre, c.role, c.hairColor, c.glasses, c.gender, c.hasPower));
                characters.forEach((character, index) => (character.id = rows[index].id));
                resolve(characters);
            }
        });
    });
};

// filtro visibili
export const filterVisibleCharacters = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM CHARACTER WHERE visible = true`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const characters = rows.map((c) => new Character(c.name, c.fictionGenre, c.role, c.hairColor, c.glasses, c.gender, c.hasPower));
                characters.forEach((character, index) => (character.id = rows[index].id));
                resolve(characters);
            }
        });
    });
};

// filtro non visibili
export const filterNotVisibleCharacters = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM CHARACTER WHERE visible = false`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const characters = rows.map((c) => new Character(c.name, c.fictionGenre, c.role, c.hairColor, c.glasses, c.gender, c.hasPower));
                characters.forEach((character, index) => (character.id = rows[index].id));
                resolve(characters);
            }
        });
    });
};

/*** DAO -> HYPOTHESIS ***/

// recuperare tutte le hypothesis
export const listHypotheses = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM HYPOTHESIS";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const hypotheses = rows.map((h) => new Hypothesis(h.property, h.value, h.correct));
                hypotheses.forEach((hypothesis, index) => (hypothesis.id = rows[index].id));
                resolve(hypotheses);
            }
        });
    });
};

// aggiungere una nuova hypothesis al mio db
//! occhio a passare anche l'id del gioco per fare in modo di aggiungere anche alla tabella che relaziona Game e Hypothesis
export const addHypothesis = (hypothesis, gameId) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO HYPOTHESIS (property, value, correct) VALUES (?, ?, ?)`;
        db.run(sql, [hypothesis.property, hypothesis.value, hypothesis.correct], function (err) {
            if (err) {
                reject(err);
            } else {
                hypothesis.id = this.lastID;
                // Aggiungi la relazione nella tabella GAME_HYPOTHESIS
                addGameHypothesisRelation(gameId, hypothesis.id)
                    .then(() => resolve(hypothesis))
                    .catch((err) => reject(err));
            }
        });
    });
};

// eliminare un'ipotesi tramite id
export const deleteHypothesisById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM HYPOTHESIS WHERE id = ?`;
        db.run(sql, [id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(id);
            }
        });
    });
};

// metodo per eliminare un'ipotesi (direttamente oggetto ipotesi)
// eliminare un'ipotesi tramite id
export const deleteHypothesis = (hypothesis) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM HYPOTHESIS WHERE id = ?`;
        db.run(sql, [hypothesis.id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(hypothesis);
            }
        });
    });
};

// aggiornare un'ipotesi esistente
export const updateHypothesis = (hypothesis) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE HYPOTHESIS SET property = ?, value = ?, correct = ? WHERE id = ?`;
        db.run(sql, [hypothesis.property, hypothesis.value, hypothesis.correct, hypothesis.id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(hypothesis);
            }
        });
    });
};

// trovare un'ipotesi dato il suo ID
export const findHypothesisById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM HYPOTHESIS WHERE id = ?`;
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                resolve(null);
            } else {
                const hypothesis = new Hypothesis(row.property, row.value, row.correct);
                hypothesis.id = row.id;
                resolve(hypothesis);
            }
        });
    });
};

// filtrare le ipotesi per proprietà
export const filterHypothesesByProperty = (property) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM HYPOTHESIS WHERE property = ?`;
        db.all(sql, [property], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const hypotheses = rows.map((h) => new Hypothesis(h.property, h.value, h.correct));
                hypotheses.forEach((hypothesis, index) => (hypothesis.id = rows[index].id));
                resolve(hypotheses);
            }
        });
    });
};

// filtrare le ipotesi corrette
export const filterCorrectHypotheses = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM HYPOTHESIS WHERE correct = true`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const hypotheses = rows.map((h) => new Hypothesis(h.property, h.value, h.correct));
                hypotheses.forEach((hypothesis, index) => (hypothesis.id = rows[index].id));
                resolve(hypotheses);
            }
        });
    });
};

/*** DAO -> GAME ***/

// trovare game per id
export const getGame = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM GAME WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: "Game not found" });
            } else {
                const game = new Game(row.difficulty);
                game.id = row.id;
                resolve(game);
            }
        });
    });
};

// aggiungere un nuovo game
export const addGame = (game) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO GAME (difficulty) VALUES (?)`;
        db.run(sql, [game.difficulty], function (err) {
            if (err) {
                reject(err);
            } else {
                game.id = this.lastID;
                resolve(game);
            }
        });
    });
};

// settare il personaggio segreto (passando come parametro il game)
export const setSecretCharacter = (game) => {
    return new Promise((resolve, reject) => {
        // Recupera tutti gli ID dei personaggi
        const sqlGetIds = `SELECT id FROM CHARACTER`;
        db.all(sqlGetIds, [], (err, rows) => {
            if (err) {
                reject(err);
            } else if (rows.length === 0) {
                reject(new Error("No characters available in the database."));
            } else {
                // Seleziona un ID casuale tra quelli disponibili
                const randomIndex = Math.floor(Math.random() * rows.length);
                const randomId = rows[randomIndex].id;

                // Recupera il personaggio corrispondente all'ID casuale
                const sqlGetCharacter = `SELECT * FROM CHARACTER WHERE id = ?`;
                db.get(sqlGetCharacter, [randomId], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        reject(new Error("Character not found."));
                    } else {
                        const character = new Character(row.name, row.fictionGenre, row.role, row.hairColor, row.glasses, row.gender, row.hasPower);
                        character.id = row.id;
                        game.secretCharacter = character;
                        
                        // Aggiorna il campo secretCharacter nella tabella GAME
                        const sqlUpdateGame = `UPDATE GAME SET idSecretCharacter = ? WHERE id = ?`;
                        db.run(sqlUpdateGame, [character.id, game.id], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(); // Operazione completata con successo
                            }
                        });
                    }
                });
            }
        });
    });
};

// impostare tutti i personaggi come visibili ad inizio Game
export const resetVisibility = () => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE CHARACTER SET visible = true`;
        db.run(sql, [], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

// aggiornare la visibilità dei personaggi in base all'ipotesi
export const updateVisibilityByHypothesis = (hypothesis) => {
    return new Promise((resolve, reject) => {
        let sql;

        if (hypothesis.correct) {
            // Se l'ipotesi è corretta, nascondi i personaggi non coperti dall'ipotesi
            sql = `UPDATE CHARACTER SET visible = false WHERE ${hypothesis.property} != ?`;
        }
        else {
            // Se l'ipotesi è errata, nascondi i personaggi coperti dall'ipotesi
            sql = `UPDATE CHARACTER SET visible = false WHERE ${hypothesis.property} = ?`;
        }
        db.run(sql, [hypothesis.value], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

/*** DAO -> GAME_HYPOTHESIS ***/

// aggiungere una relazione tra un Game e un hypothesis
export const addGameHypothesisRelation = (gameId, hypothesisId) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO GAME_HYPOTHESIS (id_game, id_hypothesis) VALUES (?, ?)`;
        db.run(sql, [gameId, hypothesisId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

// ottenere tutte le ipotesi associate a un determinato gioco
export const getHypothesesByGameId = (gameId) => {
    return new Promise((resolve, reject) => {
        const sql = ` SELECT H.property, H.value, H.correct
            FROM HYPOTHESIS H, GAME_HYPOTHESIS GH
            WHERE H.id = GH.id_hypothesis
            AND GH.id_game = ?`;
        db.all(sql, [gameId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Convertire le ipotesi in stringhe (ha solo utilità di stampa)
                const hypotheses = rows.map(
                    (h) => `${h.property}: ${h.value} -> ${h.correct}`
                );
                resolve(hypotheses);
            }
        });
    });
};

// stampare e stampare la lista di ipotesi di un gioco (funzione asincrona diretta di stampa)
export const printHypothesesForGame = async (gameId) => {
    try {
        const hypotheses = await getHypothesesByGameId(gameId);
        console.log(`Hypotheses for game ${gameId}:`);
        hypotheses.forEach((hypothesis) => console.log(hypothesis));
    } catch (err) {
        console.error(`Error retrieving hypotheses for game ${gameId}:`, err.message);
    }
};



/*
//! ESEMPIO DI GIOCO:
const game = new Game("easy");

// Inizializza il gioco
resetVisibility()
    .then(() => setSecretCharacter(game))
    .then(() => {
        console.log("Game initialized. Secret character:", game.secretCharacter);

        // Aggiungi alcune ipotesi al gioco
        const hypothesis1 = new Hypothesis("hairColor", "black", true);
        const hypothesis2 = new Hypothesis("glasses", false, false);

        return addHypothesisForGame(hypothesis1, game.id)
            .then(() => addHypothesisForGame(hypothesis2, game.id));
    })
    .then(() => {
        // Stampa tutte le ipotesi associate al gioco
        return printHypothesesForGame(game.id);
    })
    .catch((err) => {
        console.error("Error:", err.message);
    });
*/