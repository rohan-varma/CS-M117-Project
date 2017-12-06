import React, { Component } from 'react';
import { 
  StyleSheet, 
  Text, View, 
  AppRegistry, 
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView

 } from 'react-native';
import GameTextInput  from './GameTextInput';


export default class Form extends Component {
  static navigationOptions = { header: null };
  render() {
    return (
      <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
        <ImageBackground style={styles.container} source={require('../img/ninja.jpg')}>
          <Text style={styles.header}> Bluetooth </Text> 
          <Text style={styles.header}> Assassin </Text> 
            <View style={styles.formContainer}> 
                <GameTextInput/> 
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