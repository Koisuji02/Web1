import dayjs from 'dayjs';

function User(id, username, password, salt) {
  this.id = id;
  this.username = username;
  this.password = password;
  this.salt = salt;
}

function Card(id, title, image_path, bad_luck_index) {
  this.id = id;
  this.title = title;
  this.image_path = image_path;
  this.bad_luck_index = bad_luck_index;
}

function Game(id, user_id, created_at, ended_at, result) {
  this.id = id;
  this.user_id = user_id;
  this.created_at = dayjs(created_at);
  this.ended_at = ended_at ? dayjs(ended_at) : null;
  this.result = result; // 'win' oppure 'lose'
}

function GameCard(id, game_id, card_id, round_number, initial, guessed) {
  this.id = id;
  this.game_id = game_id;
  this.card_id = card_id;
  this.round_number = round_number;
  this.initial = initial;
  this.guessed = guessed; // null, 0 oppure 1
}

export { User, Card, Game, GameCard };
