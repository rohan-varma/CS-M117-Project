import React, { Component } from 'react';
import { StyleSheet, Text, View, Navigator, AppRegistry } from 'react-native';
import Movies from './src/Movies'



class Greeting extends Component {
  render() {
    return (
      <Text> Hello {this.props.name}! </Text>
      );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>This is the best CS M117 project ever!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <Greeting name='rohan' />
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// import React, { Component } from 'react';
// import { AppRegistry, Text, View } from 'react-native';

// class Greeting extends Component {
//   render() {
//     return (
//       <Text>Hello {this.props.name}!</Text>
//     );
//   }
// }

// export default class LotsOfGreetings extends Component {
//   render() {
//     return (
//       <View style={{alignItems: 'center'}}>
//         <Greeting name='Rexxar' />
//         <Greeting name='Jaina' />
//         <Greeting name='Valeera' />
//       </View>
//     );
//   }
// }