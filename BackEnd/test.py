import requests
import json
import random
import string

def createGameData():
	# random login code
	login_code = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(46))
	data = {'loginCode': login_code,
 			'orgName': "person",
			'xCoord' : 7, 'yCoord': 7, 'radius': 2}
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
def testCreateGame (data):
	# if a game is created without loginCode or orgName it should error
	res = requests.post("http://localhost:3000/BluA/createGame",
		data = {})
	assert res.status_code == 400
	assert 'error' in res.json().keys()

	# a game should successfully be created with a new login code (generate randomly)
	res = requests.post("http://localhost:3000/BluA/createGame",
		data = data)
	assert res.status_code == 200

	# but if we use the same login code to create a game we should get an error
	res = requests.post("http://localhost:3000/BluA/createGame",
		data = data)
	body = res.json()
	print('result body')
	print(body)
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

def testCreateAlliance(data):
	res = requests.post("http://localhost:3000/BluA/createAlliance",
		data = data)
	assert res.status_code == 200
	return json.loads(res.text)["allianceId"]

def testJoinAlliance(data):
	res = requests.post("http://localhost:3000/BluA/joinAlliance",
		data = data)
	assert res.status_code == 200

def testUpdateLocation(data):
	res = requests.post("http://localhost:3000/BluA/updateLocation",
		data = data)
	assert res.status_code == 200

def testKillTarget(data):
	res = requests.post("http://localhost:3000/BluA/killTarget",
		data = data)
	assert res.status_code == 200
	print json.loads(res.text)["message"]
	assert json.loads(res.text)["message"] == "killed target"

def testKillTargetWithSafezone(data):
	res = requests.post("http://localhost:3000/BluA/killTarget",
		data = data)
	assert res.status_code == 200
	print json.loads(res.text)["message"]
	assert json.loads(res.text)["message"] == "target in safezone"

def testBasicCase():
	#create game data
	test_data = createGameData()
	#create four test users
	user1_data = createUserData(test_data[0])
	user2_data = createUserData(test_data[0])
	user3_data = createUserData(test_data[0])
	user4_data = createUserData(test_data[0])
	#create a game with the above data
	testCreateGame(test_data[1])
	#add users with the above data
	testAddUser(user1_data)
	testAddUser(user2_data)
	testAddUser(user3_data)
	testAddUser(user4_data)
	#start game
	testStartGame(test_data[1])
	#update the player's locations to outside the safezone
	user1_data['x'] = 5
	user1_data['y'] = 5
	user2_data['x'] = 5
	user2_data['y'] = 5
	user3_data['x'] = 5
	user3_data['y'] = 5
	user4_data['x'] = 5
	user4_data['y'] = 5
	testUpdateLocation(user1_data)
	testUpdateLocation(user2_data)
	testUpdateLocation(user3_data)
	testUpdateLocation(user4_data)
	#attempt to kill the target
	testKillTarget(user1_data)

def testTargetInIndividualSafezone():
	#create game data
	test_data = createGameData()
	#create four test users
	user1_data = createUserData(test_data[0])
	user2_data = createUserData(test_data[0])
	user3_data = createUserData(test_data[0])
	user4_data = createUserData(test_data[0])
	#create a game with the above data
	testCreateGame(test_data[1])
	#add users with the above data
	testAddUser(user1_data)
	testAddUser(user2_data)
	testAddUser(user3_data)
	testAddUser(user4_data)
	#start game
	testStartGame(test_data[1])
	#attempt to kill the target
	testKillTargetWithSafezone(user1_data)

def testTargetInCentralSafezone():
	#create game data
	test_data = createGameData()
	#create four test users
	user1_data = createUserData(test_data[0])
	user2_data = createUserData(test_data[0])
	user3_data = createUserData(test_data[0])
	user4_data = createUserData(test_data[0])
	#create a game with the above data
	testCreateGame(test_data[1])
	#add users with the above data
	testAddUser(user1_data)
	testAddUser(user2_data)
	testAddUser(user3_data)
	testAddUser(user4_data)
	#start game
	testStartGame(test_data[1])
	#update the player's locations to outside the individual safezone
	#but inside the game safezone
	user1_data['x'] = 7
	user1_data['y'] = 7
	user2_data['x'] = 7
	user2_data['y'] = 7
	user3_data['x'] = 7
	user3_data['y'] = 7
	user4_data['x'] = 7
	user4_data['y'] = 7
	testUpdateLocation(user1_data)
	testUpdateLocation(user2_data)
	testUpdateLocation(user3_data)
	testUpdateLocation(user4_data)
	#attempt to kill the target
	testKillTargetWithSafezone(user1_data)

def testTargetInAlliance():
	#create game data
	test_data = createGameData()
	#create four test users
	user1_data = createUserData(test_data[0])
	user2_data = createUserData(test_data[0])
	user3_data = createUserData(test_data[0])
	user4_data = createUserData(test_data[0])
	#create a game with the above data
	testCreateGame(test_data[1])
	#add users with the above data
	testAddUser(user1_data)
	testAddUser(user2_data)
	testAddUser(user3_data)
	testAddUser(user4_data)
	#start game
	testStartGame(test_data[1])
	#update the player's locations to outside the safezone
	user1_data['x'] = 5
	user1_data['y'] = 5
	user2_data['x'] = 5
	user2_data['y'] = 5
	user3_data['x'] = 2
	user3_data['y'] = 2
	user4_data['x'] = 5
	user4_data['y'] = 5
	testUpdateLocation(user1_data)
	testUpdateLocation(user2_data)
	testUpdateLocation(user3_data)
	testUpdateLocation(user4_data)
	#alliance
	allId = testCreateAlliance(user1_data)
	user2_data['allianceId'] = allId
	testJoinAlliance(user2_data)
	#attempt to kill the target
	testKillTarget(user1_data)

def main():
	# testBasicCase()
	# testTargetInIndividualSafezone()
	# testTargetInCentralSafezone()
	testTargetInAlliance()
	
if __name__ == "__main__":
	main()