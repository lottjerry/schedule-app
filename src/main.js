import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
	icons: {
		defaultSet: 'mdi',
	},
	components,
	directives,
});

createApp(App).use(store).use(router).use(vuetify).mount('#app');
