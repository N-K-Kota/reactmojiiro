import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDABCi1EvC8Nk7wrhpDsvwZrRCsK6Men28",
  authDomain: "mojiiro-bd57c.firebaseapp.com",
  projectId: "mojiiro-bd57c",
  storageBucket: "mojiiro-bd57c.appspot.com",
  messagingSenderId: "241761067061",
  appId: "1:241761067061:web:2dff03f4e78a0a60ec517c",
  measurementId: "G-EQ7SB38HHK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

ReactDOM.render(
    <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
