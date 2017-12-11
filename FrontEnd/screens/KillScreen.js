import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Navigator, AppRegistry, TextInput, ImageBackground }   from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, Footer, FooterTab, Button, Form, Picker, Radio, Card, CardItem, Body, Icon } from 'native-base';
const Item = Picker.Item;
import GameTextInput  from '../components/GameTextInput';
import MapView from 'react-native-maps';
import { Constants, Location, Permissions } from 'expo';
const { createGame, addUserToGame, updateLocation, safezoneInfo, getTargetLocation, killTarget } = require('../requestors');
const _ = require('lodash');

class KillScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            gameCode: '',
            mapRegion: {
                latitude: 34.0689,
                longitude: -118.443,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
            },
            targets: [
                {
		    key: 0,
                    username: 'asdfas1',
                    latitude: 34.0689,
                    longitude: -118.443,
                },
                {
		    key: 1,
                    username: 'asdfas2',
                    latitude: 34.068,
                    longitude: -118.443,
                },
            ],
            globalSafezone: {
                latitude: 34.0689,
                longitude: -118.443,
                radius: 50,
            },
            playerSafezone: {
                latitude: 34.0689,
                longitude: -118.442,
                radius: 50,
            },
            uc_safezone: '',
            uc_backend: '',
            uc_location: '',
            errorMessage: '',
        };
    }

    componentWillMount() {
        this.setState({ username: this.props.username });
        this.setState({ gameCode: this.props.gameCode });
        this.setState({ uc_location: 0 });
        this.setState({ uc_safezone: 0 });
        this.setState({ uc_backend: 0 });
        this.startPositionListener();
        this.startBackendCaller();
    };

    _updateSafezone = () => {
        const safezoneRequest = JSON.stringify({
            username: this.props.username,
            loginCode: this.props.gameCode,
        });
        safezoneInfo(safezoneRequest).then((res) => {
            // silently succeed kek
            this.setState({ globalSafezone: {
                latitude: res.gsz_loc[1],
                longitude: res.gsz_loc[0],
                radius: res.gsz_radius,
            }});
            this.setState( { playerSafezone: {
                latitude: res.psz_loc[1],
                longitude: res.psz_loc[0],
                radius: res.psz_radius,
            }});
        }).catch((err) => {
            alert("please pass in username and gameCode as props");
        });
        this.setState({ uc_safezone: this.state.uc_safezone + 1 });
    }
    
    _updateBackend = () => {
        var failed = false;

        const locationRequest = JSON.stringify({
            username: this.state.username,
            x: this.state.mapRegion.longitude,
            y: this.state.mapRegion.latitude,
            loginCode: this.props.gameCode,
        });

        // update backend with your location
        updateLocation(locationRequest).then((res) => {
            // success
        }).catch((err) => {
            // failed to update location
            // silently fail, because this will be called again on a timer
            failed = true;
        });

        // update your targets location
        console.log('doing the backend call');
        getTargetLocation(locationRequest).then((res) => {
            var cur_targets = [];
            console.log(res);
            for (var i = 0; i < res.targets.length; i++) {
                cur_targets.push({
                    key: i,
                    username: res.targets[i][0],
                    latitude: res.targets[i][1][1],
                    longitude: res.targets[i][1][0],
                });
            }
            this.setState({ targets: cur_targets });
        }).catch((err) => {
            // silently fail, because this will be called again on a timer too
            console.log('failed');
            failed = true;
        });

        this.setState({ uc_backend: this.state.uc_backend + 1 });

        if (failed) {
            this._updateBackend();
        };
    };

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this._handleLocationUpdate(location);
        this.setState({ uc_location: this.state.uc_location + 1 });
    };

    _handleLocationUpdate = (loc) => {
        this.setState({ mapRegion: 
			{ latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.002, longitudeDelta: 0.002 }});
    };

    startPositionListener = () => { Location.watchPositionAsync({
            enableHighAccuracy: true, 
            timeInterval: 500, 
            distanceInterval: 1
        }, this._getLocationAsync);
    };

    startBackendCaller = () => {
        this._updateSafezone();
        setInterval(this._updateBackend, 5000); // 30 seconds // TODO:
        // (safezone will not be updated as quickly as backend)
        setInterval(this._updateSafezone, 60000); // 60 seconds 
    };

    // this let you move around the map
    // disabled by default
    _handleMapRegionChange = mapRegion => {
    };

    goToAlliance = () => {
        Actions.replace("AllianceScreen",{username: this.props.username, gameCode: this.props.gameCode})
        //Actions.AllianceScreen({username: this.props.username, gameCode: this.props.gameCode})
    }
    goToPlayer = () => {
        Actions.replace("PlayerScreen",{username: this.props.username, gameCode: this.props.gameCode})
        //Actions.PlayerScreen({username: this.props.username, gameCode: this.props.gameCode})
    }

    tryKill = (started) => {
        // here I write some dummy code to emulate bluetooth check
        var inBTRange = true;
        // bluetooth in range
        // here do a timer, and kill after 10 secs
        if (inBTRange && !started) {
            alert("Starting timer for 10 seconds ... stay in Bluetooth range!");
            setTimeout(() => { this.tryKill(true); }, 10000);
        }
        // bluetooth has been in range for 10 seconds
        else if (inBTRange && started) {
            // here do the kill
            alert("Trying to kill ...");
            alert(this.state.username);
            const killRequest = JSON.stringify({
                username: this.state.username,
		loginCode: this.state.gameCode
            });

            killTarget(killRequest).then(res => {
                alert("Target was killed.");
                this._updateBackend();
            }).catch(err => {
                alert(err.error);
                alert("Failed to kill target.");
            });
        }
        // bluetooth not in range
        else {
            alert("Not in Bluetooth range of any targets.");
        }
    }


    render() {
        return (
            <Container>
            <Content>

            <View style={ styles.formContainer }>
                <Text style={styles.text}>MiniMap</Text>
                <Text>Individual Safezone in Green, and Global Safezone in Blue</Text>
                <Text>Targets locations in Blue, your location in Red</Text>
                <MapView
                    style={{ alignSelf: 'stretch', height: 250 }}
                    region={this.state.mapRegion}
                    onRegionChange={this._handleMapRegionChange}>

                    <MapView.Marker 
                        coordinate={{
                            latitude: this.state.mapRegion.latitude,
                            longitude: this.state.mapRegion.longitude}}/>

                    {this.state.targets.map(target => (
                        <MapView.Marker
			    key={target.key}
                            coordinate={{
                                longitude: target.longitude,
                                latitude: target.latitude,
                            }}
                            pinColor="rgba(0, 0, 255, 0.3)"/>
                        ))}

                    <MapView.Circle
                        center={{
                            latitude: this.state.playerSafezone.latitude, 
                            longitude: this.state.playerSafezone.longitude}}
                        radius={this.state.playerSafezone.radius}
                        fillColor="rgba(0, 255, 0, 0.3)"
                        strokeColor="rgba(0, 255, 0, 0.3)" />

                    <MapView.Circle
                        center={{
                            latitude: this.state.globalSafezone.latitude,
                            longitude: this.state.globalSafezone.longitude}}
                        radius={this.state.globalSafezone.radius}
                        fillColor="rgba(0, 0, 255, 0.3)"
                        strokeColor="rgba(0, 0, 255, 0.3)" />
                </MapView>

                <Button style={styles.button} onPress = {() => {this.tryKill(false);}}>
                    <Text style={styles.buttonText}>Attempt a Kill</Text>
                </Button>
            </View>

            </Content>
            <Footer>
                <FooterTab>
                <Button onPress = {this.goToPlayer} vertical>
                    <Icon 
                        ios ='ios-person'
                        android='md-person'
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
        flex: 1,
        alignSelf:'stretch',
        paddingLeft:20,
        paddingRight:20,
        paddingTop: 50,
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

export default KillScreen;
