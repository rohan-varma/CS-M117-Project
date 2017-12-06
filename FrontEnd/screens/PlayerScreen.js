import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, AppRegistry, TextInput, Button, ImageBackground, ListView }   from 'react-native';
import { Actions } from 'react-native-router-flux';
import GameTextInput  from '../GameTextInput';
//import Form  from '../src/form';
const { createGame, addUserToGame, getAllPlayersForGame, getTargetsForPlayer } = require('../requestors');
const _ = require('lodash');


//MUST BE INIT WITH GAME ID!
class PlayerScreen extends Component {
  constructor(props) {
    //passed in game id
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    super(props);
    this.state = {
      playerTargets: ds.cloneWithRows([{name: 'Target 2'}, {name: 'Target 1'}]),
      alivePlayers: ds.cloneWithRows([{name: 'Player 1'}, {name: 'Player 2'}]),
      deadPlayers: ds.cloneWithRows([{name: 'Player 1'}, {name: 'Player 2'}]),
  };
    //need a loginCode and username
    const gameCode = this.props.gameCode || 'axxw4vi8jjor';
    const username = this.props.username || 'crwqt9i5jc3di';
    const requestObj = {loginCode: gameCode, username: username}
    //get all players needs a login code
    getAllPlayersForGame(JSON.stringify(requestObj))
    .then(res => {
      getTargetsForPlayer(JSON.stringify(requestObj))
      .then(res => {
        //handle res
        console.log('result for get player targets')
        console.log(res);
        const playerTargets = res.targets || [];
        this.setState({
          playerTargets: ds.cloneWithRows(playerTargets.map(t => ({name: t.username}))),
        })
      })
      .catch(err => {
        //handle err
        console.log('had error get player targets')
        console.log(err)
      })
      //continue here? 
      console.log('this object has the player data')
      console.log(JSON.stringify(res, null, 2))
      this.setState({
        alivePlayers: ds.cloneWithRows(res.alivePlayers.map(p => ({name: p.username}))),
        deadPlayers: ds.cloneWithRows(res.deadPlayers.map(p => ({name: p.username}))),
      })
    })
    .catch(err => {
      console.log('err is ', err)
    })
    //hack

  }

  render() {
    return (
      <View style={styles.formContainer}>
      <Text> Players in Game </Text>
      <ListView
        dataSource={this.state.alivePlayers.length !== 0 ? this.state.alivePlayers : [{name: 'No Players'}]}
        renderRow={player => {
          console.log(player)
          return <Text>{player.name}</Text>
        }}
      />
      <Text style={{paddingTop: 30}}> The Noble Players Who Were Killed In Battle </Text>
      <ListView
        dataSource={this.state.deadPlayers.length !== 0 ? this.state.deadPlayers : [{name: 'No Players'}]}
        renderRow={player => {
          console.log(this.state.deadPlayers)
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