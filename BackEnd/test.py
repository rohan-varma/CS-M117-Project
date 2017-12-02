import requests
import json
import random
import string

def createGameData():
	# random login code
	login_code = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(20))
	data = {'loginCode': login_code,
 			'orgName': "person",
			'xCoord' : 2, 'yCoord': 2, 'radius': 2}
	return login_code,data

def createUserData(login_code):
	# random login code
	username = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(20))
	mac = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(20))
	data = {'loginCode': login_code,
			'username': username,
 			'mac': mac,
			'x' : 2,
			'y': 2,
			'xCoord' : 2,
			'yCoord': 2,
			'radius': 2}
	return data

# for now until we have a cleanup for games in the DB, must change loginCode before each run
# Formula: test, test1, test2, test3, ... 
def testCreateGame (login_code, data):
	# if a game is created without loginCode or orgName it should error
	res = requests.post("http://localhost:3000/BluA/createGame",
		data = {})
	assert res.status_code == 400
	assert 'error' in res.json().keys()

	# if a game is created without coords it should error
	res = requests.post("http://localhost:3000/BluA/createGame",
		data = {x: data[x] for x in data if x not in ['xCoord', 'yCoord']})
	assert res.status_code == 400
	assert 'error' in res.json().keys()

	# a game should successfully be created with a new login code (generate randomly)
	res = requests.post("http://localhost:3000/BluA/createGame",
		data = data)
	assert res.status_code == 200

	# but if we use the same login code to create a game we should get an error
	res = requests.post("http://localhost:3000/BluA/createGame",
		data = data)
	assert res.status_code == 400
	assert 'error' in res.json()

def testAddUser(data):
	res = requests.post("http://localhost:3000/BluA/addUser",
		data = data)
	assert res.status_code == 200

def testStartGame(data):
	res = requests.post("http://localhost:3000/BluA/startGame",
		data = data)
	assert res.status_code == 200

def testKillTarget(login_code, data):
	res = requests.get("http://localhost:3000/BluA/config")
	assert res.status_code == 200

def main():
	#create game data
	test_data = createGameData()
	#create four test users
	user1_data = createUserData(test_data[0])
	user2_data = createUserData(test_data[0])
	user3_data = createUserData(test_data[0])
	user4_data = createUserData(test_data[0])
	#create a game with the above data
	testCreateGame(test_data[0],test_data[1])
	#add users with the above data
	testAddUser(user1_data)
	# testAddUser(user2_data)
	# testAddUser(user3_data)
	# testAddUser(user4_data)
	# #start game
	# testStartGame(test_data[0])
	# #update the player's locations to outside the safezone
	
	# #attempt to kill the target
	# testKillTarget(test_data[0],test_data[1])

if __name__ == "__main__":
	main()