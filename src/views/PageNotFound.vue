<template>
	<div>
		<v-container class="text-center" v-if="isLoggedIn">
			<v-card class="pa-3">
				<v-img src="https://i.gifer.com/XOsX.gif" max-height="500"></v-img>
				<v-card-text class="subtitle-1"
					>Oops! This page isn't available.</v-card-text
				>
				<v-btn color="primary" dark to="/home" class="ma-3">Go Back to Home</v-btn>
			</v-card>
		</v-container>
    <v-container class="text-center" v-else>
			<v-card class="pa-3">
				<v-img src="https://i.gifer.com/XOsX.gif" max-height="500"></v-img>
				<v-card-text class="text-h5 text-xs-h5 ma-3"
					>Oops! This page isn't available.</v-card-text
				>
				<v-btn color="primary" dark to="/" class="ma-6">Go Back to Home</v-btn>
			</v-card>
		</v-container>
		<router-view></router-view>
	</div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
	setup() {
		const isLoggedIn = ref(false);
		let auth;
		onMounted(() => {
			auth = getAuth();
			onAuthStateChanged(auth, (user) => {
				if (user) {
					isLoggedIn.value = true;
				} else {
					isLoggedIn.value = false;
				}
			});
		});
		return {
			isLoggedIn,
		};
	},
};
</script>

<style lang="scss" scoped></style>
