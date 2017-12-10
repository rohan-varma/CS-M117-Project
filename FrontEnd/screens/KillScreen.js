import React, { Component } from 'react';
import { 
  StyleSheet, 
   View, 

 } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';

import { Actions } from 'react-native-router-flux';


export default class KillScreen extends Component {
  goToAlliance = () => {
     Actions.replace("AllianceScreen",{username: this.props.username, gameCode: this.props.gameCode})
    //Actions.AllianceScreen({username: this.props.username, gameCode: this.props.gameCode})
  }
  goToPlayer = () => {
     Actions.replace("PlayerScreen",{username: this.props.username, gameCode: this.props.gameCode})
    //Actions.PlayerScreen({username: this.props.username, gameCode: this.props.gameCode})
  }
  render() {
    return (
     
     <Container>
      <Content>
        <View style={styles.formContainer}>
          <Text> This is kill Screen! </Text>
          <Text> Wenlong will make it pretty!! :D </Text>
        </View>
      </Content>
        <Footer>
          <FooterTab>
            <Button 
            onPress = {this.goToPlayer}
            vertical>
              <Icon 
              ios='ios-person'
              android="md-person"
              />
              <Text>Player</Text>
            </Button>
            <Button vertical>
              <Icon 
              style={{color:'rgba(154, 196, 248, 1)'}}
              ios='ios-flash'
              android="md-flash" />
              <Text style={{color:'rgba(154, 196, 248, 1)'}}>Kill</Text>
            </Button>
            <Button 
            vertical 
            onPress = {this.goToAlliance}>
              <Icon 
              ios='ios-contacts'
              android="md-contacts" />
              <Text>Alliance</Text>
            </Button>
   
          </FooterTab>

        </Footer>
        </Container>
    );

  }

}

const styles = StyleSheet.create({

     formContainer: {
      alignSelf:'stretch',
      paddingLeft:20,
      paddingRight:20,  
      paddingTop: 50

    },

});