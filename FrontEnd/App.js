import React, { Component } from 'react';
import { StyleSheet, Text, View,
  AppRegistry, 
  TextInput,
  Image,
  ImageBackground,
  KeyboardAvoidingView
 } from 'react-native';

import Lobby from './screens/GameLobby';
import Home from './screens/home';
import Form from './components/form';
import PlayerScreen from './screens/PlayerScreen';
import GameCreate from './screens/GameCreate';
import GameLogIn from './screens/GameLogIn'
import {Scene, Router} from 'react-native-router-flux';
const _ = require('lodash');

export default class App extends React.Component {
  render() {
    return (
          <Router>
            <Scene key="root">
              <Scene key="Home" component={Home} />
              <Scene key="GameCreate" component={GameCreate} title = "Create a New game"/>
              <Scene key="GameLogIn" component={GameLogIn} title = "Log in"/>
              <Scene key="Lobby" component={Lobby} title = "game"/>
              <Scene key="PlayerScreen" component={PlayerScreen} initial={true} title = "Players" />
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

});
