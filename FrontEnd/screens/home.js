import React, { Component } from 'react';
import { 
    StyleSheet, 
    Text, View, 
    Image, Button,
    KeyboardAvoidingView
} from 'react-native';
import GameTextInput  from '../components/GameTextInput';
import GameCreate from './GameCreate'
import GameLogIn from './GameLogIn'
import { Actions } from 'react-native-router-flux';


class Home extends Component {
    static navigationOptions = { header: null };
    render() {
    return (
    <View style={styles.container}>
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Image source={require('../img/ninja.jpg')} style={styles.backgroundImage} />
        </View>
        <View style={styles.container}>
            <View style={styles.container}> 
                <Text style={styles.header}> Bluetooth </Text> 
                <Text style={styles.header}> Assassin </Text> 
            </View>
            <View style={styles.container}>
                <Button
                    onPress={Actions.GameLogIn} 
                    style={styles.button}
                    title="Join Game"
                />
            </View>
        </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
    }
});

export default Home;
