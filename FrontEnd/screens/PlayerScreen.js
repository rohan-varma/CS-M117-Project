import React, { Component } from 'react';
import { StyleSheet, View, Navigator, AppRegistry, TextInput, ImageBackground, ListView, Text }   from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon} from 'native-base';
import { Actions, Tab } from 'react-native-router-flux';
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
      deadPlayers: ds.cloneWithRows([{name: 'Player 3'}, {name: 'Player 4'}]),
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

  }
  reload = () => {
    var requestObj = {loginCode: this.props.gameCode, username: this.props.username}
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

  }
  goToKill = () => {
    Actions.replace("KillScreen",{username: this.props.username, gameCode: this.props.gameCode})
  }
  goToAlliance = () => {
    Actions.replace("AllianceScreen",{username: this.props.username, gameCode: this.props.gameCode})
    //Actions.AllianceScreen({username: this.props.username, gameCode: this.props.gameCode})
  }
  playerReload = () => {
    Actions.replace("PlayerScreen",{username: this.props.username, gameCode: this.props.gameCode})
    //Actions.PlayerScreen({username: this.props.username, gameCode: this.props.gameCode})
  }
  render() {
    return (
      <Container>
      <Content>
      <View style={styles.formContainer}>
      <Text> Players in Game </Text>
      <ListView
        dataSource={this.state.alivePlayers.length !== 0 ? this.state.alivePlayers : [{name: 'No Players'}]}
	enableEmptySections={true}
        renderRow={player => {
          console.log(player)
          return <View style={styles.playerlistwrapper}><Text style={styles.playerlist}>{player.name}</Text></View>
        }}
      />
      <Text style={{paddingTop: 30}}> The Noble Players Who Were Killed In Battle </Text>
      <ListView
        dataSource={this.state.deadPlayers.length !== 0 ? this.state.deadPlayers : [{name: 'No Players'}]}
	enableEmptySections={true}
        renderRow={player => {
          return <View style={styles.playerlistwrapper}><Text style={styles.playerlist}>{player.name}</Text></View>
        }}
      />
      <Text style={{paddingTop: 30}}> Your Targets </Text> 
      <ListView
        dataSource={this.state.playerTargets}
	enableEmptySections={true}x
        renderRow={player => {
          console.log(player)
          return <View style={styles.playerlistwrapper}><Text style={styles.playerlist}>{player.name}</Text></View>
        }}
      />
      </View>
      </Content>
        <Footer>
          <FooterTab>

            <Button vertical>
              
              <Icon 
              ios='ios-person'
              android="md-person" 
              style={{color:'rgba(154, 196, 248, 1)'}}
              active 
               />
              <Text style = {{color: 'rgba(154, 196, 248, 1)'}}>Player</Text>
            </Button>
            <Button vertical
              onPress= {this.goToKill}>
             
              <Icon
              ios='ios-flash'
              android="md-flash" />
              <Text>Kill</Text>
            </Button>
            <Button vertical 
            onPress = {this.goToAlliance}>
              
              <Icon
              ios='ios-contacts'
              android="md-contacts" />
              <Text>Alliance</Text>
            </Button>
   
          </FooterTab>

        </Footer>
        </Container>
      

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
    },
  text:{
    padding: 15,
    alignSelf:'center'

  },
  playerWrapper: {
    backgroundColor: 'white',

  },
  playerlistwrapper: {
    alignSelf:'stretch',
    backgroundColor:'white',
    borderColor:'lightgray',
    
  }, 
  playerlist: {
    padding: 10,
    alignSelf:'center',
    backgroundColor:'white',
  }


});

export default PlayerScreen;
