import React, { Component } from 'react';
import axios from 'axios';

import BASE_IP from './routes.js';
import ROUTE_EMOTION from './routes.js';
import ROUTE_GENDER from './routes.js';


const RequestEmotion = (imageUri, setModuleAvailable, sendResults) => {
    url = "http://192.168.43.143:5000/api/v1/demo/emotion";

    file = {
        uri: imageUri,
        name: "image.jpg",
        type: "image/jpg"
    };

    const body = new FormData();
    body.append('file', file);

    axios.post(url, body)
        .then(function (response) {
            console.log('RESPONSE::REQUEST-EMOTION: ', response);
            if (response.data.success == true){
                sendResults(response.data.faces[0].result, response.data.faces[0].confidence);
            }
            else{
                sendResults("face lost!!", "-1");
            }
        })
        .catch(function (error) {
            console.log('ERROR::REQUEST-EMOTION: ', error);
        })
        .then(function () {
            console.log('END::REQUEST-EMOTION');
            setModuleAvailable();
        });

};

const RequestGender = (imageUri, setModuleAvailable, sendResults) => {
    url = "http://192.168.43.143:5000/api/v1/demo/gender";

    file = {
        uri: imageUri,
        name: "image.jpg",
        type: "image/jpg"
    };

    const body = new FormData();
    body.append('file', file);

    axios.post(url, body)
        .then(function (response) {
            console.log('RESPONSE::REQUEST-GENDER: ', response);
            if (response.data.success == true){
                sendResults(response.data.faces[0].result, response.data.faces[0].confidence);
            }
            else{
                sendResults("face lost!!", "-1");
            }
        })
        .catch(function (error) {
            console.log('ERROR::REQUEST-GENDER: ', error);
        })
        .then(function () {
            console.log('END::REQUEST-GENDER');
            setModuleAvailable();
        });

};

const RequestAge = (imageUri, setModuleAvailable, sendResults) => {
    url = "http://192.168.43.143:5000/api/v1/demo/age";

    file = {
        uri: imageUri,
        name: "image.jpg",
        type: "image/jpg"
    };

    const body = new FormData();
    body.append('file', file);

    axios.post(url, body)
        .then(function (response) {
            console.log('RESPONSE::REQUEST-AGE: ', response);
            if (response.data.success == true){
                sendResults(response.data.faces[0].result, response.data.faces[0].confidence);
            }
            else{
                sendResults("face lost!!", "-1");
            }
        })
        .catch(function (error) {
            console.log('ERROR::REQUEST-AGE: ', error);
        })
        .then(function () {
            console.log('END::REQUEST-AGE');
            setModuleAvailable();
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

export {RequestEmotion, RequestGender, RequestAge, PostImage}

