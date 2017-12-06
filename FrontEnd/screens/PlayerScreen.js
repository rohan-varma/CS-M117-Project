import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, AppRegistry, TextInput, Button, ImageBackground, ListView }   from 'react-native';
import { Actions } from 'react-native-router-flux';
import GameTextInput  from '../GameTextInput';
import Form  from '../src/form';
const { createGame, addUserToGame } = require('../requestors');
const _ = require('lodash');

class PlayerScreen extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([{name: 'Player 1'}, {name: 'Player 2'}]),
      playerTargets: ds.cloneWithRows([{name: 'Target 2'}, {name: 'Target 1'}]),
    };
  }

  render() {
    return (
      <View style={styles.formContainer}>
      <Text> Players in Game </Text>
      <ListView
        dataSource={this.state.dataSource}
        renderRow={player => {
          console.log(player)
          return <Text>{player.name}</Text>
        }}
      />
      <Text style={{paddingTop: 30}}> Your Targets </Text> 
      <ListView
        dataSource={this.state.playerTargets}
        renderRow={player => {
          console.log(player)
          return <Text>{player.name}</Text>
        }}
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

export default PlayerScreen;