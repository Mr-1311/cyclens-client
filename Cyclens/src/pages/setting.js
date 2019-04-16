import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider, Button, TextInput } from 'react-native';

class SettingsScreen extends React.Component {

    state = { text: '' };

    press = () => {
        this.props.onChangeIpPress(this.state.text);
        this.setState({text: ''});
    }

    render() {
        return (
            <View style={styles.container}>
              <View>
                <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  placeholder='ip address'
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
                />
                <Button
                  title='change ip'
                  onPress={this.press}
                />
              </View>

              <Button
                title='go back'
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
