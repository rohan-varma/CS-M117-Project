import React, { Component } from 'react';


import { StyleSheet, Text, View, Navigator, AppRegistry, TextInput}   from 'react-native';
import { Actions } from 'react-native-router-flux';
import GameTextInput  from '../components/GameTextInput';
import { Button } from 'react-native-elements';
import { Lobby} from './GameLobby';

const _ = require('lodash');
const { gameExists, createGame, addUserToGame } = require('../requestors');

class GameInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            gameCode: '',
        };
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

        const requestBody = JSON.stringify({
            loginCode: this.state.gameCode,
            orgName: "defaultOrg",
        });

        /*
        createGame(requestBody).then( res => {
            // if game doesn't exist, go to create game first
            if (_.has(res, '') {
                // If the game hasn't been created yet
                Actions.GameCreate();
            }
        }).then( () => {
        }).catch( err => {
        });
        */
    }
    goToLobby = () => Actions.Lobby({username: this.state.username, gameCode:this.state.gameCode}); 
    render() {
     
        return (
            <View style={styles.formContainer} >
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

                <View style={{flex:0.1}}/>
                <Text> Choose a Safe Zone </Text>
                <View style={{flex:0.5}}/>
                 <Button
                    backgroundColor='rgba(201, 29, 77, 0.6)'
                    title="Enter Game"
                    onPress={this.goToLobby}
                    fontWeight='bold'
                    borderRadius={10}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formContainer: {
      alignSelf:'stretch',
      paddingLeft:20,
      paddingRight:20,
      paddingTop: 50,
      flexDirection: 'column',
      flex: 1,
    },
    textInput: {
      alignSelf: 'stretch',
      padding: 20,
      backgroundColor:'rgba(255,255,255,0.85)',
      marginBottom:15,
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
