import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider, Button, TextInput } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { PostImage, RequestPing, RequestModule } from './api/request';
import ENUM_MODULE_NAMES from './api/request';
import ModuleCard from './moduleCard.js';
import SettingsScreen from './pages/setting.js';

import axios from 'axios';

const landmarkSize = 2;

const moduleStatus = {
    AVAILABLE: 0,
    WAITING: 1,
    DISABLE: 2
};

const labelStatus = {
    AVAILABLE: 0,
    LEARNING: 1,
    TRAINING: 2
};

const MODULE_TYPE = {
    age: 'age',
    emotion: 'emotion',
    face: 'face',
    gender: 'gender'
};

class CameraScreen extends React.Component {
    state = {
        autoFocus: 'on',
        depth: 0,
        type: 'back',
        whiteBalance: 'auto',
        ratio: '16:9',
        ratios: [],
        photoId: 1,
        showGallery: false,
        photos: [],
        faces: [],
        recordOptions: {
            mute: false,
            maxDuration: 5,
            quality: RNCamera.Constants.VideoQuality["288p"],
        },
        isRecording: false,
        isCyclensActive: false,
        isSettings: false,
        ipAdress: '0.0.0.0',
        emotionStatus: moduleStatus.AVAILABLE,
        emotionResult: 'empty',
        emotionConfidence: '-1',
        emotionProcessTime: '-1',
        genderStatus: moduleStatus.AVAILABLE,
        genderResult: 'empty',
        genderConfidence: '-1',
        genderProcessTime: '-1',
        ageStatus: moduleStatus.AVAILABLE,
        ageResult: 'empty',
        ageConfidence: '-1',
        ageProcessTime: '-1',
        faceStatus: moduleStatus.AVAILABLE,
        faceResult: 'empty',
        faceConfidence: '-1',
        faceProcessTime: '-1',
        labelCurrentStatus: labelStatus.AVAILABLE,
        btnLabelText: 'label',
        btnEngineText: 'WAITING',
        btnEngineDisabled: false,
        serverPing: false,
        temp: false,
        text: ''
    };

    componentDidMount() {
        setInterval(() => {
            RequestPing(this.state.ipAdress, this.changePing);
            if(!this.state.serverPing){
                this.setState({btnEngineText: 'WAITING'});
            } else {
                if(this.state.isCyclensActive){
                    this.setState({btnEngineText: 'STOP'});
                } else  {
                    this.setState({btnEngineText: 'START'});
                }
            }
        }, 3000);
    }

    componentDidUpdate() {
        this.LOOP();
        //console.log(this.state.faces);
    }

    LOOP = async () => {

        if (this.state.isCyclensActive
            && this.state.serverPing === true
            && this.state.emotionStatus === moduleStatus.AVAILABLE
            && this.state.genderStatus === moduleStatus.AVAILABLE
            && this.state.ageStatus === moduleStatus.AVAILABLE
            && this.state.faceStatus === moduleStatus.AVAILABLE)
        {
            this.setState({emotionStatus: moduleStatus.WAITING});
            this.setState({genderStatus: moduleStatus.WAITING});
            this.setState({ageStatus: moduleStatus.WAITING});
            this.setState({faceStatus: moduleStatus.WAITING});
            if (this.camera) {
                this.camera.takePictureAsync().then(frame => {
                    RequestModule(ENUM_MODULE_NAMES.age, this.state.ipAdress, frame.uri, this.changeStatus2Available, this.changeRes);
                    RequestModule(ENUM_MODULE_NAMES.emotion, this.state.ipAdress, frame.uri, this.changeStatus2Available, this.changeRes);
                    RequestModule(ENUM_MODULE_NAMES.face, this.state.ipAdress, frame.uri, this.changeStatus2Available, this.changeRes);
                    RequestModule(ENUM_MODULE_NAMES.gender, this.state.ipAdress, frame.uri, this.changeStatus2Available, this.changeRes);
                    if (this.state.labelCurrentStatus === labelStatus.LEARNING) {
                        RequestModule(ENUM_MODULE_NAMES.face_add, this.state.ipAdress, frame.uri, this.changeStatus2Available, this.changeRes);
                    };
                });
            }
        }

    }

    changeStatus2Available = ( module ) => {
        this.setState({[module]: moduleStatus.AVAILABLE});
    }

    changePing = ( result ) => {
        this.setState({serverPing: result});
    }

    changeRes = ( moduleName , res, conf, processTime ) => {
        var result = moduleName + 'Result';
        var confidence = moduleName + 'Confidence';
        var pTime = moduleName + 'ProcessTime';
        console.log(result, '   ', confidence, '    ', pTime);
        this.setState({[result]: res});
        this.setState({[confidence]: conf});
        this.setState({[pTime]: processTime});
    }

    getRatios = async function() {
        const ratios = await this.camera.getSupportedRatios();
        return ratios;
    };


    toggleFacing() {
        this.setState({
            type: this.state.type === 'back' ? 'front' : 'back',
        });
    }

    toggleFocus() {
        this.setState({
            autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
        });
    }

    setFocusDepth(depth) {
        this.setState({
            depth,
        });
    }

    onFacesDetected = ({ faces }) => this.setState({ faces });
    onFaceDetectionError = state => console.warn('Faces detection error:', state);

    renderFace = ({ bounds, faceID }) => {
        return (
            <View
              key={faceID}
              transform={[
                  { perspective: 600 },
              ]}
              style={[
                  styles.face,
                  {
                      ...bounds.size,
                      left: bounds.origin.x,
                      top: bounds.origin.y,
                  },
              ]}
            >
              <Text style={styles.faceText}>ID: {this.state.faceResult}</Text>
              {
              //  <Text style={styles.faceText}>confidence: {this.state.faceConfidence}</Text>
              //  <Text style={styles.faceText}>process ms: {this.state.faceProcessTime}</Text>
              }
            </View>
        );
    }

    renderFaces() {
        return (
            <View style={styles.facesContainer} pointerEvents="none">
              {this.state.faces.map(this.renderFace)}
            </View>
        );
    }

    renderCamera() {
        return (
            <RNCamera
              ref={ref => {
                  this.camera = ref;
              }}
              style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end'
              }}
              type={this.state.type}
              flashMode={this.state.flash}
              autoFocus={this.state.autoFocus}
              ratio={this.state.ratio}
              faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.none}
              onFacesDetected={this.onFacesDetected}
              onFaceDetectionError={this.onFaceDetectionError}
              faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
              focusDepth={this.state.depth}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={'We need your permission to use your camera phone'}
            >
              {this.renderFaces()}
              <View
                style={{
                    //flex: 0.1,
                    backgroundColor: 'transparent',
                }}
              >
              </View>
            </RNCamera>
        );
    }


    onButtonLabelPressed = () => {
        if (this.state.labelCurrentStatus === labelStatus.AVAILABLE) {
            this.setState({labelCurrentStatus: labelStatus.LEARNING});
            this.setState({btnLabelText: 'learning...'});
        }
        else if (this.state.labelCurrentStatus === labelStatus.LEARNING) {
            this.setState({labelCurrentStatus: labelStatus.AVAILABLE});
            this.setState({btnLabelText: 'label'});
        }
    };

    mainScreen = () => (
            <View style={styles.container}>

              <View style={styles.buttonContainer}>
                <Button color='#00000010' title={this.state.btnEngineText} onPress={this.onCyclensToggle}/>
                <Button color='#00000010' title='toggle' onPress={this.toggleFacing.bind(this)}/>
                <Button color='#00000010' title={this.state.btnLabelText} onPress={this.onButtonLabelPressed}/>
                <Button color='#00000010' title='settings' onPress={this.onGoBackPressed}/>
              </View>

              {this.renderCamera()}

              <View style={styles.moduleContainer}>
                <ModuleCard
                  title="Emotion"
                  result={this.state.emotionResult}
                  confidence={this.state.emotionConfidence}
                  processTime={this.state.emotionProcessTime}/>
                <ModuleCard
                  title="Gender"
                  result={this.state.genderResult}
                  confidence={this.state.genderConfidence}
                  processTime={this.state.genderProcessTime}
                />
                <ModuleCard
                  title="Age"
                  result={this.state.ageResult}
                  confidence={this.state.ageConfidence}
                  processTime={this.state.ageProcessTime}
                />
              </View>
            </View>
    );

    onGoBackPressed = () => {
        this.setState({isSettings: !this.state.isSettings});
        this.setState({isCyclensActive: false});
        this.setState({emotionStatus: moduleStatus.AVAILABLE});
        this.setState({genderStatus: moduleStatus.AVAILABLE});
        this.setState({ageStatus: moduleStatus.AVAILABLE});
        this.setState({faceStatus: moduleStatus.AVAILABLE});
    }

    onChangeIpPress = (ip) => {
        this.setState({ipAdress: ip});
    }

    onCyclensToggle = () => {
        if(!this.state.serverPing){
            return;
        }

        if(this.state.isCyclensActive){
            this.setState({isCyclensActive: false});
            this.setState({btnEngineText: 'START'});
        } else  {
            this.setState({isCyclensActive: true});
            this.setState({btnEngineText: 'STOP'});
        }
    }

    render() {
        const page = this.state.isSettings
              ? <SettingsScreen onButtonChangeIpPressed ={this.onChangeIpPress} onGoBackPressed={this.onGoBackPressed}/>//this.settingss()
              : this.mainScreen();
        return <View style={styles.container}>{page}</View>;
    };
};

const getIpAddress = () => {return this.state.ipAdress;};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#000',
    },
    buttonContainer: {
        justifyContent: 'space-between'
    },
    moduleContainer: {
    },
    cameraLayout: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    button: {
        flex: 0.3,
        padding: 20,
        backgroundColor: 'green',
    },
    flipButton: {
        flex: 0.3,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 20,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flipText: {
        color: 'white',
        fontSize: 15,
    },
    picButton: {
        backgroundColor: 'darkseagreen',
    },
    facesContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
    },
    toogleButton: {
        backgroundColor:'#00000000'
    },
    face: {
        padding: 2,
        borderWidth: 1,
        borderRadius: 1,
        position: 'absolute',
        borderColor: '#ffffff',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    faceText: {
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 5,
        backgroundColor: 'transparent',
    },
});

export default CameraScreen;
