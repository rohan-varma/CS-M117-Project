import React, { Component } from 'react';
import { StyleSheet, View, AppRegistry,ListView} from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Text,List, ListItem } from 'native-base';
import MapView from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
const { createGame, addUserToGame, getAllPlayersForGame,gameExists,startGame } = require('../requestors');
const _ = require('lodash');
 //var items = ['Simon Mignolet','Nathaniel Clyne','Dejan Lovren','Mama Sakho','Emre Can']
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class GamePage extends Component {

  constructor(props){
    super(props)
    
    const requestObj = JSON.stringify({loginCode:this.props.gameCode})
    getAllPlayersForGame(requestObj)
    .then(res => {
      console.log(JSON.stringify(res, null, 2))
      obj = res;
      this.setState({
        currentplayers: ds.cloneWithRows(res.alivePlayers.map(p => ({name: p.username}))),
      })
    })
    const req = JSON.stringify({loginCode:this.props.gameCode})
    gameExists(req)
    .then(res => {
      this.setState({
        ifGameStarted: res.started,
      })
    })
    this.state={
      safezoneRadius: 40,
            // default to Boelter Hall, UCLA
            mapRegion: {
                latitude: 34.0689,
                longitude: -118.443,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
            },
      currentplayers: ds.cloneWithRows([{name: 'Player 1'}, {name: 'Player 2'}]),
      ifGameStarted: false,
    };
  }
  startGame = () => {   
  // check if game is started
  startGame(this.props.gameCode);
  Actions.PlayerScreen({username:this.props.username,gameCode:this.props.gameCode});

  }

  render() {
    
   
    return (
      <Container style={{ flexDirection: 'column'}}>

        <Header style={{ flexDirection: 'column', alignItems:'center'}}> 
          <Text style= {{fontWeight: 'bold', marginBottom:10}}> Game:{this.props.gameCode} </Text>
          <Text style= {{fontWeight: 'bold',marginBottom:20}}> My Username:{this.props.username} </Text>
        </Header>
        <View style={{flexDirection: 'column',paddingTop: 20, alignItems:'center'}}>
         <Text style={{color:'black',fontWeight:'bold', fontSize:20}}>You are the game organizer, only you can start game</Text>
        </View>
        <View style = {{flex:0.2,padding:20}}>
       
         <Button danger full rounded
              onPress={this.startGame}>
              <Text style={{color:'white', fontWeight:'bold', fontSize:20}}>Start Game</Text>
            </Button>
        </View>
        <View style={{flexDirection: 'column', flex:1}}>
         <Text style={styles.text}>This is your safe zone and the shared safe zone</Text>
                <MapView
                    style={{ alignSelf: 'stretch', flex:1}}
                    region={this.state.mapRegion}
                    onRegionChange={this._handleMapRegionChange}>

                    <MapView.Circle
                        center={{latitude: this.state.mapRegion.latitude, longitude: this.state.mapRegion.longitude}}
                        radius={this.state.safezoneRadius}
                        fillColor="rgba(255, 0, 0, 0.3)"
                        strokeColor="rgba(255, 0, 0, 0.3)" />

                </MapView>
        </View>
        <View style={{flex:1}}>
          <ListItem itemDivider>
              <Text>Current Players:</Text>
          </ListItem> 
           <ListView
              dataSource={this.state.currentplayers}
              renderRow={currentplayers => {
              return <View style={styles.playerlistwrapper}><Text style={styles.playerlist}>{currentplayers.name}</Text></View>
            }}
          /> 
        </View>
        
        <Footer>
          <FooterTab>
            <Button info
              onPress={this.reload}>
              <Text style={{color:'white', fontWeight:'bold', fontSize:15}}>Refresh</Text>
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
