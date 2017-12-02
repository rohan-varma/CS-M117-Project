import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, AppRegistry, TextInput } from 'react-native';
const _ = require('lodash');

class GameTextInput extends Component {
  handleLoginInput = text => {
    this.setState({
      text,
      errorWithGameCreationText: '',
    });
      if (text.length === 5) {
        console.log('about to send it to the backend');
        fetch('http://localhost:3000/BluA/createGame', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            loginCode: text,
            orgName: "defaultOrg",
          }),
        })
        .then(res => res.json())
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
              console.log('already exsting game found, adding user to this game');
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
      gameCreated: false,
      errorWithGameCreationText: '',
    };
  }
  render() {
    return (
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Please enter game code"
          onChangeText={text => this.handleLoginInput(text)}
        />
      <Text> Game created: {this.state.gameCreated ? 'Yes': 'No'} </Text>
      <Text>{this.state.errorWithGameCreationText} </Text>
      </View>
    );
  }
}

export default GameTextInput;