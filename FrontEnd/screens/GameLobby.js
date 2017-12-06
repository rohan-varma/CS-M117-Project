import React, { Component } from 'react';
import { StyleSheet, View, AppRegistry} from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Text } from 'native-base';
export default class gamePage extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <Container>
        <Header> 
          <Text> Username:{this.props.username} </Text>
        </Header>
        <Content />
        <Footer>
          <FooterTab>
            <Button>
              <Text>Game Status</Text>
            </Button>
            <Button>
              <Text>Active Player</Text>
            </Button>
            <Button>
              <Text>Dead Player</Text>
            </Button>
            <Button>
              <Text>Safe Zone</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
});
