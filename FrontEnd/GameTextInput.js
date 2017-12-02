import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, AppRegistry, TextInput } from 'react-native';
const { createGame, addUserToGame } = require('./requestors');
const _ = require('lodash');

class GameTextInput extends Component {

  handleUserInput = usernameText => {
    this.setState({
      usernameText,
    });
  }

  handleLoginInput = text => {
    this.setState({
      text,
      errorWithGameCreationText: '',
    });
      if (text.length === 5) {
        console.log('about to send it to the backend');
        const requestBody = JSON.stringify({
            loginCode: text,
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
              console.log('already existing game found, adding user to this game');
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
            username: this.state.usernameText,
            loginCode: text,
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
      }
    }
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      usernameText: '',
      gameCreated: false,
      errorWithGameCreationText: '',
    };
  }
  render() {
    return (
      <View style={{flex: 1, padding: 10}}>
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Please enter a username"
          onChangeText={usernameText => this.handleUserInput(usernameText)}
        />
      </View>
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Please enter game code"
          onChangeText={text => this.handleLoginInput(text)}
        />
      <Text> Game created: {this.state.gameCreated ? 'Yes': 'No'} </Text>
      <Text>{this.state.errorWithGameCreationText} </Text>
      </View>
      </View>
    );
  }
}

export default GameTextInput;