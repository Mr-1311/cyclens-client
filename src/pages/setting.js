const isIp = require('is-ip');

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider, Button, TextInput, ScrollView } from 'react-native';

class SettingsScreen extends React.Component {

    state = {
        ip: this.props.getIpAddress,
        btnChangeIpDisabled: true,
        isActionRecognitionOn: false,
        isAgeRecognitionOn: false,
        isEmotionRecognitionOn: false,
        isFaceRecognitionOn: false,
        isGenderRecognitionOn: false,
    };

    onButtonChangeIpPressed = () => {
        this.props.onButtonChangeIpPressed(this.state.ip);
        this.whenGoBack();
    }

    onTextChanged = (text) => {
        if (isIp(text)) {
            this.setState({btnChangeIpDisabled: false});
        }
        this.setState({ip: text});
    }

    whenGoBack = () => {
        urlParams = '?ar=' + String(this.state.isActionRecognitionOn) + '&ap=' + String(this.state.isAgeRecognitionOn) + '&er=' + String(this.state.isEmotionRecognitionOn) + '&fr=' + String(this.state.isFaceRecognitionOn) + '&gp=' + String(this.state.isGenderRecognitionOn);

        this.props.setUrlParams(urlParams);
        this.props.onGoBackPressed();
        
    }

    render() {
        return (
            <View style={styles.container}>
              <View>
                <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  placeholder='IP Address'
                  onChangeText={(text) => this.onTextChanged(text)}
                  value={this.state.ip}
                />
                <Button
                  title='CHANGE'
                  disabled={this.state.btnChangeIpDisabled}
                  onPress={this.onButtonChangeIpPressed}
                />
              </View>
              
              <ScrollView>

                <TouchableOpacity
                  onPress={()=>{this.setState({isActionRecognitionOn: !this.state.isActionRecognitionOn});}}
                  style={[
                      styles.moduleButton,
                      {
                          ...this.state.isActionRecognitionOn ? {backgroundColor: '#53ef6b'} : {backgroundColor: '#ef5363'},
                      },
                  ]}
                >
                  <Text style={styles.moduleText}>Action Recognition</Text>
                  <Text style={styles.moduleText}>{String(this.state.isActionRecognitionOn)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={()=>{this.setState({isAgeRecognitionOn: !this.state.isAgeRecognitionOn});}}
                  style={[
                      styles.moduleButton,
                      {
                          ...this.state.isAgeRecognitionOn ? {backgroundColor: '#53ef6b'} : {backgroundColor: '#ef5363'},
                      },
                  ]}
                >
                  <Text style={styles.moduleText}>Age Prediction</Text>
                  <Text style={styles.moduleText}>{String(this.state.isAgeRecognitionOn)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={()=>{this.setState({isEmotionRecognitionOn: !this.state.isEmotionRecognitionOn});}}
                  style={[
                      styles.moduleButton,
                      {
                          ...this.state.isEmotionRecognitionOn ? {backgroundColor: '#53ef6b'} : {backgroundColor: '#ef5363'},
                      },
                  ]}
                >
                  <Text style={styles.moduleText}>Emotion Recognition</Text>
                  <Text style={styles.moduleText}>{String(this.state.isEmotionRecognitionOn)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={()=>{this.setState({isFaceRecognitionOn: !this.state.isFaceRecognitionOn});}}
                  style={[
                      styles.moduleButton,
                      {
                          ...this.state.isFaceRecognitionOn ? {backgroundColor: '#53ef6b'} : {backgroundColor: '#ef5363'},
                      },
                  ]}
                >
                  <Text style={styles.moduleText}>Face Recognition</Text>
                  <Text style={styles.moduleText}>{String(this.state.isFaceRecognitionOn)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={()=>{this.setState({isGenderRecognitionOn: !this.state.isGenderRecognitionOn});}}
                  style={[
                      styles.moduleButton,
                      {
                          ...this.state.isGenderRecognitionOn ? {backgroundColor: '#53ef6b'} : {backgroundColor: '#ef5363'},
                      },
                  ]}
                >
                  <Text style={styles.moduleText}>Gender Prediction</Text>
                  <Text style={styles.moduleText}>{String(this.state.isGenderRecognitionOn)}</Text>
                </TouchableOpacity>
                
              </ScrollView>

              <Button
                title='BACK'
                onPress={this.whenGoBack}
              />
            </View>
        );
    }
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    moduleButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomColor: '#fff',
        borderTopColor: '#fff',
        borderWidth: 1
    },
    moduleText: {
        fontSize: 19,
        fontWeight: 'bold'
    }
});

export default SettingsScreen;
