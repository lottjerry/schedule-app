import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwPqUuRhggR-ktwPfjgVUC7WC185JIEnQ",
  authDomain: "schedule-app-cm.firebaseapp.com",
  projectId: "schedule-app-cm",
  storageBucket: "schedule-app-cm.appspot.com",
  messagingSenderId: "73286319823",
  appId: "1:73286319823:web:f3616d79d6401d8049c1ba",
  measurementId: "G-YT23M0PE6D"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
	components,
	directives,
});

createApp(App).use(store).use(router).use(vuetify).mount('#app');
