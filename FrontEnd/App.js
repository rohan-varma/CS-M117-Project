import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, 
  AppRegistry, 
  TextInput,
  Image,
  ImageBackground,
  KeyboardAvoidingView
 } from 'react-native';
import GameTextInput  from './GameTextInput';
import Form from './src/form';

const _ = require('lodash');

export default class App extends React.Component {
  render() {
    return (
     /* <View style={styles.container}>
        <Text style={{padding:40}}>Hi! Please enter a game code.</Text>
        <Text> Or, enter a code to create a new game. </Text>
        <GameTextInput />
      </View>*/
      <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
        <ImageBackground style={styles.container} source={require('./img/ninja.jpg')}>
          <Text style={styles.header}> Bluetooth </Text> 
          <Text style={styles.header}> Assissan </Text> 
           <Form />
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    wrapper: {
      flex:1,
    },
    container: {
      flex: 1,
      alignSelf: 'stretch',
      width: null,
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
    gameInput: {
      paddingTop: 50,
      flex: 1,
    }
});