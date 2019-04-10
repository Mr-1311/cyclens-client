import React, { Component } from 'react';
import axios from 'axios';


export default PostImage = (imageUri) => {
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
