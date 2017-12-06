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
    console.log('constructing this shit now')
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    super(props);
    let obj;
    //fetch the players
    console.log('USING GAME ID ', this.props.gameId)
    const requestObj = {gameId: this.props.gameId, playerId: this.props.playerId}
    getAllPlayersForGame(JSON.stringify(requestObj))
    .then(res => {
      //get targets for this player //this.props.playerId
      console.log('the shitty request object')
      const targetReqObj = {
        gameId: this.props.gameId || '5a27ac3355c516ffe4f47bad', //default game
        username: this.props.username,
      }
      console.log(JSON.stringify(targetReqObj, null, 2))
      getTargetsForPlayer(JSON.stringify(targetReqObj))
      .then(res => {
        //handle res
        console.log('result for get player targets')
        console.log(res);
      })
      .catch(err => {
        //handle err
        console.log('had error get player targets')
        console.log(err)
      })
      //continue here? 
      console.log('hello world!')
      console.log(JSON.stringify(_.keys(res), null, 2))
      obj = res;
      this.setState({
        alivePlayers: ds.cloneWithRows(res.alivePlayers.map(p => ({name: p.username}))),
        deadPlayers: ds.cloneWithRows(res.deadPlayers.map(p => ({name: p.username}))),
      })
    })
    .catch(err => {
      console.log('err is ', err)
    })
    //shitty default state
    this.state = {
      //dataSource: ds.cloneWithRows([{name: 'Player 1'}, {name: 'Player 2'}]),
      playerTargets: ds.cloneWithRows([{name: 'Target 2'}, {name: 'Target 1'}]),
      alivePlayers: ds.cloneWithRows([{name: 'Player 1'}, {name: 'Player 2'}]),
      deadPlayers: ds.cloneWithRows([{name: 'Player 1'}, {name: 'Player 2'}]),
    };
  }

  render() {
    return (
      <View style={styles.formContainer}>
      <Text> Players in Game </Text>
      <ListView
        dataSource={this.state.alivePlayers}
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