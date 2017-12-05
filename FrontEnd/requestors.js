const ServerURL = 'http://localhost:3000/BluA' //'http://34.193.126.39'
const createGameURL = ServerURL + '/createGame';
const addUserURL = ServerURL + '/addUser';
const startGameURL = ServerURL + '/startGame';
const updateLocationURL = ServerURL + '/updateLocation';

//these are the functions that interface with the backend. Import and use them wherever in the fronted its needed.
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

module.exports = {
  createGame,
  addUserToGame,
};
