import requests
import json
import random
import string
# for now until we have a cleanup for games in the DB, must change loginCode before each run
# Formula: test, test1, test2, test3, ... 
def testCreateGame ():
	# random login code
	login_code = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(20))
	data = {'loginCode': login_code,
 			'orgName': "person",
			'xCoord' : 2, 'yCoord': 2, 'radius': 2}

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

def main():
	testCreateGame()

if __name__ == "__main__":
	main()