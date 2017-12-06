import React, { Component } from 'react';
import { StyleSheet, View, AppRegistry} from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Text,List, ListItem } from 'native-base';
export default class GamePage extends Component {
  constructor(props){
    super(props)
    this.state={

    };
  }
  render() {
    var items = ['Simon Mignolet','Nathaniel Clyne','Dejan Lovren','Mama Sakho','Emre Can']
    return (
      <Container>
        <Header style={{ flexDirection: 'column', alignItems:'center'}}> 
          <Text style= {{fontWeight: 'bold'}}> Game:{this.props.gameCode} </Text>
          <Text style= {{fontWeight: 'bold'}}> Username:{this.props.username} </Text>
        </Header>

        <Content style={{alignSelf:'stretch'}} >
          <List dataArray={items}
            renderRow={(item) =>
              <ListItem>
                <Text>{item}</Text>
              </ListItem>
            }>
          </List>
        </Content>

        <Footer>
          <FooterTab>
            <Button>
              <Text>Refresh</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
});
