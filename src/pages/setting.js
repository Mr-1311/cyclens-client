const isIp = require('is-ip');

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider, Button, TextInput } from 'react-native';

class SettingsScreen extends React.Component {

    state = {
        ip: this.props.getIpAddress,
        btnChangeIpDisabled: true,
    };

    onButtonChangeIpPressed = () =>{
        this.props.onButtonChangeIpPressed(this.state.ip);
        this.props.onGoBackPressed();
    }

    onTextChanged = (text) => {
        if (isIp(text)) {
            this.setState({btnChangeIpDisabled: false});
        }
        this.setState({ip: text});
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

              <Button
                title='BACK'
                onPress={this.props.onGoBackPressed}
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
});

export default SettingsScreen;
