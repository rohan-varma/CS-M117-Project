import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, AppRegistry, TextInput, Button}   from 'react-native';
import { Actions } from 'react-native-router-flux';
import GameTextInput  from '../GameTextInput';
const { createGame, addUserToGame } = require('../requestors');
const _ = require('lodash');

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
    }

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

                <Button style={styles.button}
                  
                    title="placeholder for now, until i hook this up with login"
                
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

export default GameInput;