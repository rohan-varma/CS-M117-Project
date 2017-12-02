import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, AppRegistry, TextInput } from 'react-native';
import GameTextInput  from './GameTextInput';

const _ = require('lodash');

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