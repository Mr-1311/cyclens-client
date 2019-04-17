import React, { Component } from 'react';
import axios from 'axios';

import BASE_IP from './routes.js';
import ROUTE_EMOTION from './routes.js';
import ROUTE_GENDER from './routes.js';


const ip = '192.168.1.43';

const ENUM_MODULE_NAMES = {
    emotion: 'emotion',
    gender: 'gender',
    age: 'age',
    face: 'face'
};

const ENUM_MODULE_STATUS = {
    emotion: 'emotionStatus',
    gender: 'genderStatus',
    age: 'ageStatus',
    face: 'faceStatus'
};

let makeFormData = (imageUri) => {
    file = {
        uri: imageUri,
        name: "image.jpg",
        type: "image/jpg"
    };

    const body = new FormData();
    body.append('file', file);

    return body;
};

const RequestEmotion = (imageUri, setModuleAvailable, sendResults, ip) => {
    url = "http://"+ ip +":5000/api/v1/demo/emotion";

    formData = makeFormData(imageUri);

    axios.post(url, formData)
        .then(function (response) {
            console.log('RESPONSE::REQUEST-EMOTION: ', response);
            if (response.data.success == true){
                sendResults(ENUM_MODULE_NAMES.emotion, response.data.faces[0].result, response.data.faces[0].confidence, response.data.process.total);
            }
            else{
                sendResults(ENUM_MODULE_NAMES.emotion, "face lost!!", "-1", '-1');
            }
        })
        .catch(function (error) {
            console.log('ERROR::REQUEST-EMOTION: ', error);
        })
        .then(function () {
            console.log('END::REQUEST-EMOTION');
            setModuleAvailable(ENUM_MODULE_STATUS.emotion);
        });

};

const RequestGender = (imageUri, setModuleAvailable, sendResults, ip) => {
    url = "http://"+ ip +":5000/api/v1/demo/gender";

    formData = makeFormData(imageUri);
    
    axios.post(url, formData)
        .then(function (response) {
            console.log('RESPONSE::REQUEST-GENDER: ', response);
            if (response.data.success == true){
                sendResults(ENUM_MODULE_NAMES.gender, response.data.faces[0].result, response.data.faces[0].confidence, response.data.process.total);
            }
            else{
                sendResults(ENUM_MODULE_NAMES.gender, "face lost!!", "-1", '-1');
            }
        })
        .catch(function (error) {
            console.log('ERROR::REQUEST-GENDER: ', error);
        })
        .then(function () {
            console.log('END::REQUEST-GENDER');
            setModuleAvailable(ENUM_MODULE_STATUS.gender);
        });

};

const RequestAge = (imageUri, setModuleAvailable, sendResults, ip) => {
    url = "http://"+ ip +":5000/api/v1/demo/age";

    formData = makeFormData(imageUri);
    
    axios.post(url, formData)
        .then(function (response) {
            console.log('RESPONSE::REQUEST-AGE: ', response);
            if (response.data.success == true){
                sendResults(ENUM_MODULE_NAMES.age, response.data.faces[0].result, response.data.faces[0].confidence, response.data.process.total);
            }
            else{
                sendResults(ENUM_MODULE_NAMES.age, "face lost!!", "-1", '-1');
            }
        })
        .catch(function (error) {
            console.log('ERROR::REQUEST-AGE: ', error);
        })
        .then(function () {
            console.log('END::REQUEST-AGE');
            setModuleAvailable(ENUM_MODULE_STATUS.age);
        });

};



const RequestFaceAdd = (imageUri, setModuleAvailable, sendResults, ip) => {
    url = "http://"+ ip +":5000/api/v1/demo/face_add";

    file = {
        uri: imageUri,
        name: "image.jpg",
        type: "image/jpg"
    };

    const body = new FormData();
    body.append('file', file);

    axios.post(url, body)
        .then(function (response) {
            console.log('RESPONSE::REQUEST-ADD_FACE: ', response);
            if (response.data.success == true){
                //sendResults(response.data.faces[0].result, response.data.faces[0].confidence, response.data.process.total);
            }
            else{
//                sendResults("face lost!!", "-1");
            }
        })
        .catch(function (error) {
            console.log('ERROR::REQUEST-ADD_FACE: ', error);
        })
        .then(function () {
            console.log('END::REQUEST-ADD_FACE');
  //          setModuleAvailable();
        });

};

const RequestFace = (imageUri, setModuleAvailable, sendResults, ip) => {
    url = "http://"+ ip +":5000/api/v1/demo/face";

    file = {
        uri: imageUri,
        name: "image.jpg",
        type: "image/jpg"
    };

    const body = new FormData();
    body.append('file', file);

    axios.post(url, body)
        .then(function (response) {
            console.log('RESPONSE::REQUEST-FACE: ', response);
            if (response.data.success == true){
                sendResults(ENUM_MODULE_NAMES.face, response.data.faces[0].result, response.data.faces[0].confidence, response.data.process.total);
            }
            else{
                sendResults(ENUM_MODULE_NAMES.face, "face lost!!", "-1", '-1');
            }
        })
        .catch(function (error) {
            console.log('ERROR::REQUEST-FACE: ', error);
        })
        .then(function () {
            console.log('END::REQUEST-FACE');
            setModuleAvailable(ENUM_MODULE_STATUS.face);
        });

};


const PostImage = (imageUri) => {
    baseURL = 'http://10.0.2.2:5000/api/v1/demo';
//    baseURL = 'http://192.168.43.143:5000/api/v1/demo';

    file = {
        uri: imageUri,
        name: "image.jpg",
        type: "image/jpg"
    };

    const body = new FormData();
    body.append('file', file);

    axios.post(baseURL, body)
        .then(function (response) {
            console.log('basarili: ', response);
        })
        .catch(function (error) {
            console.log('hata oldu: ', error);
        })
        .then(function () {
            console.log('<-------------------------->');
        });

    
    /*

      fetch(baseURL, {
      method: 'POST',
      body
      }).then(function(res){ console.log(res); });
    */

};

export { RequestEmotion, RequestGender, RequestAge, RequestFace, RequestFaceAdd, PostImage }

