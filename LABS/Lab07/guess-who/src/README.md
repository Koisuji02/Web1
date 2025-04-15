# `gw-server`

The `gw-server` is the server-side app companion for "GuessWho?" web game. It presents some APIs to perform some CRUD operations on characters, hypotheses and games.

## APIs
Hereafter, we report the designed HTTP APIs, also implemented in the project.


### __List all characters__

URL: `/api/characters`

HTTP Method: GET.

Description: Retrieve all characters.

Response: `200 OK` (success) or `500 Internal Server Error` (generic error). On success, returns an array of characters in JSON format (see below). On error, returns an error message.

Response body:
```json
[
  {
    "id": 1,
    "name": "Sheldon Cooper",
    "fictionGenre": "comedy",
    "role": "main",
    "hairColor": "brown",
    "glasses": false,
    "gender": "male",
    "hasPower": false,
    "visible": true
  },
  ...
]
```


### __Get a single character__

URL: `/api/characters/<id>`

HTTP Method: GET.

Description: Retrieve the character identified by `<id>`.

Response: `200 OK` (success), `404 Not Found` (wrong id), or `500 Internal Server Error` (generic error).

Response body:
```json
{
  "id": 1,
  "name": "Sheldon Cooper",
  "fictionGenre": "comedy",
  "role": "main",
  "hairColor": "brown",
  "glasses": false,
  "gender": "male",
  "hasPower": false,
  "visible": true
}
```

### __Create a new character__

URL: `/api/characters`

HTTP Method: POST.

Description: Create a new character.

Request body:
```json
{
  "name": "Joanne",
  "fictionGenre": "sci-fi",
  "role": "main",
  "hairColor": "blonde",
  "glasses": true,
  "gender": "female",
  "hasPower": false
}
```

Response: `201 Created` (success, with the created id), `503 Service Unavailable` (generic error). If the request body is invalid (after validation), `422 Unprocessable Entity` (validation error).

Response body: __None__


### __Update an existing character__

URL: `/api/characters/<id>`

HTTP Method: PUT.

Description: Update a character identified by `<id>`.

Request body: A JSON object representing the character.
```json
{
  "name": "Alice",
  "fictionGenre": "sci-fi",
  "role": "main",
  "hairColor": "blonde",
  "glasses": true,
  "gender": "female",
  "hasPower": false,
  "visible": true
}
```

Response: `200 OK` (success), `404 Not Found` (wrong id), or `503 Service Unavailable` (generic error). If the request body is invalid, `422 Unprocessable Entity` (validation error).

Response body: __None__


### __Delete a character__

URL: `/api/characters/<id>`

HTTP Method: DELETE.

Description: Delete a character identified by `<id>`.

Response: `204 No Content` (success), `404 Not Found` (wrong id), or `503 Service Unavailable` (generic error).

Response body: __None__


### __List all hypotheses for a game__

URL: `/api/games/<id>/hypotheses`

HTTP Method: GET.

Description: Retrieve all hypotheses associated with the game identified by `<id>`.

Response: `200 OK` (success), `404 Not Found` (wrong id), or `500 Internal Server Error` (generic error).

Response body:
```json
[
  "hairColor: Black -> correct",
  "glasses: true -> incorrect",
  ...
]
```


### __Add a new hypothesis to a game__

URL: `/api/games/<id>/hypotheses`

HTTP Method: POST.

Description: Add a new hypothesis to the game identified by `<id>`.

Request body:
```json
{
  "property": "hairColor",
  "value": "Black",
  "correct": true
}
```

Response: `201 Created` (success, with the created id), `404 Not Found` (wrong id), or `503 Service Unavailable` (generic error). If the request body is invalid, `422 Unprocessable Entity` (validation error).

Response body: __None__


### __Reset visibility of all characters__

URL: `/api/characters/reset-visibility`

HTTP Method: POST.

Description: Set `visible = true` for all characters.

Response: `204 No Content` (success) or `503 Service Unavailable` (generic error).

Response body: __None__


### __Update visibility based on a hypothesis__

URL: `/api/hypotheses/<id>/update-visibility`

HTTP Method: POST.

Description: Update the visibility of characters based on the hypothesis identified by `<id>`.

Response: `204 No Content` (success), or `503 Service Unavailable` (generic error).

Response body: __None__


### __Set secret character for a game__

URL: `/api/games/<id>/set-secret-character`

HTTP Method: POST.

Description: Set a random secret character for the game identified by `<id>`.

Response: `204 No Content` (success), `404 Not Found` (wrong id), or `503 Service Unavailable` (generic error).

Response body: __None__


# `React Components structure`
* Navbar
* Hypotheses
    * HypothesisGrid
      * Property
      * Values
* Characters -> characters
    * CharactersGrid
        * CharacterCard
* Footer