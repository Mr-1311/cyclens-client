import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider, Button, TextInput, Modal, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { PostImage, RequestPing, RequestModule, RequestFaceAdd, RequestAll } from './api/request';
import ENUM_MODULE_NAMES from './api/request';
import ModuleCard from './moduleCard.js';
import SettingsScreen from './pages/setting.js';
import FullScreen from 'react-native-full-screen';

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
    all: 'all',
    face_add: 'face_add',
    age: 'age',
    emotion: 'emotion',
    face: 'face',
    gender: 'gender'
};

const initialState = {
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
        urlParams: '',
        allStatus: moduleStatus.AVAILABLE,
        allResult: '-',
        allConfidence: '0',
        allProcessTime: '0',
        faceAddStatus: moduleStatus.AVAILABLE,
        faceAddResult: '-',
        faceAddConfidence: '0',
        faceAddProcessTime: '0',
        emotionStatus: moduleStatus.AVAILABLE,
        emotionResult: '-',
        emotionConfidence: '0',
        emotionProcessTime: '0',
        genderStatus: moduleStatus.AVAILABLE,
        genderResult: '-',
        genderConfidence: '0',
        genderProcessTime: '0',
        ageStatus: moduleStatus.AVAILABLE,
        ageResult: '-',
        ageConfidence: '0',
        ageProcessTime: '0',
        faceStatus: moduleStatus.AVAILABLE,
        faceResult: '',
        faceConfidence: '0',
        faceProcessTime: '0',
        labelCurrentStatus: labelStatus.AVAILABLE,
        btnLabelText: 'WAITING',
        btnLabelCount: '',
        btnEngineText: 'WAITING',
        btnEngineDisabled: false,
        btnLabelDisabled: false,
        serverPing: false,
        modalVisible: false,
        name: '',
        faceAddId: '',
        isFaceAddReachedLimit: false,
        faceAddImgUri: '',
        text: '',
        totalMS: 0.0
};

class CameraScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props)
        this.state = initialState;
    }

    componentDidMount() {
        setInterval(() => {
            RequestPing(this.state.ipAdress, this.changePing);
            if(!this.state.serverPing){
                this.setState({btnEngineText: 'WAITING'});
                this.setState({btnLabelText: 'WAITING'});
            } else {
                if(this.state.isCyclensActive){
                    this.setState({btnEngineText: 'STOP'});
                } else  {
                    this.setState({btnEngineText: 'START'});
                    this.setState({btnLabelText: 'LABEL'});
                }
            }
        }, 3000);
    }

    componentDidUpdate() {
        this.LOOP();
        //console.log(this.state.faces);
    }

    LOOP = async () => {
        if (this.state.labelCurrentStatus === labelStatus.LEARNING && this.state.faceAddStatus === moduleStatus.AVAILABLE) {
            this.setState({faceAddStatus: moduleStatus.WAITING});
            if (this.state.isFaceAddReachedLimit) {
                this.setState({modalVisible: true});
                this.setState({labelCurrentStatus: labelStatus.TRAINING});
                this.setState({btnLabelText: 'TRAIN'});
            }
            else if (this.camera) {
                this.setState({btnLabelCount: this.state.btnLabelCount === '' ? 1 : this.state.btnLabelCount + 1});
                this.camera.takePictureAsync().then(frame => {
                    this.setState({isFaceAddReachedLimit: true});
                    this.setState({faceAddImgUri: frame.uri});
                    this.setState({modalVisible: true});
                    //RequestFaceAdd(ENUM_MODULE_NAMES.face_add, this.state.ipAdress, frame.uri, this.changeStatus2Available, this.faceAddChange, this.state.faceAddId, this.state.name);
                });
            };
        }
        else if (this.state.isCyclensActive && this.state.allStatus === moduleStatus.AVAILABLE) {
            this.setState({allStatus: moduleStatus.WAITING});

            let now = new Date();
            let end;

            if (this.camera) {
                this.camera.takePictureAsync().then(frame => {
                    RequestAll(ENUM_MODULE_NAMES.all, this.state.ipAdress, frame.uri, this.changeStatus2Available, this.changeRes, this.state.urlParams, now, this.changeTotalMS);
                });
            }
        }
    }

    faceAddChange = (name, value) => {
        this.setState({[name]: value});
    }

    changeStatus2Available = ( module ) => {
        this.setState({[module]: moduleStatus.AVAILABLE});
    }

    changePing = ( result ) => {
        this.setState({serverPing: result});
    }

    changeTotalMS = ( ms ) => {
        this.setState({totalMS: ms});
    }

    changeRes = ( moduleName , res, conf, processTime ) => {
        if (this.state.allStatus === moduleStatus.WAITING) {
            var result = moduleName + 'Result';
            var confidence = moduleName + 'Confidence';
            var pTime = moduleName + 'ProcessTime';
            console.log(result, '   ', confidence, '    ', pTime);
            this.setState({[result]: res});
            this.setState({[confidence]: conf});
            this.setState({[pTime]: processTime});
        }
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
        bounds.size.width = bounds.size.width + 100;
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
                      left: bounds.origin.x - 50,
                      top: bounds.origin.y,
                  },
              ]}
            >
              <Text style={styles.faceText}>{this.state.faceResult}</Text>
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
        if(!this.state.serverPing){
            return;
        }

        this.reset(false);

        if (this.state.labelCurrentStatus === labelStatus.AVAILABLE) {
            this.setState({labelCurrentStatus: labelStatus.LEARNING});
            this.setState({btnLabelText: 'LEARNING'});
        }
        else if (this.state.labelCurrentStatus === labelStatus.LEARNING) {
            this.setState({labelCurrentStatus: labelStatus.TRAINING});
            this.setState({btnLabelText: 'TRAIN'});
            //this.setState({modalVisible: true});
        }
    };

    onModalButtonPressed = () => {
        if(this.state.name === '') {
            return
        }

        if (this.camera) {
            this.camera.takePictureAsync().then(frame => {
                RequestFaceAdd(ENUM_MODULE_NAMES.face_add, this.state.ipAdress, this.state.faceAddImgUri, this.changeStatus2Available, this.faceAddChange, this.state.faceAddId, this.state.name);
            });
        };

        this.setState({labelCurrentStatus: labelStatus.AVAILABLE});
        this.setState({btnLabelText: 'LABEL'});
        this.setState({btnLabelCount: ''});
        this.setState({name: ''});
        this.setState({modalVisible: false});
    }

    send = () => {
        this.reset(false);

        let now = new Date();
        let end;
        if (this.camera) {
            this.camera.takePictureAsync().then(frame => {
                RequestAll(ENUM_MODULE_NAMES.all, this.state.ipAdress, frame.uri, this.changeStatus2Available, this.changeRes, this.state.urlParams, now, this.changeTotalMS);
            });
        }
    };

    reset = (hard) => {
        if(hard) {
            this.setState(initialState);
        } else {
            this.setState({allStatus: moduleStatus.AVAILABLE});
            this.setState({allResult: '-'});
            this.setState({allConfidence: '0',});
            this.setState({allProcessTime: '0'});
            this.setState({faceAddStatus: moduleStatus.AVAILABLE});
            this.setState({faceAddResult: '-'});
            this.setState({faceAddConfidence: '0'});
            this.setState({faceAddProcessTime: '0'});
            this.setState({emotionStatus: moduleStatus.AVAILABLE});
            this.setState({emotionResult: '-'});
            this.setState({emotionConfidence: '0'});
            this.setState({emotionProcessTime: '0',});
            this.setState({genderStatus: moduleStatus.AVAILABLE});
            this.setState({genderResult: '-'});
            this.setState({genderConfidence: '0'});
            this.setState({genderProcessTime: '0'});
            this.setState({ageStatus: moduleStatus.AVAILABLE});
            this.setState({ageResult: '-'});
            this.setState({ageConfidence: '0'});
            this.setState({ageProcessTime: '0'});
            this.setState({faceStatus: moduleStatus.AVAILABLE});
            this.setState({faceResult: ''});
            this.setState({faceConfidence: '0'});
            this.setState({faceProcessTime: '0'});
            this.setState({labelCurrentStatus: labelStatus.AVAILABLE});
            this.setState({btnLabelText: 'WAITING'});
            this.setState({btnLabelCount: ''});
            this.setState({btnEngineText: 'WAITING'});
            this.setState({btnEngineDisabled: false});
            this.setState({btnLabelDisabled: false});
            this.setState({totalMS: 0});
        }
    };

    mainScreen = () => (
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Button color='#00000010' title={this.state.btnEngineText} onPress={this.onCyclensToggle}/>
            <Button color='#00000010' title='TOGGLE' onPress={this.toggleFacing.bind(this)}/>
            <Button color='#00000010' title='SETTING' onPress={this.onGoBackPressed}/>
            <Button color='#00000010' title={(this.state.totalMS).toString()} onPress={this.send}/>
          </View>
          {this.renderCamera()}

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
            }}>
            <View style={styles.modal}>
              <Text>SET!</Text>
              <TextInput
                style={{height: 40, width: 300, borderColor: 'black', borderWidth: 1, marginVertical: 30}}
                placeholder='Name'
                onChangeText={(text) => this.setState({name: text})}
                value={this.state.name}
              />
              <Button color='#2983ad' title='SET!' onPress={this.onModalButtonPressed}/>
            </View>
          </Modal>

          <View style={styles.moduleContainer}>
            <ModuleCard
              title="EMOTION"
              result={this.state.emotionResult}
              confidence={this.state.emotionConfidence}
              processTime={this.state.emotionProcessTime}/>
            <ModuleCard
              title="GENDER"
              result={this.state.genderResult}
              confidence={this.state.genderConfidence}
              processTime={this.state.genderProcessTime}
            />
            <ModuleCard
              title="AGE"
              result={this.state.ageResult}
              confidence={this.state.ageConfidence}
              processTime={this.state.ageProcessTime}
            />
            <Button color='#00000010' title={this.state.btnLabelText} onPress={this.onButtonLabelPressed}/>
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
        this.setState({allStatus: moduleStatus.AVAILABLE});
    }

    onChangeIpPress = (ip) => {
        this.setState({ipAdress: ip});
    }

    setUrlParams = (params) => {
        this.setState({urlParams: params});
    }

    onCyclensToggle = () => {
        if(!this.state.serverPing){
            return;
        }

        this.reset(false);

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
              ? <SettingsScreen onButtonChangeIpPressed ={this.onChangeIpPress} onGoBackPressed={this.onGoBackPressed} setUrlParams={this.setUrlParams}/>//this.settingss()
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
        borderColor: '#ffffff00',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    faceText: {
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 5,
        paddingHorizontal: 15,
        paddingVertical: 3,
        //backgroundColor: '#3a0f8477',
        backgroundColor: 'transparent',
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 100,
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#3ba0ceaa'
    }
});

export default CameraScreen;
