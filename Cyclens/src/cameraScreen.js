
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { PostImage, RequestEmotion, RequestGender, RequestAge } from './api/request';
import ModuleCard from './moduleCard.js';

import axios from 'axios';

const landmarkSize = 2;

const moduleStatus = {
    AVALIABLE: 0,
    WAITING: 1,
    DISABLE: 2
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
        isCyclensActive: true,
        emotionStatus: moduleStatus.AVALIABLE,
        emotionResult: 'empty',
        emotionConfidence: '-1',
        genderStatus: moduleStatus.AVALIABLE,
        genderResult: 'empty',
        genderConfidence: '-1',
        ageStatus: moduleStatus.AVALIABLE,
        ageResult: 'empty',
        ageConfidence: '-1',
        temp: false
    };

    componentDidUpdate() {
        this.cyclens();
    }

    cyclens = async () => {

        if (this.state.emotionStatus === moduleStatus.AVALIABLE
            && this.state.genderStatus === moduleStatus.AVALIABLE
            && this.state.ageStatus === moduleStatus.AVALIABLE)
        {
            this.setState({emotionStatus: moduleStatus.WAITING});
            this.setState({genderStatus: moduleStatus.WAITING});
            this.setState({ageStatus: moduleStatus.WAITING});
            if (this.camera) {
                this.camera.takePictureAsync().then(frame => {
                    RequestEmotion(frame.uri, this.changeEmotionStatus2Avaliable, this.changeEmotionRes);
                    RequestGender(frame.uri, this.changeGenderStatus2Avaliable, this.changeGenderRes);
                    RequestAge(frame.uri, this.changeAgeStatus2Avaliable, this.changeAgeRes);
                });
            }
        }


        
        if (this.state.emotionStatus === moduleStatus.AVALIABLE) {
            
            this.setState({emotionStatus: moduleStatus.WAITING});
            if (this.camera) {
                this.camera.takePictureAsync().then(frame => {
                    RequestEmotion(frame.uri, this.changeEmotionStatus2Avaliable, this.changeEmotionRes);
                });
            }
        }

        if (this.state.genderStatus === moduleStatus.AVALIABLE) {
            
            this.setState({genderStatus: moduleStatus.WAITING});
            if (this.camera) {
                this.camera.takePictureAsync().then(frame => {
                    RequestGender(frame.uri, this.changeGenderStatus2Avaliable, this.changeGenderRes);
                });
            }
        }

        if (this.state.ageStatus === moduleStatus.AVALIABLE) {
            
            this.setState({ageStatus: moduleStatus.WAITING});
            if (this.camera) {
                this.camera.takePictureAsync().then(frame => {
                    RequestAge(frame.uri, this.changeAgeStatus2Avaliable, this.changeAgeRes);
                });
            }
        }

    }

    changeEmotionStatus2Avaliable = () => {
        this.setState({emotionStatus: moduleStatus.AVALIABLE});
    }
    changeGenderStatus2Avaliable = () => {
        this.setState({genderStatus: moduleStatus.AVALIABLE});
    }
    changeAgeStatus2Avaliable = () => {
        this.setState({ageStatus: moduleStatus.AVALIABLE});
    }
    

    changeEmotionRes = (res, conf) => {
        this.setState({emotionResult: res});
        this.setState({emotionConfidence: conf});
    }
    changeGenderRes = (res, conf) => {
        this.setState({genderResult: res});
        this.setState({genderConfidence: conf});
    }
    changeAgeRes = (res, conf) => {
        this.setState({ageResult: res});
        this.setState({ageConfidence: conf});
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

    takePicture = async function() {
        if (this.camera) {
            this.camera.takePictureAsync().then(frame => {
                const URL = 'http://10.0.2.2:5000/api/v1/demo';

                console.log('-------------------------------------------------------------');
                //PostImage(frame.uri);
                RequestEmotion(frame.uri, this.changeModuleStatus2Avaliable);

            });
        }            
    }

    getImage = async () => {
        if (this.camera) {
            this.camera.takePictureAsync().then(frame => {
                return frame.uri;
            });
        }
    }
    
    

    
    onFacesDetected = ({ faces }) => this.setState({ faces });
    onFaceDetectionError = state => console.warn('Faces detection error:', state);

    renderFace({ bounds, faceID,}) {
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


    onPressLearnMore = () => {
        this.setState({temp: !this.state.temp});
        this.cyclens();
    }
    
    render() {
        return <View style={styles.container}>
                 
                 {this.renderCamera()}

                 <View style={styles.moduleContainer}>
                   <ModuleCard title="Emotion" result={this.state.emotionResult} confidence={this.state.emotionConfidence}/>
                   <ModuleCard title="Gender" result={this.state.genderResult} confidence={this.state.genderConfidence}/>
                   <ModuleCard title="Age" result={this.state.ageResult} confidence={this.state.ageConfidence}/>
                 </View>
                 
               </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#000',
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
