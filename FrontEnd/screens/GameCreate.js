import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, AppRegistry, TextInput, ImageBackground }   from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button } from 'react-native-elements';
import GameTextInput  from '../components/GameTextInput';
import Form  from '../components/form';
const { createGame, addUserToGame } = require('../requestors');
const _ = require('lodash');

class GameCreate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username:'',
            gameCode: '',
        };
    }
    render() {
       const gotoGamePage = () => Actions.GamePage({username: this.state.username}); 
        return (
          <View style={styles.container}>
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
                
                 <Button
                    backgroundColor='rgba(201, 29, 77, 0.6)'
                    title="Create Game"
                    fontWeight='bold'
                    borderRadius={10}
                />

            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignSelf: 'stretch',
      width: null,
      justifyContent: 'center',
      alignItems: 'center',

    },
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
        buttonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    }


});

export default GameCreate;