import requests

# for now until we have a cleanup for games in the DB, must change loginCode before each run
# Formula: test, test1, test2, test3, ... 
def testCreateGame ():
	print(requests.post("http://localhost:3000/BluA/createGame", data={'loginCode': "test", 'orgName': "person", 'xCoord' : 2, 'yCoord': 2, 'radius': 2}))

def main():
	testCreateGame()

if __name__ == "__main__": main()