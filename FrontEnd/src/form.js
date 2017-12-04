import React, { Component } from 'react';
import { 
  StyleSheet, 
  Text, View, 
  AppRegistry, 
  TextInput,
  TouchableOpacity

 } from 'react-native';
import GameTextInput  from '../GameTextInput';


export default class App extends Component {
  render() {
    return (
      <View style={styles.formContainer}> 
        <GameTextInput/> 
        <TouchableOpacity style= {styles.button}>
          <Text style={styles.buttonText}> Enter </Text>
        </TouchableOpacity>
      </View>


    );
  }
}

const styles = StyleSheet.create({
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
    },
    button: {
      alignSelf: 'center',
      paddingRight:30,
      paddingLeft:30,
      marginTop:20,
      padding:20,
      backgroundColor: 'rgba(159, 20, 169, 0.6)',
      borderRadius: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    }

});