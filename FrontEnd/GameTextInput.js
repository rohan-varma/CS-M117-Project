import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, AppRegistry, TextInput, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
const { createGame, addUserToGame } = require('./requestors');
const _ = require('lodash');

export default class GameTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username:'',
      gameCode: '',

      text: '',
      usernameText: '',
      gameCreated: false,
      errorWithGameCreationText: '',
    };
  }
  enterGame = () => {
    if (this.state.gameCode === '') {
      alert("Game code can't be empty");
      return;
    };
    if (this.state.username === '') {
      alert("Username can't be empty");
      return;
    };
     const requestBody = JSON.stringify({
            loginCode: this.state.gameCode,
            orgName: "defaultOrg",
          });
      createGame(requestBody)
      .then(res => {
          console.log('result message');
          //if res has key message then the result is success
          //else the res should have key error, which will say why the game wasn't created
          console.log(res);
          if (_.has(res, 'message')) {
            
            this.setState({
              gameCreated: true,
            });
          }
          else if (_.has(res, 'error')) {
            console.log(res.error);
            if(res.error.includes('Game with login code')) {
              
              this.setState({
                errorWithGameCreationText: 'You entered an existing game code, logging you into that',
              });
            }
            else {
            this.setState({
              errorWithGameCreationText: 'err: ' + res.error,
            });
          }
          }
        })
      .then(() => {
          //create a user
          console.log('creating a user')
          const userRequestBody = JSON.stringify({
            username: this.state.username,
            loginCode: this.state.gameCode,
            mac: 'address', //default, change this?
            //defaults
            x: 2,
            y: 2,
          });
          addUserToGame(userRequestBody)
          .then(res => {
            console.log('result of adding user');
            console.log(res);
          })
          .catch(err => {
            console.log('error adding user');
            console.log(err);
          })
        })
        .catch(err => {
          console.log('request failed');
          console.log(err);
          this.setState({
            errorWithGameCreationText: 'There was an error with game creation: ' + err,
          });
        });

    Actions.gamePage();
  }
  render() {
    return (
      <View style={styles.formContainer}>
        <TextInput
         style={styles.textInput} 
          placeholder="Username"
          onChangeText={ (username) => this.setState({username})}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Game code"
          onChangeText={gameCode => this.setState({gameCode})}
        />
        <TouchableOpacity style= {styles.button} >
            <Text style={styles.buttonText} onPress={this.enterGame}> Enter Game </Text>
        </TouchableOpacity>
      </View>
    
    );
  }
}


const styles = StyleSheet.create({
    formContainer: {
      alignSelf:'stretch',
      paddingLeft:20,
      paddingRight:20,  
      paddingTop: 50
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