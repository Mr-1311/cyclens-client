
import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import CameraScreen from './src/cameraScreen.js';

const AppNavigator = createStackNavigator(
    {
        First: {
            screen: CameraScreen,
            navigationOptions: {
                header: null,
                tabBarVisible: false
            },
            header: null,
            tabBarVisible: false
        },
    },{
        defaultNavigationOptions: {
            header: null,
            tabBarVisible: false
        },
    }
);

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    }
});
