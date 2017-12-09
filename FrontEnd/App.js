import React, { Component } from 'react';
import { StyleSheet, Text, View,
  AppRegistry, 
  TextInput,
  Image,
  ImageBackground,
  KeyboardAvoidingView
 } from 'react-native';

import Lobby_Master from './screens/GameLobby_master';
import Lobby from './screens/GameLobby';
import Home from './screens/home';
import Form from './components/form';
import AllianceScreen from './screens/AllianceScreen';
import InAlliance from './screens/InAlliance';
import PlayerScreen from './screens/PlayerScreen';
import GameCreate from './screens/GameCreate';
import GameLogIn from './screens/GameLogIn';
import KillScreen from './screens/KillScreen';
import {Scene, Router,Tabs, Stack,Actions} from 'react-native-router-flux';
const _ = require('lodash');

export default class App extends React.Component {
  render() {
    return (
          <Router>
            <Scene key="root">
              <Scene key="Home" component={Home} initial />
              <Scene key="GameCreate" component={GameCreate} title = "Create a New game"/>
              <Scene key="GameLogIn" component={GameLogIn} title = "Log in"/>
              <Scene key="Lobby" component={Lobby} title="Game Lobby"rightTitle="Log Out" 
              onRight={() =>{Actions.Home()}}/>
              <Scene key="PlayerScreen" component={PlayerScreen} title = "Players" rightTitle="Log Out" 
              onRight={() =>{Actions.Home()}}/>
              <Scene key="Lobby_Master" component={Lobby_Master}  title="Game Lobby" rightTitle="Log Out" 
              onRight={() =>{Actions.Home()}}/>
              <Scene key="AllianceScreen" component={AllianceScreen} title="Alliance Screen" rightTitle="Log Out" 
              onRight={() =>{Actions.Home()}}/>
              <Scene key="KillScreen" component={KillScreen} title="Kill" rightTitle="Log Out" 
              onRight={() =>{Actions.Home()}}/>
              <Scene key="InAlliance" component={InAlliance} title="In Alliance" />
            
               
               
            </Scene>
          </Router>

    );
  }
}

const styles = StyleSheet.create({
    wrapper: {
      flex:1,
    },
    container: {
      flex: 1,
      alignSelf: 'stretch',
      width: null,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
     
      fontSize: 38,
      color: 'white',
      fontWeight: 'bold',
      backgroundColor: 'transparent',
      marginBottom: 10,
    },
    labels: {
      fontSize:15,
      padding:10,
      color: 'white',
      flexDirection: 'row',
      alignSelf:'center',
      justifyContent:'center',

    },

});
