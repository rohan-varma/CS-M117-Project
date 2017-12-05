import React, { Component } from 'react';
import { 
  StyleSheet, 
  Text, View, 
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView

 } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import GameTextInput  from '../GameTextInput';
import GameCreate from './GameCreate'
import GameLogIn from './GameLogIn'
import { Actions } from 'react-native-router-flux';


export default class Form extends Component {
  static navigationOptions = { header: null };
  render() {
    return (
      <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
        <ImageBackground style={styles.container} source={require('../img/ninja.jpg')}>
          <Text style={styles.header}> Bluetooth </Text> 
          <Text style={styles.header}> Assassin </Text> 
            <View style={styles.formContainer}> 
                <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flex: 1 }} >
                <Button
                    backgroundColor='#E36588'
                    title="Login to Existing Game"
                     onPress= {Actions.GameLogIn}
                    
                />
            </View>
            <View style={{ flex: 1 }} >
                <Button
                    backgroundColor='#9AC4F8'
                    title="Create New Game"
                    onPress= {Actions.GameCreate}
                />
            </View>
        </View>
            </View>
        </ImageBackground>
      </KeyboardAvoidingView>

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

    formContainer: {
      alignSelf:'stretch',
      paddingLeft:20,
      paddingRight:20,  

    },
    textInput: {
      alignSelf: 'stretch',
      padding: 20,
      backgroundColor:'rgba(255,255,255,0.85)',
      marginBottom:20,
    }
    

});