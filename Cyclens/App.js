
import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';

import CameraScreen from './src/cameraScreen.js';

export default class App extends Component<Props> {
    
  render() {
    return (
        <View style={styles.container}>
          <CameraScreen/>
        </View>
    );
  }

    
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    }
});
