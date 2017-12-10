import React, { Component } from 'react';
import { StyleSheet, View, AppRegistry, ListView, Text} from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, List, ListItem, Icon } from 'native-base';
import MapView from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
try{
    p2pkit = require('react-native-p2pkit');
}
catch (err) {}
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
				console.log('there are alliances to join')
        //this user has an alliance, so take the user to the page where they view alliances
				{Actions.InAlliance({username: this.props.username, gameCode: this.props.gameCode, allianceObject: res})}
			}
      
		})
		.catch(err => {

      alert('There is no alliances to join. Please create one first.')
      
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
	    try {
	        console.log('join alliance called')
	        startJoinP2PKit((aId) => {
		    joinAlliance(JSON.stringify({username: this.props.username, allianceId: aId}, null, 2))
			.then(res => {
			    this.state.allianceIds.push(aId);
			    this.setState({hasJoinedAlliance: true});
			    console.log('join alliance res');
			    console.log(JSON.stringify(res, null, 2));
			    alert(`Joined alliance with id ${aId}!`);
			})
			.catch(err => {
			    console.log("join alliance err");
			    console.log(JSON.stringify(err,null, 2));
			})
	        });
	    }
	    catch(err) {
		joinAlliance(JSON.stringify({username: this.props.username}, null, 2))
		    .then(res => {
			this.state.allianceIds.push(res.allianceId);
			this.setState({hasJoinedAlliance: true});
			console.log('join alliance res');
			console.log(JSON.stringify(res, null, 2));
			alert(`Joined alliance with id ${aId}!`);
		    })
		    .catch(err => {
			console.log("join alliance err");
			console.log(JSON.stringify(err,null, 2));
		    });
	    }
 	}

        advertise = () => {
	    try {
	        if(this.state.allianceIds.length === 0) {
	            alert('You are not in an alliance! Please create one');
	        }
	        else {
	            startAdvertiseP2PKit(this.state.allianceIds[0]);
	        }
	    }
	    catch(err) { }
        }

    startJoinP2PKit = (callback) => {
	p2pkit.enable('APPKEY', {
	    onException: function(exceptionMessage) {
		console.log(exceptionMessage.message)
	    },

	    onEnabled: function() {
		console.log('p2pkit is enabled')
		p2pkit.enableProximityRanging()
		p2pkit.startDiscovery('lfa', p2pkit.HIGH_PERFORMANCE) //base64 encoded Data (bytes)
	    },

	    onDisabled: function() {
		console.log('p2pkit is disabled')
	    },

	    // Refer to platform specific API for error codes
	    onError: function(errorObject) {
		console.log('p2pkit failed to enable on platform ' + errorObject.platform + ' with error code ' + errorObject.errorCode)
	    },

	    onDiscoveryStateChanged: function(discoveryStateObject) {
		console.log('discovery state updated on platform ' + discoveryStateObject.platform + ' with error code ' + discoveryStateObject.state)
	    },

	    onPeerDiscovered: function(peer) {
		console.log('peer discovered ' + peer.peerID);
		if(peer.discoveryInfo != 'lfa') {
		    p2pkit.disable();
		    callback(peer.discoveryInfo);
		}
	    },

	    onPeerLost: function(peer) {
		p2pkit.disable();
		console.log('peer lost ' + peer.peerID)
	    },

	    onPeerUpdatedDiscoveryInfo: function(peer) {
		console.log('discovery info updated for peer ' + peer.peerID + ' info ' + peer.discoveryInfo)
	    },

	    onProximityStrengthChanged: function(peer) {
		console.log('proximity strength changed for peer ' + peer.peerID + ' proximity strength ' + peer.proximityStrength)
	    },

	    onGetMyPeerId: function(reply) {
		console.log(reply.myPeerId)
	    },

	    onGetDiscoveryPowerMode: function(reply) {
		console.log(reply.discoveryPowerMode)
	    }
	});
    }
    
    startAdvertiseP2PKit = (allianceID) => {
	p2pkit.enable('APPKEY', {
	    onException: function(exceptionMessage) {
		console.log(exceptionMessage.message)
	    },

	    onEnabled: function() {
		console.log('p2pkit is enabled')
		p2pkit.enableProximityRanging()
		p2pkit.startDiscovery(allianceID, p2pkit.HIGH_PERFORMANCE) //base64 encoded Data (bytes)
	    },

	    onDisabled: function() {
		console.log('p2pkit is disabled')
	    },

	    // Refer to platform specific API for error codes
	    onError: function(errorObject) {
		console.log('p2pkit failed to enable on platform ' + errorObject.platform + ' with error code ' + errorObject.errorCode)
	    },

	    onDiscoveryStateChanged: function(discoveryStateObject) {
		console.log('discovery state updated on platform ' + discoveryStateObject.platform + ' with error code ' + discoveryStateObject.state)
	    },

	    onPeerDiscovered: function(peer) {
		console.log('peer discovered ' + peer.peerID)
	    },

	    onPeerLost: function(peer) {
		p2pkit.disable();
		console.log('peer lost ' + peer.peerID)
	    },

	    onPeerUpdatedDiscoveryInfo: function(peer) {
		console.log('discovery info updated for peer ' + peer.peerID + ' info ' + peer.discoveryInfo)
	    },

	    onProximityStrengthChanged: function(peer) {
		console.log('proximity strength changed for peer ' + peer.peerID + ' proximity strength ' + peer.proximityStrength)
	    },

	    onGetMyPeerId: function(reply) {
		console.log(reply.myPeerId)
	    },

	    onGetDiscoveryPowerMode: function(reply) {
		console.log(reply.discoveryPowerMode)
	    }
	});
    }

  goToKill = () => {
    Actions.replace("KillScreen",{username: this.props.username, gameCode: this.props.gameCode})
   
  }
  goToPlayer = () => {
    Actions.replace("PlayerScreen",{username: this.props.username, gameCode: this.props.gameCode})
   
  }
	render() {
		return (
      <Container style={{ flexDirection: 'column'}}>

        <Header style={{ flexDirection: 'column', alignItems:'center'}}> 
          <Text style= {{fontWeight: 'bold', marginBottom:10}}> Game:{this.props.gameCode} </Text>
          <Text style= {{fontWeight: 'bold',marginBottom:20}}> My Username:{this.props.username} </Text>
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
	    <Button style={{margin: 10}}
            info
            full
              onPress={this.advertise}>
              <Text style={{color:'white', fontWeight:'bold', fontSize:15}}>Advertise My Alliance</Text>
            </Button>
            <Button full success
            style= {{bottom: 0}}
            onPress={this.reload}> 
              <Text style= {{color:'white'}}> See My Alliance </Text>
            </Button>
        </View>       
        <Footer>
          <FooterTab>
          <Button vertical
          onPress = {this.goToPlayer}>
           
              <Icon 
              ios='ios-person'
              android="md-person" 
              
               />
              <Text>Player</Text>
            </Button>
            <Button vertical
              onPress= {this.goToKill}>
              
              <Icon
              ios='ios-flash'
              android="md-flash" />
              <Text>Kill</Text>
            </Button>
            <Button vertical>
           
              <Icon
              style={{color:'rgba(154, 196, 248, 1)'}}
              ios='ios-contacts'
              android="md-contacts" />
              <Text style={{color:'rgba(154, 196, 248, 1)'}}>Alliance</Text>
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
