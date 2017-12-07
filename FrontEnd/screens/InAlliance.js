import React, { Component } from 'react';
import { StyleSheet, View, AppRegistry,ListView} from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Text,List, ListItem } from 'native-base';
import MapView from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
const { createGame, addUserToGame, getAllPlayersForGame,gameExists, createAlliance, getAlliance, joinAlliance } 
= require('../requestors');
const _ = require('lodash');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class InAlliance extends Component {

	constructor(props) {
		super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    console.log(`username: ${this.props.username}`)
    console.log(`gameCode: ${this.props.gameCode}`)
    console.log('allies')
    console.log(JSON.stringify(this.props.allianceObject.allies.length, null, 2))
    console.log(JSON.stringify(this.props.allianceObject.targets.length, null, 2))
    this.state = {
        allies: ds.cloneWithRows(this.props.allianceObject.allies.map(p => ({name: p.username}))),
        targets: ds.cloneWithRows(this.props.allianceObject.targets.map(p => ({name: p.username}))),
      };
    console.log('the state')
    console.log(JSON.stringify(this.state, null, 2))
	}
  render() {
    console.log('allies in render')
    console.log(JSON.stringify(this.state.allies))
    return (
      <View style={styles.formContainer}>

        <Header style={{ flexDirection: 'column', alignItems:'center'}}> 
          <Text style= {{fontWeight: 'bold'}}> Alliance Page </Text>
          <Text style= {{fontWeight: 'bold'}}> My Username:{'rohan'} </Text>
        </Header>
      <Text> Members of your Alliance: </Text>
      <ListView
        dataSource={this.state.allies}
        renderRow={player => {
          return <View style={styles.playerlistwrapper}><Text style={styles.playerlist}>{player.name}</Text></View>
        }}
      />
      <Text> Targets of your Alliance: </Text>
      <ListView
        dataSource={this.state.targets}
        renderRow={player => {
          return <View style={styles.playerlistwrapper}><Text style={styles.playerlist}>{player.name}</Text></View>
        }}
      />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  text:{
    padding: 10,
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
    padding: 10,
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