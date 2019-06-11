import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ModuleCard = (props) => {
    return (
        <View style={ styles.container }>
          <Text style={ styles.title }>{props.title}</Text>
          <Text style={ styles.text }>{props.result}</Text>
          <Text style={ styles.text }>{props.confidence} %</Text>
          <Text style={ styles.text }>{props.processTime} MS</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000aa',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch',
        //width: '80%',
        margin: 5,
        padding: 5
    },
    title: {
        color: '#09a55f',
        fontWeight: 'bold',
        alignItems: 'center',
        fontSize: 20
    },
    text: {
        color: '#fff',
        fontWeight: 'normal',
        alignItems: 'center',
        fontSize: 14
    }
});

export default ModuleCard;
