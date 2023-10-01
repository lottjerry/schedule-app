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
	apiKey: 'AIzaSyATM4C-1VKGRxKE7DuybtBocY0dNB_AmvM',
	authDomain: 'schedule-app-e5cc8.firebaseapp.com',
	projectId: 'schedule-app-e5cc8',
	storageBucket: 'schedule-app-e5cc8.appspot.com',
	messagingSenderId: '711704796011',
	appId: '1:711704796011:web:ff30897ac74d4ef3d6ca2e',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

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
