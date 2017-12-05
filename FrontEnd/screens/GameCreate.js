import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, AppRegistry, TextInput, Button, ImageBackground }   from 'react-native';
import { Actions } from 'react-native-router-flux';
import GameTextInput  from '../components/GameTextInput';
import Form  from '../components/form';
const { createGame, addUserToGame } = require('../requestors');
const _ = require('lodash');

class GameCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            gameCode: ''
        };
    }
    render() {
        return (
        <ImageBackground style={styles.container} source={require('../img/ninja.jpg')}>
            <View style={styles.formContainer}> 
                <Form/> 
            </View>
        </ImageBackground>

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


});

export default GameCreate;