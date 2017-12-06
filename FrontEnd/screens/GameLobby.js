import React, { Component } from 'react';
import { StyleSheet, View, AppRegistry,ListView} from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Text,List, ListItem } from 'native-base';
import MapView from 'react-native-maps';
const { createGame, addUserToGame, getAllPlayersForGame } = require('../requestors');
const _ = require('lodash');
 var items = ['Simon Mignolet','Nathaniel Clyne','Dejan Lovren','Mama Sakho','Emre Can']
export default class GamePage extends Component {
  constructor(props){
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    // const requestObj = JSON.stringify({gameId: '11111', playerId: this.props.playerId})
    // getAllPlayersForGame(requestObj)
    // .then(res => {
    //   console.log(JSON.stringify(_.keys(res), null, 2))
    //   obj = res;
    //   this.setState({
    //     currentplayers: ds.cloneWithRows(res.alivePlayers.map(p => ({name: p.username}))),
        
    //   })
    // })
    this.state={
      safezoneRadius: 40,
            // default to Boelter Hall, UCLA
            mapRegion: {
                latitude: 34.0689,
                longitude: -118.443,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
            },
      currentplayers: ds.cloneWithRows(items),
    };
  }
  render() {
    
   
    return (
      <Container style={{ flexDirection: 'column'}}>

        <Header style={{ flexDirection: 'column', alignItems:'center'}}> 
          <Text style= {{fontWeight: 'bold'}}> Game:{this.props.gameCode} </Text>
          <Text style= {{fontWeight: 'bold'}}> My Username:{this.props.username} </Text>
        </Header>

        <View>
          <Text style={styles.text}>Game Status: Waiting for gameOrganizer to start the game </Text>
        </View>

        <View style={{flex:1}}>
          <ListItem itemDivider>
              <Text>Current Players:</Text>
          </ListItem> 
           <ListView
              dataSource={this.state.currentplayers}
              renderRow={currentplayers => {
         
              return <View style={styles.playerlistwrapper}><Text style={styles.playerlist}>{currentplayers}</Text></View>
            }}
          /> 
        </View>
      {/*
          <Content >
            <View syle= {styles.playerWrapper}>
            
            <List dataArray={items}
              renderRow={(item) =>
                <ListItem>
                  <Text>{item}</Text>
                </ListItem>
              }>
            </List>
            </View>
         
            </Content>

      */}
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
        <Footer>
          <FooterTab>
            <Button>
              <Text>Refresh</Text>
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
