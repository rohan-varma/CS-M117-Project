import React, { Component } from 'react';
import { 
  StyleSheet, 
  Text, View, 
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView

 } from 'react-native';
import { Button } from 'react-native-elements';
import Home from './home';
import { Actions } from 'react-native-router-flux';


export default class GameOverScreen extends Component {
  static navigationOptions = { header: null };
  render() {
    return (
      <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
        <ImageBackground style={styles.container} resizeMode='contain' source={require('../img/assassin.jpeg')}>
          <View style={styles.filler}/>
          <View style={styles.headercontainer}>
            <Text style={styles.header}> Bluetooth </Text> 
            <Text style={styles.header}> Assassin </Text> 
            <Text style={styles.header}> Game Over</Text> 
          </View>
          <View style={{flex:0.5}}/>
          <View style={styles.formContainer}> 
              <View style={{ flex: 1 }} >
                <Button
                    backgroundColor='rgba(201, 29, 77, 0.6)'
                    title="Back to Home"
                    onPress= {Actions.Home}
                    fontWeight='bold'
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
      flexWrap: 'wrap',
      flex: 1,
      alignSelf: 'stretch',
      width: undefined,
      height: undefined,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    header: {
      fontSize: 45,
      color: 'rgba(201, 29, 77, 1)',
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
      bottom: 20,
      height: 85,
      width: 375,
      position: 'absolute',
      borderRadius: 10,
       flex:1

    },
    filler: {
      flex: 1,
    },

    

});