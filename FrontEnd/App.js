import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, 
  AppRegistry, 
  TextInput,
  Image,
  ImageBackground,
  KeyboardAvoidingView
 } from 'react-native';
import gamePage  from './src/gamePage';
import Form from './src/form';
import home from './screens/home';
import GameCreate from './screens/GameCreate';
import GameLogIn from './screens/GameLogIn'
import {Scene, Router} from 'react-native-router-flux';
import PlayerScreen from './screens/PlayerScreen';
const _ = require('lodash');

export default class App extends React.Component {
  render() {
    return (
          <Router>
            <Scene key="root">
              <Scene key= "home" component={home} initial={true}/>
              <Scene key="login" component={Form}/>
              <Scene key="GameCreate" component={GameCreate} title = "Create a New game"/>
              <Scene key="GameLogIn" component={GameLogIn} title = "Log in"/>
              <Scene key='PlayerScreen' component={PlayerScreen} title = "Player Screen" />
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