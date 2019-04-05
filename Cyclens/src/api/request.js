import React, { Component } from 'react';
import axios from 'axios';


export default PostImage = (imageUri, d) => {
    baseURL = 'http://localhost:5000/api/v1/demo';

    console.log('denemeejflsd');
    
    var formData = new FormData();
    formData.append("file", {
        uri: imageUri,
        type: "image/jpg"
    });

    axios.post(baseURL, d)
        .then(function (response) {
            console.log('response: ', response);
        })
        .catch(function (error) {
            console.log('hata oldu: ', error);
        })
        .then(function () {
            console.log('ksdkaflkasdjflasdjflkasdjfl sdlfsdlkfj');
        });
};
