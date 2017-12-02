import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, AppRegistry, TextInput } from 'react-native';
import Movies from './src/Movies'
const _ = require('lodash');


class Greeting extends Component {
  render() {
    return (
      <Text> Hello {this.props.name}! </Text>
      );
  }
}

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
            this.setState({
              errorWithGameCreationText: 'err: ' + res.error,
            });
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

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hi! Please enter a game code.</Text>
        <Text> Or, enter a code to create a new game. </Text>
        <GameTextInput />
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});