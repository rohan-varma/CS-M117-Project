import requests

print(requests.post("http://localhost:3000/BluA/createGame", data={'gameCode': "supergame", 'orgName': "person"}))
