const ServerURL = 'http://localhost:3000/BluA'
const gameExistsURL = ServerURL + '/gameExists';
const createGameURL = ServerURL + '/createGame';
const addUserURL = ServerURL + '/addUser';
const startGameURL = ServerURL + '/startGame';
const updateLocationURL = ServerURL + '/updateLocation';
const playerURL = ServerURL + '/players';
const targetURL = ServerURL + '/targets';

//these are the functions that interface with the backend. Import and use them wherever in the fronted its needed.
const gameExists = body => fetch(gameExistsURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body,
  }).then(res => res.json())

const createGame = body => fetch(createGameURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body,
  }).then(res => res.json())

const addUserToGame = body => fetch(addUserURL, {
  method: 'POST',
  headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body,
}).then(res => res.json())

const getAllPlayersForGame = body => fetch(playerURL, {
  method: 'POST',
  headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body,
}).then(res => res.json())

const getTargetsForPlayer = body => fetch(targetURL, {
  method: 'POST',
  headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body,
}).then(res => res.json())


module.exports = {
  getTargetsForPlayer,
  gameExists,
  createGame,
  addUserToGame,
  getAllPlayersForGame,
};
