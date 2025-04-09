// 'use strict';
import sqlite from "sqlite3";

// Creazione del database e connessione
const db = new sqlite.Database("db.sqlite", (err) => {
  if (err) throw err;
});

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

    // metodo per prendere tutti i characters dal DB
    this.addCharacterList = () => {
        return new Promise ((resolve, reject) => {
        const sql = "SELECT * FROM CHARACTER";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                this.characterList = rows.map((c) => new Character(c.name, c.fictionGenre, c.role, c.hairColor, c.glasses, c.gender, c.hasPower));
                this.characterList.forEach((character, index) => character.id = rows[index].id);
                //this.characterList = characterListTmp;
                resolve(this.characterList);
            }
        });
      });
    }

    // metodo per prendere tutti le hypothesis dal DB
    this.addHypothesisList = () => {
        return new Promise ((resolve, reject) => {
        const sql = "SELECT * FROM HYPOTHESIS";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                this.hypothesisList = rows.map((h) => new Hypothesis(h.property, h.value, h.correct));
                this.hypothesisList.forEach((hypothesis, index) => hypothesis.id = rows[index].id);
                //this.hypothesisList = hypothesisListTmp;
                resolve(this.hypothesisList);
            }
        });
      });
    }

    // metodo per aggiungere un nuovo personaggio
    this.addCharacter = (character) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO CHARACTER (name, fictionGenre, role, hairColor, glasses, gender, hasPower) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            db.run(sql, [character.name, character.fictionGenre, character.role, character.hairColor, character.glasses, character.gender, character.hasPower], function (err) {
                if (err) {
                    reject(err);
                } else {
                    character.id = this.lastID;
                    resolve(character);
                }
            });
        }).then((char) => {
            this.characterList.push(char); // Ora this.characterList è accessibile
            return char;
        });
    };

    // metodo per eliminare un personaggio
    this.removeCharacter = (character) => {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM CHARACTER WHERE id = ?`;
            db.run(sql, [character.id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.characterList = this.characterList.filter(c => c.id !== character.id);
                    resolve();
                }
            });
        });
    }

    // metodo per aggiungere un'ipotesi
    this.addHypothesis = (hypothesis) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO HYPOTHESIS (property, value, correct) VALUES (?, ?, ?)`;
            db.run(sql, [hypothesis.property, hypothesis.value, hypothesis.correct], function(err) {
                if (err) {
                    reject(err);
                } else {
                    hypothesis.id = this.lastID;
                    resolve(hypothesis);
                }
            });
        }).then((hyp) => {
            this.hypothesisList.push(hyp);
            return hyp;
        });
    };    

    // metodo per eliminare un'ipotesi
    this.removeHypothesis = (hypothesis) => {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM HYPOTHESIS WHERE id = ?`;
            db.run(sql, [hypothesis.id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.hypothesisList = this.hypothesisList.filter(h => h.id !== hypothesis.id);
                    resolve();
                }
            });
        });
    }

    this.updateCharacter = (character) => {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE CHARACTER SET name = ?, fictionGenre = ?, role = ?, hairColor = ?, glasses = ?, gender = ?, hasPower = ? WHERE id = ?`;
            db.run(sql, [character.name, character.fictionGenre, character.role, character.hairColor, character.glasses, character.gender, character.hasPower, character.id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    const index = this.characterList.findIndex(c => c.id === character.id);
                    if (index !== -1) {
                        this.characterList[index] = character;
                    }
                    resolve(character);
                }
            });
        });
    }

    this.updateHypothesis = (hypothesis) => {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE HYPOTHESIS SET property = ?, value = ?, correct = ? WHERE id = ?`;
            db.run(sql, [hypothesis.property, hypothesis.value, hypothesis.correct, hypothesis.id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    const index = this.hypothesisList.findIndex(h => h.id === hypothesis.id);
                    if (index !== -1) {
                        this.hypothesisList[index] = hypothesis;
                    }
                    resolve(hypothesis);
                }
            });
        });
    }

    this.findCharacter = (character) => {
        return this.characterList.find(c => c.id === character.id);
    }

    this.findById = (id) => {
        return this.characterList.filter(s => s.id === id);
    }

    this.filterByName = (name) => {
        return this.characterList.filter(s => s.name === name);
    }

    this.filterByFictionGenre = (genre) => {
        return this.characterList.filter(s => s.fictionGenre === genre);
    }

    this.filterByRole = (role) => {
        return this.characterList.filter(s => s.role === role);
    }

    this.filterByHairColor = (color) => {
        return this.characterList.filter(s => s.hairColor === color);
    }

    this.filterByGlasses = (bool) => {
        return this.characterList.filter(s => s.glasses == bool);
    }

    this.filterByGender = (gender) => {
        return this.characterList.filter(s => s.gender == gender);
    }

    this.filterByPower = (bool) => {
        return this.characterList.filter(s => s.hasPower == bool);
    }

    this.deleteById = (id) => {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM CHARACTER WHERE id = ?`;
            db.run(sql, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.characterList = this.characterList.filter(s => s.id != id);
                    resolve();
                }
            });
        });
    }

    this.filterVisible = () => {
        return this.characterList.filter(c => c.visible);
    }

    this.filterNotVisible = () => {
        return this.characterList.filter(c => !c.visible);
    }

    this.setSecretCharacter = (id) => { //setto il personaggio segreto
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM CHARACTER WHERE id = ?`;
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    this.secretCharacter = new Character(row.name, row.fictionGenre, row.role, row.hairColor, row.glasses, row.gender, row.hasPower);
                    this.secretCharacter.id = row.id;
                    this.secretCharacter.visible = true;
                    resolve(this.secretCharacter);
                }
            });
        });
    }

    this.printHypothesis = () => {
        for (let hyp of this.hypothesisList) {
            console.log(hyp.toString());
        }
    }

    this.findHypothesis = (hypothesis) => {
        return this.hypothesisList.find(h => h.id === hypothesis.id);
    }

    this.filterCorrects = () => {
        return this.hypothesisList.filter(h => h.correct);
    }

    this.filterProperty = (property) => {
        // dà tutte le ipotesi con una certa proprietà
        return this.hypothesisList.filter(h => h.property === property);
    }

    this.toString = () => {
        console.log(`Game difficulty: ${this.difficulty}\n\nThe characters are:`);

        for (let i = 0; i < this.characterList.length; i++) {
            console.log(this.characterList[i].toString());
        }
    }
}

const game = new Game("easy");  //creo un nuovo gioco

game.addCharacterList().then(() => {
    return game.setSecretCharacter(1); // Imposta il personaggio segreto con ID 1
}).then(() => {
    game.toString();
    console.log("Secret character: " + game.secretCharacter.name);
    game.printHypothesis();
}).catch(err => {
    console.error('Error:', err);
});

// Test dei metodi di Game

// Aggiungi un nuovo personaggio
const newCharacter = new Character('Test Character', 'fantasy', 'main', 'black', false, 'male', true);
game.addCharacter(newCharacter).then(character => {
    console.log('Character added:', character);
}).catch(err => {
    console.error('Error adding character:', err);
});

// Aggiorna un personaggio esistente
newCharacter.name = 'Updated Character';
game.updateCharacter(newCharacter).then(character => {
    console.log('Character updated:', character);
}).catch(err => {
    console.error('Error updating character:', err);
});

// Elimina un personaggio esistente
game.removeCharacter(newCharacter).then(() => {
    console.log('Character deleted');
}).catch(err => {
    console.error('Error deleting character:', err);
});

// Aggiungi una nuova ipotesi
const newHypothesis = new Hypothesis('name', 'Test Character', false);
game.addHypothesis(newHypothesis).then(hypothesis => {
    console.log('Hypothesis added:', hypothesis);
}).catch(err => {
    console.error('Error adding hypothesis:', err);
});

// Aggiorna un'ipotesi esistente
newHypothesis.value = 'Updated Character';
game.updateHypothesis(newHypothesis).then(hypothesis => {
    console.log('Hypothesis updated:', hypothesis);
}).catch(err => {
    console.error('Error updating hypothesis:', err);
});

// Rimuovi un'ipotesi esistente
game.removeHypothesis(newHypothesis).then(() => {
    console.log('Hypothesis removed');
}).catch(err => {
    console.error('Error removing hypothesis:', err);
});