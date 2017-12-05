import React, { Component } from 'react';
import { 
  StyleSheet, 
  Text, View, 
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView

 } from 'react-native';
import { Button } from 'react-native-elements';
import GameTextInput  from '../components/GameTextInput';
import GameCreate from './GameCreate'
import GameLogIn from './GameLogIn'
import { Actions } from 'react-native-router-flux';


export default class Form extends Component {
  static navigationOptions = { header: null };
  render() {
    return (
      <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
        <ImageBackground style={styles.container} source={require('../img/ninja.jpg')}>
          <View style={styles.filler}/>
          <View style={styles.headercontainer}>
            <Text style={styles.header}> Bluetooth </Text> 
            <Text style={styles.header}> Assassin </Text> 
          </View>
          <View style={{flex:0.5}}/>
          <View style={styles.formContainer}> 
              <View style={{ flex: 1 }} >
                <Button
                    backgroundColor='rgba(201, 29, 77, 0.6)'
                    title="Log In to Existing Game"
                    onPress= {Actions.GameLogIn}
                    fontWeight='bold'
                    borderRadius={10}
                />
              </View>
              <View style={{ flex: 1 }} >
                <Button
                    backgroundColor='rgba(154, 196, 248, 0.75)'
                    title="Create a New Game"
                    onPress= {Actions.GameCreate}
                    fontWeight='bold'
                    borderRadius={10}
                />
            </View>

          </View>
         <View style={styles.filler}/>
        </ImageBackground>
      </KeyboardAvoidingView>

    );

  }

}

const styles = StyleSheet.create({
  headercontainer: {
      flex:1,
    },
    wrapper: {
      flex:1,
      
    },
    container: {
      flexDirection: 'column',
      flex: 1,
      alignSelf: 'stretch',
      width: null,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    header: {
      fontSize: 45,
      color: 'white',
      fontWeight: 'bold',
      backgroundColor: 'transparent',
      marginBottom: 10,
    },

    formContainer: {
      alignSelf:'stretch',
      paddingLeft:20,
      paddingRight:20,  
      flexDirection: 'column',
      justifyContent: 'center',
       flex:1

    },
    filler: {
      flex: 1,
    },

    

});