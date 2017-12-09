import React, { Component } from 'react';
import { 
  StyleSheet, 
   View, 

 } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';

import { Actions } from 'react-native-router-flux';


export default class KillScreen extends Component {
  goToAlliance = () => {
    Actions.AllianceScreen({username: this.props.username, gameCode: this.props.gameCode})
  }
  goToPlayer = () => {
    Actions.PlayerScreen({username: this.props.username, gameCode: this.props.gameCode})
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
            onPress = {this.goToAlliance}
            vertical>
              <Icon 
              name ='ios-person'
              ios='ios-person'
              />
              <Text>Player</Text>
            </Button>
            <Button vertical>
              <Icon 
              style={{color:'rgba(154, 196, 248, 1)'}}
              name="md-flash" />
              <Text style={{color:'rgba(154, 196, 248, 1)'}}>Kill</Text>
            </Button>
            <Button 
            vertical 
            onPress = {this.goToAlliance}>
              <Icon name="ios-contacts" />
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