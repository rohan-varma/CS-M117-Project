import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, AppRegistry, TextInput, Button, ImageBackground }   from 'react-native';
import { Actions } from 'react-native-router-flux';
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
        <View style={styles.formContainer}> 
            <Text>asdfasdf</Text>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 38,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        marginBottom: 10,
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

    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
    }
});

export default GameCreate;
