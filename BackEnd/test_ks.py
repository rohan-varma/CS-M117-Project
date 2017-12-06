import requests
import json
import random
import string

SERVER_URL = 'localhost:3000'


g = {'loginCode': 'GAME', 'orgName': 'PERSON1', 'xCoord': -118.443, 'yCoord': 34.0689, 'radius': 40}

requests.post("http://" + SERVER_URL + "/BluA/createGame", data = g)

p1 = {'loginCode': 'GAME', 'username': 'PERSON1',
        'xCoord': -118.44, 'yCoord': 34.0689,
        'x': -118.44, 'y': 34.0689,'radius': 20, 'mac': '12345'}
p2 = {'loginCode': 'GAME', 'username': 'PERSON2',
        'xCoord': -118.47, 'yCoord': 34.0689,
        'x': -118.47, 'y': 34.0689,'radius': 20, 'mac': '1234'}
requests.post("http://" + SERVER_URL + "/BluA/addUser", data = p1)
requests.post("http://" + SERVER_URL + "/BluA/addUser", data = p2)

requests.post("http://" + SERVER_URL + "/BluA/startGame", data = g)
