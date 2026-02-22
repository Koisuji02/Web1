import sqlite from 'sqlite3';
import crypto from 'crypto';
import {User, Card, Game, GameCard} from './models.mjs';

// open the databas
const db = new sqlite.Database('database.sqlite', (err) => {
  if (err) throw err;
});


//! USER ROUTES

// GET USER BY USERNAME
export const getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM USER WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve(false);
      else {
        // uso 16 perchè genero un salt da 16 chars
        crypto.scrypt(password, row.salt, 16, (err, hashedPassword) => {
          if (err) reject(err);
          if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
            resolve(false);
          else
            resolve(new User(row.id, row.username, row.password, row.salt));
        });
      }
    });
  });
};

//! CARD ROUTES

// GET CARD BY ID
export const getCardById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM CARD WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({error: 'Card not available, check the inserted id!'});
      else resolve(new Card(row.id, row.title, row.image_path, row.bad_luck_index));
    });
  });
};

// restituisce N carte casuali, escludendo eventuali id -> nella traccia c'è scritto di dare 3 carte iniziali, ma anche che le carte devono essere casuali, e che non devono essere ripetute, quindi ho deciso di fare una funzione che restituisce N [count] carte casuali, escludendo eventuali id passati come parametro (per esempio le carte già mostrate in precedenza) per le carte estratte dopo nei round successivi [in questo modo posso riusare la stessa funzione per tutte le carte]
export const getRandomCards = (count, excludeIds = []) => {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM CARD';
    const params = [];
    if (excludeIds && excludeIds.length > 0) {
      sql += ` WHERE id NOT IN (${excludeIds.map(() => '?').join(',')})`;
      params.push(...excludeIds);
    }
    sql += ' ORDER BY RANDOM() LIMIT ?';
    params.push(count);
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      const cards = rows.map((c) => new Card(c.id, c.title, c.image_path, c.bad_luck_index));
      resolve(cards);
    });
  });
};


//! GAME ROUTES

// CREATE NEW GAME (inserisce solo user_id e created_at, lasciando ended_at e result NULL) -> la partita viene creata come "in corso"; quando la partita termina, va usata updateGameResult per aggiornare ended_at e result
export const createGame = (game) => {
  return new Promise((resolve, reject) => {

    // controllo che ci sia user_id e created_at
    if (!game.user_id || !game.created_at) {
      return reject(new Error('user_id & created_at not in the request!'));
    }

    const sql = 'INSERT INTO GAME (user_id, created_at) VALUES (?, ?)';
    db.run(sql, [game.user_id, game.created_at], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

// UPDATE GAME AT THE END (imposta ended_at e result) -> aggiorna ended_at (data/ora attuale) e result ("win" o "lose")
export const updateGameResult = (gameId, result, ended_at) => {
  return new Promise((resolve, reject) => {

    // controllo che risultato valido (win, lose)
    if (!['win', 'lose'].includes(result)) {
      return reject(new Error('Result must be "win" or "lose"!'));
    }
    if (!ended_at) {
      return reject(new Error('ended_at must be provided!'));
    }

    const sql = 'UPDATE GAME SET ended_at = ?, result = ? WHERE id = ?';
    db.run(sql, [ended_at, result, gameId], function (err) {
      if (err) reject(err);
      else resolve(this.changes); // torna il numero di righe modificate (per conferma che update sia andato bene)
    });
  });
};

// GET GAME BY ID
export const getGameById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM GAME WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({error: 'Game not available, check the inserted id!'});
      else resolve(new Game(row.id, row.user_id, row.created_at, row.ended_at, row.result));
    });
  });
};

// GET GAMES BY USER ID
export const listGamesByUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM GAME WHERE user_id = ? ORDER BY created_at DESC';
    db.all(sql, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.map(row => new Game(row.id, row.user_id, row.created_at, row.ended_at, row.result)));
    });
  });
};


//! GAMECARD ROUTES

// ADD CARD TO GAME
export const addCardToGame = (gamecard) => {
  return new Promise((resolve, reject) => {
    if (![0, 1].includes(gamecard.initial)) {
      return reject(new Error('Invalid initial value. Must be 0 or 1!'));
    }
    // caso carta iniziale (nelle 3 carte iniziali)
    if (gamecard.initial === 1 && gamecard.round_number !== null) {
      return reject(new Error('Initial cards must not have a round number!'));
    }
    // caso carta non iniziale (aggiunta nei round successivi)
    if (gamecard.initial === 0 && (gamecard.round_number === null || gamecard.round_number < 1)) {
      return reject(new Error('Non-initial cards must have a valid round_number!'));
    }
    if (gamecard.guessed !== null && ![0, 1].includes(gamecard.guessed)) {
      return reject(new Error('Invalid guessed value. Must be null, 0, or 1.'));
    }

    const sql = `INSERT INTO GAMECARD (game_id, card_id, round_number, initial, guessed)
                 VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [gamecard.game_id, gamecard.card_id, gamecard.round_number, gamecard.initial, gamecard.guessed], function (err) {
      if (err) reject(err);
      else resolve(this.lastID); // this.lastID come prima (guarda sopra)
    });
  });
};

// GET ALL CARDS OF A GAME
export const getCardsOfGame = (gameId) => {
  return new Promise((resolve, reject) => {
    // prende tutti i dati necessari sia di GameCard che di Card (mi servono i dati di gioco di GAMECARD, ma anche tutti i dati della CARD)
    const sql = `SELECT 
      GC.id as gc_id, GC.game_id, GC.card_id, GC.round_number, GC.initial, GC.guessed,
      C.id as card_id, C.title, C.image_path, C.bad_luck_index
      FROM GAMECARD GC JOIN CARD C ON GC.card_id = C.id WHERE GC.game_id = ?`;
    db.all(sql, [gameId], (err, rows) => {
      if (err) reject(err);
      else {
        const showedResult = rows.map(row => ({
          gameCard: new GameCard(
            row.gc_id, row.game_id, row.card_id, row.round_number, row.initial, row.guessed
          ),
          card: new Card(
            row.card_id, row.title, row.image_path, row.bad_luck_index
          )
        }));
        resolve(showedResult);
      }
    });
  });
};

// SET CARD AS GUESSED
export const setCardGuessed = (gameCard) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE GAMECARD SET guessed = ? WHERE id = ?';
    db.run(sql, [gameCard.guessed, gameCard.id], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};

// CHECK CARD POSITION
export function checkCardPosition(guessIndex, cardToGuess, initialCards) {

  // ordino le carte iniziali per bad_luck_index crescente
  const sorted = [...initialCards].sort((a, b) => a.bad_luck_index - b.bad_luck_index);

  // trovo la posizione corretta della carta da indovinare
  let correctIndex = 0;
  while (correctIndex < sorted.length && cardToGuess.bad_luck_index > sorted[correctIndex].bad_luck_index) {
    correctIndex++;
  }

  // ritorno true se indice indovinato, altrimenti false
  return guessIndex === correctIndex;
}

/*// DELETE GAME BY ID
export const deleteGameById = (gameId) => {
  return new Promise((resolve, reject) => {
    // Prima elimina tutte le gamecard associate
    const sql1 = 'DELETE FROM GAMECARD WHERE game_id = ?';
    db.run(sql1, [gameId], function (err) {
      if (err) return reject(err);
      // Poi elimina il game
      const sql2 = 'DELETE FROM GAME WHERE id = ?';
      db.run(sql2, [gameId], function (err2) {
        if (err2) return reject(err2);
        resolve(this.changes);
      });
    });
  });
};*/
