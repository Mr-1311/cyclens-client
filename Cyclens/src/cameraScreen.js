import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider } from 'react-native';
import { RNCamera } from 'react-native-camera';
import PostImage from './api/request';
import axios from 'axios';

const landmarkSize = 2;

export default class CameraScreen extends React.Component {
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
        isRecording: false
    };

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
                const URL = "https://localhost:5000";

                console.log('-------------------------------------------------------------');

/*
                const data = new FormData();
                //data.append('id', 'id apa saja'); // you can append anyone.
                data.append('fileToUpload', {
                    uri: res,
                    type: 'image/jpeg',
                    name: 'file',
                });

                fetch(URL, {
                    method: 'post',
                    body: data
                })
                    .then((response) => response.json())
                    .then((responseJson) =>
                          {
                              console.log(responseJson);
                              this.setState  ({
                                  loading : false
                              });
                          });
*/                

                console.log('gercek yol: ', frame.uri);
                frameUri = frame.uri;
                var res = frameUri.replace("file://", "file=@");
                console.log('gidecek yol: ', res);
                
                const data = new FormData();
                data.append('name', 'file'); // you can append anyone.
                data.append('file', {
                    uri: frameUri,
                    type: 'image/jpeg', // or photo.type
                    name: 'testPhotoName'
                });
                fetch(URL, {
                    method: 'post',
                    body: data
                }).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log('hata olustu: ',err);
                });


                
                console.log('-------------------------------------------------------------');

                //PostImage(res, data);
  
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
              <Text style={styles.faceText}>ID: {faceID}</Text>
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
              faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
              onFacesDetected={this.onFacesDetected}
              onFaceDetectionError={this.onFaceDetectionError}
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
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.takePicture.bind(this)}
                >
                  <Text style={styles.flipText}> SNAP </Text>
                </TouchableOpacity>
              </View>
            </RNCamera>
        );
    }

    render() {
        return <View style={styles.container}>{this.renderCamera()}</View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
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
