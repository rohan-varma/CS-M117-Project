import React, { Component } from 'react';
import { StyleSheet, View, AppRegistry,ListView} from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Text,List, ListItem,Icon } from 'native-base';
import MapView from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
const { createGame, addUserToGame, getAllPlayersForGame,gameExists, createAlliance, getAlliance, joinAlliance } 
= require('../requestors');
const _ = require('lodash');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class AllianceScreen extends Component {

	constructor(props) {
		super(props)
		this.state = {
			allianceIds: [],
			hasJoinedAlliance: false,
		};
	}

	reload = () => {

		//check if alliance exists for this player
		//if so go to the other alliance screen
		const gameCode = this.props.gameCode || '17WCBXGKMVBA5WLP16VK29PJUVDPSX3K4PU8L4GIGI0L0O';
    	const username = this.props.username || 'UA8FSACQKCV37RGDWE6R';
    	const requestObj = {loginCode: gameCode, username: username}
		console.log('checking if the player has an alliance')
		getAlliance(JSON.stringify(requestObj, null, 2))
		.then(res => {
			console.log('get alliance res')
			console.log(JSON.stringify(res, null, 2))
			if (res.allies.length > 0) {
				//this user has an alliance, so take the user to the page where they view alliances
				alert('you have an alliance!')
				{Actions.InAlliance({username: this.props.username, gameCode: this.props.gameCode, allianceObject: res})}
			}
		})
		.catch(err => {
			console.log('get alliance err')
			console.log(JSON.stringify(err, null, 2))
		})
	}


	create = () => {
		console.log('create alliance called')
		const gameCode = this.props.gameCode || '17WCBXGKMVBA5WLP16VK29PJUVDPSX3K4PU8L4GIGI0L0O';
    	const username = this.props.username || 'UA8FSACQKCV37RGDWE6R';
    	const requestObj = {loginCode: gameCode, username: username}
    	createAlliance(JSON.stringify(requestObj, null, 2))
    	.then(res => {
    		console.log('create alliance res')
    		console.log(res);
    		this.state.allianceIds.push(res.allianceId);
    		console.log(this.state.allianceIds)
    		this.setState({hasJoinedAlliance: true});
    		alert(`An alliance with id ${res.allianceId} has been created!`)
    	})
    	.catch(err => {
    		console.log('err creating alliance')
    		console.log(err)
    		alert('Error: we were unable to create an alliance. Please try again.')
    	})

		//call out to the backend here
	}

	join = () => {
		console.log('join alliance called')

		if(this.state.allianceIds.length === 0) {
			alert('No alliances exit right now, please create one')
		} else {
			//just pick an alliance for now
			toJoin = this.state.allianceIds[0];
			joinAlliance(JSON.stringify({allianceId: toJoin}, null, 2))
			.then(res => {
				console.log('join alliance res')
				console.log(JSON.stringify(res, null, 2))
				this.setState({hasJoinedAlliance: true})
			})
			.catch(err => {
				console.log('join alliance err')
				console.log(JSON.stringify(err,null, 2))
			})
		}
 	}
  goToPlayer = () => {
    Actions.PlayerScreen({username: this.props.username, gameCode: this.props.gameCode})
  }
	render() {
		return (
      <Container style={{ flexDirection: 'column'}}>

        <Header style={{ flexDirection: 'column', alignItems:'center'}}> 
          <Text style= {{fontWeight: 'bold'}}> Create An Alliance </Text>
          <Text style= {{fontWeight: 'bold'}}> My Username:{'rohan'} </Text>
        </Header>
        <View style={{flex:1, margin: 10}}>
          <Button 
          info 
          full
              onPress={this.create}>
              <Text style={{color:'white', fontWeight:'bold', fontSize:15}}>Create An Alliance</Text>
            </Button>
            <Button style={{margin: 10}} 
            info 
            full
              onPress={this.join}>
              <Text style={{color:'white', fontWeight:'bold', fontSize:15}}>Join An Alliance</Text>
            </Button>
            <Button full success
            style= {{bottom: 0}}
            onPress={this.reload}> 
              <Text> See My Alliance </Text>
            </Button>
        </View>       
        <Footer>
          <FooterTab>
            <Button vertical
            onPress = {this.goToPlayer}>
              <Icon name="ios-person" />
              <Text>Player</Text>
            </Button>
            <Button vertical>
              <Icon name="md-flash" />
              <Text>Kill</Text>
            </Button>
            <Button vertical >
              <Icon active
                style={{color:'rgba(154, 196, 248, 1)'}}
               name="ios-contacts" />
              <Text style={{color: 'rgba(154, 196, 248, 1)'}}>Alliance</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
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
  }
});