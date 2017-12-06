import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, AppRegistry, TextInput, ImageBackground }   from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, Form, Picker, Radio, Card, CardItem, Body } from 'native-base';
const Item = Picker.Item;
import GameTextInput  from '../components/GameTextInput';
import MapView from 'react-native-maps';

const { createGame, addUserToGame } = require('../requestors');
const _ = require('lodash');

class GameCreate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username:'',
            gameCode: '',
            safezoneRadius: 50,
            // default to Boelter Hall, UCLA
            mapRegion: {
                latitude: 34.0689,
                longitude: -118.443,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
            },
            gameSize: 15,
            alliancesAllowed: true,
        };
    }

    _handleMapRegionChange = mapRegion => {
        this.setState({ mapRegion });
    };

    _handleGameSizePicker(value: string) {
        this.setState({ gameSize: value });
    };

    _handleAlliancesPicker(value: string) {
        this.setState({ alliancesAllowed: value });
    };

    doCreateGame = () => {
        Actions.GameLogIn({
            gameCreated: true,
            maxPlayers: this.state.gameSize,
            gameXCoord: this.state.longitude,
            gameYCoord: this.state.latitude,
            alliancesAllowed: this.state.alliancesAllowed,
        });
    };

    render() {
        return (
            <View style={ styles.formContainer }>
              <View style={styles.formwrapper}>
                <Text style={styles.text}>Select game size</Text>
                <Form>
                    <Picker
                      iosHeader="Select one"
                      mode="dropdown"
                      selectedValue={this.state.gameSize}
                      onValueChange={this._handleGameSizePicker.bind(this)}
                    >
                        <Item label="Tiny: max 3 players" value={3} />
                        <Item label="Small: max 5 players" value={5} />
                        <Item selected label="Medium: max 15 players" value={15} />
                        <Item label="Large: max 25 players" value={25} />
                        <Item label="Giant: max 100 players" value={100} />
                    </Picker>
                </Form>
               

                <View>
                    <Text style={styles.text}>Allow Alliances</Text>
                    <Form>
                        <Picker
                          iosHeader="Select one"
                          mode="dropdown"
                          selectedValue={this.state.alliancesAllowed}
                          onValueChange={this._handleAlliancesPicker.bind(this)}
                        >
                            <Item label="Enabled" value={true} />
                            <Item selected label="Disabled" value={false} />
                        </Picker>
                    </Form>
                </View>

            </View>

                <View style={{flex:0.15}}>
                    <Text style={styles.text}>Select the shared game Safe Zone</Text>
                </View>
                <View style={{flexDirection: 'column', flex:1}}>
                <MapView
                    style={{ alignSelf: 'stretch', flex:1 }}
                    region={this.state.mapRegion}
                    onRegionChange={this._handleMapRegionChange}>

                    <MapView.Circle
                        center={{latitude: this.state.mapRegion.latitude, longitude: this.state.mapRegion.longitude}}
                        radius={this.state.safezoneRadius}
                        fillColor="rgba(255, 0, 0, 0.3)"
                        strokeColor="rgba(255, 0, 0, 0.3)" />

                </MapView>
                </View>
                <View style={{flex:0.3}}>
                <Button
                    backgroundColor='rgba(201, 29, 77, 0.6)'
                    title="Create Game"
                    fontWeight='bold'
                    borderRadius={10}
                    onPress={this.doCreateGame}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Create game and login</Text>
                </Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignSelf:'stretch',

        flexDirection: 'column',
        padding:20,
    },
    formwrapper: {
      flex: 0.5,
    },
    text: {
      color: 'black',
      fontSize: 20,
      fontWeight: 'bold',
    },
    textInput: {
      alignSelf: 'stretch',
      padding: 20,
      backgroundColor:'rgba(255,255,255,0.85)',
      marginBottom:15,
    },
    buttonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
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
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
    }
});

export default GameCreate;
