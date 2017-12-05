import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import { StackNavigator } from 'react-navigation'; // 1.0.0-beta.14
import GameInput from './GameInput'

const HomeScreen = ({ navigation }) => (
    <View style={{flex: 1}}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Bluetooth Assassin</Text>
            <Text>Write a blurb here about how the game works</Text>
        </View>
        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flex: 1 }} >
                <Button
                    backgroundColor='#E36588'
                    onPress={() => navigation.navigate('Login')}
                    large raised
                    title="Login to Existing Game"
                />
            </View>
            <View style={{ flex: 1 }} >
                <Button
                    backgroundColor='#9AC4F8'
                    onPress={() => navigation.navigate('Details')}
                    large raised
                    title="Create New Game"
                />
            </View>
        </View>
    </View>
);

const DetailsScreen = ({navigation}) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
    </View>
);

const LoginScreen = ({navigation}) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <GameInput nav={navigation} />
    </View>
);

const RootNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'HomeScreen',
    },
  },
  Details: {
    screen: DetailsScreen,
    navigationOptions: {
      headerTitle: 'Details',
    },
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerTitle: 'LoginScreen',
    },
  },
});

export default RootNavigator;
