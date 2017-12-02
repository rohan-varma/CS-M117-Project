
const createGameURL = 'http://localhost:3000/BluA/createGame';
const addUserURL = 'http://localhost:3000/BluA/addUser';
const startGameURL = 'http://localhost:3000/BluA/startGame';
const updateLocationURL = 'http://localhost:3000/BluA/updateLocation';

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