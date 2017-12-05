### CS M117 Project

### How to Contribute 

Follow this guide: https://guides.github.com/introduction/flow/ 

Overview:
1) Clone the repository and create a local branch to work on your changes. 
2) Once you've finished the commits on your branch/feature, create a pull request.
3) Have people review your pull request and make comments/changes.
4) Once the pull request has been reviewed/approved, merge it to master. 


### Setup Instructions

1) Clone the repository
2) Navigate into the `FrontEnd` directory and run `npm i` to install all required dependencies
3) Navigate into the `BackEnd` directory and run `npm i` to install all required dependencies

### Running the front-end

Navigate into the Front-End directory

First, if you don't have node, run `brew install nodejs`

1) `brew install watchman`
2) `npm install -g react-native-cli`
3) `react-native run-ios` will launch the simulator

Please see README in frontend folder for frontend instructions

### Running the backend

1) Navigate into the BackEnd directory and run `npm start`. This will start the app listening on the port `localhost:3000/BluA`

### Testing the BackEnd

- `npm test` will test the APIs for the routes defined in `routes.js`. 
- The test file is located in `tests/tests.js`
- There is a script `test.py` that is in use to test the backend API calls. 

### Mongo Stuff
- Run mongo in a separate terminal with the command `mongod`
- To enter the mongoshell create a new terminal instance and run `mongo`. The default DB we are using is `BluA`, so inside the shell run the command `use BluA` to switch to this DB. 

As of now the DB has the following collections: 

games

players

To drop the database, run `mongo BluA --eval "db.dropDatabase()"`


### Backend / EC2 Stuff
After updating backend code, if you want the EC2 instance that's running the backend to reflect the code changes, ssh into it and manually restart the backend. You should test your code locally beforehand to make sure it works (if you want to test locally, change the SERVER\_URL in FrontEnd/requestors.js to localhost).

To SSH into the EC2 instance:
```bash
chmod 400 mongo117.pem
ssh -i "mongo117.pem" ec2-user@ec2-34-207-84-67.compute-1.amazonaws.com
```

Then in the EC2 instance, run the following commands to start the Backend
```bash
sudo su
cd /home/ec2-user/CS-M117-Project/
git pull -f
npm install
npm start
```

If you want to restart nginx (webserver) or mongod, you can use the commands:
```bash
sudo su
service nginx restart
service mongod restart
```
