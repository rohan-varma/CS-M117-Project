import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, AppRegistry, TextInput}   from 'react-native';
import { Actions } from 'react-native-router-flux';
import GameTextInput  from '../components/GameTextInput';
import { Button } from 'react-native-elements';
import { Lobby} from './GameLobby';
import MapView from 'react-native-maps';

const _ = require('lodash');
const { gameExists, createGame, addUserToGame,organizerName } = require('../requestors');

class GameInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            gameCode: '',
            safezoneRadius: 40,
            // default to Boelter Hall, UCLA
            mapRegion: {
                latitude: 34.0689,
                longitude: -118.443,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
            },
        };
    }
    enterLobby = () => {
    
        const organizerRequest = JSON.stringify({
            loginCode: this.state.gameCode
        });
        organizerName(organizerRequest)
        .then(res => {
 
            console.log(res);
            var orgName = res.organizerName;
            console.log(orgName);
            if ( orgName == this.state.username) {
                Actions.Lobby_Master({username: this.state.username, gameCode: this.state.gameCode});
            }
            else {
                Actions.Lobby({username: this.state.username, gameCode: this.state.gameCode});
            }
        })
        
    }
    enterGame = () => {
        if (this.state.username == '') {
            alert('Please enter a username');
            return;
        };
        if (this.state.gameCode == '') {
            alert('Please enter a valid gamecode (5 characters)');
            return;
        };

        console.log(this.props.gameXCoord);
        console.log(this.props.gameYCoord);

        const gameRequestBody = JSON.stringify({
            loginCode: this.state.gameCode,
            orgName: this.state.username,
            xCoord: this.props.gameXCoord,
            yCoord: this.props.gameYCoord,
            radius: this.props.radius,
        });
        // create user and login
        const userRequestBody = JSON.stringify({
            username: this.state.username,
            loginCode: this.state.gameCode,
            mac: 'address',
            x: this.state.mapRegion.longitude,
            y: this.state.mapRegion.latitude,
	    xCoord: this.state.mapRegion.longitude,
	    yCoord: this.state.mapRegion.latitude,
            radius: this.state.safezoneRadius,
        });

        gameExists(gameRequestBody).then(res => {
            console.log ('This is the current game status');
            console.log (res.started);
            if (_.has(res, 'exists')) {
                var ifGameStarted = res.started;
                if (res.exists) {
                    
                    addUserToGame(userRequestBody).then(res => {
                        // success
                   
                        
                        if (ifGameStarted) {
                                // if game already started new users cant join
                               
                            if (res.username == this.state.username) {
                              
                                 Actions.PlayerScreen({username: this.state.username, gameCode: this.state.gameCode});
                            }
                            else {
                                 alert('Game already started, new player can not join an ongoing game. Please enter a new game.');
                            }

                            }
                        else {
                            this.enterLobby();
                            return;
                        }
                        
                    }).catch(err => {
                        console.log(err);
                        if (err.status == 400 && err.username == this.state.username) {
                            // if player with username exists in current game
                            //Actions.Lobby({username: this.state.username, gameCode: this.state.gameCode});
                           
                            if (ifGameStarted) {
                                // if game already started go to game page instead
                                Actions.PlayerScreen({username: this.state.username, gameCode: this.state.gameCode});
                                return;
                            } else {
                      
                                 this.enterLobby();
                            }
                           
                        }
                        alert("Failed to join game, please try again.");
                        Actions.GameLogIn();
                    });
                }
                else if (this.props.gameCreated) {
                    createGame(gameRequestBody).then(res => {
                        addUserToGame(userRequestBody).then(res => {
                            if (ifGameStarted) {
                                // if game already started go to game page instead
                                alert('game already started, can not join an ongoing game');
                                   
                                }
                            else {
                            
                                this.enterLobby();
                            }
                           
                        }).catch(err => {
                            console.log(err);
                            if (err.status == 400 &&
                                err.username == this.state.username) {
                                // if player with username exists in current game
                                    if (ifGameStarted) {
                                        // if game already started go to game page instead
                                         Actions.GamePage({username: this.state.username, gameCode: this.state.gameCode});
                                    }  else {
                                     
                                     this.enterLobby();
                                }
                              
                            }
                            alert("Failed to join game, please try again");
                            Actions.GameLogIn({
                                gameCreated: this.props.gameCreated,
                                maxPlayers: this.props.maxPlayers,
                                gameXCoord: this.props.gameXCoord,
                                gameYCoord: this.props.gameYCoord,
                                alliancesAllowed: this.props.alliancesAllowed,
                            });
                        });
                    }).catch(err => {
                        alert("Failed to create and join game, please try again");
                        Actions.GameLogIn({
                            gameCreated: this.props.gameCreated,
                            maxPlayers: this.props.maxPlayers,
                            gameXCoord: this.props.gameXCoord,
                            gameYCoord: this.props.gameYCoord,
                            alliancesAllowed: this.props.alliancesAllowed,
                        });
                    });
                }
                else {
                    alert("Please create a game first");
                    Actions.GameCreate();
                }
            }
        });
    }

    _handleMapRegionChange = mapRegion => {
        this.setState({ mapRegion });
    };

    render() {
    
        return (
            <View style={styles.formContainer} >
                <Text style={styles.text}>Enter username and a game ID</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Username"
                    onChangeText={ (username) => this.setState({username}) }
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Game Code"
                    onChangeText={ (gameCode) => this.setState({gameCode}) }
                />
                <View style={{flexDirection: 'column', flex:1}}>
                  <Text style={styles.text}>Select your safe zone</Text>
                  <MapView
                    style={{ alignSelf: 'stretch', flex:1 }}
                    region={this.state.mapRegion}
                    onRegionChange={this._handleMapRegionChange}>

                    <MapView.Circle
                        center={{latitude: this.state.mapRegion.latitude, longitude: this.state.mapRegion.longitude}}
                        radius={this.state.safezoneRadius}
                        fillColor="rgba(0, 255, 0, 0.3)"
                        strokeColor="rgba(0, 255, 0, 0.3)" />

                  </MapView>
                </View>
                <View style={{marginTop:20,flexDirection: 'column', flex:0.2}}>
                  <Button
                    backgroundColor='rgba(201, 29, 77, 0.6)'
                    title="Enter Game"
                    onPress={this.enterGame}
                    fontWeight='bold'
                    borderRadius={10}
                  />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formContainer: {
      alignSelf:'stretch',
      paddingLeft:20,
      paddingRight:20,
      flexDirection: 'column',
      flex: 1,
    },
    text: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop:20,
        paddingBottom:20,
    },
    textInput: {
      alignSelf: 'stretch',
      padding: 20,
      backgroundColor:'rgba(255,255,255,0.85)',
      marginBottom:7,
      marginTop:7,
    },
    button: {
      alignSelf: 'center',
      paddingRight:30,
      paddingLeft:30,
      marginTop:20,
      padding:20,
      backgroundColor: 'rgba(159, 20, 169, 0.6)',
      borderRadius: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    }

});

export default GameInput;
