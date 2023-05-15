<template>
	<div>
		<div v-if="isLoggedIn">
			<v-btn color="success" to="/home">Back to Home</v-btn>
		</div>
		<div v-else>
			<v-btn color="success" to="/">Back to Login</v-btn>
		</div>
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
