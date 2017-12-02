
//these are the functions that interface with the backend. Import and use them wherever in the fronted its needed.
const createGame = body => fetch('http://localhost:3000/BluA/createGame', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body,
  }).then(res => res.json())

const addUserToGame = body => fetch('http://localhost:3000/BluA/addUser', {
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