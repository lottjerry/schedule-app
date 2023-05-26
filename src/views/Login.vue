<template>
	<div class="d-flex flex-column align-center justify-center mt-5">
		<v-icon icon="mdi-home-outline" size="40" color="primary"></v-icon>
		<h1 class="text-primary text-h4 font-weight-bold pa-2">Log in</h1>
	</div>
	<div class="d-flex align-center justify-center">
		<v-card width="400">
			<v-form fast-fail class="pa-5 flex" @submit.prevent="login">
				<v-text-field
					color="primary"
					variant="underlined"
					v-model="email"
					label="Email"
					prepend-icon="mdi-email-outline"
				></v-text-field>

				<v-text-field
					color="primary"
					variant="underlined"
					v-model="password"
					label="Password"
					type="password"
					prepend-icon="mdi-lock-outline"
				></v-text-field>
				<p v-if="errMsg" class="mb-4 text-red" >{{ errMsg }}</p>
				<a href="#" class="text-body-2 font-weight-regular">Forgot Password?</a>
				<v-btn type="submit" color="primary" block class="mt-2">Log in</v-btn>
			</v-form>
			<div class="mt-2">
				<p class="text-body-2 pa-5">
					Don't have an account? <a href="#">Sign Up</a>
				</p>
			</div>
		</v-card>
	</div>
</template>
<script>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
	name: 'Login',

	setup() {
		const email = ref('');
		const password = ref('');
		const errMsg = ref('');
		const router = useRouter();

		function login() {
			const auth = getAuth();
			signInWithEmailAndPassword(auth, email.value, password.value)
				.then(() => {
					router.push('/home');
				})
				.catch((error) => {
					switch (error.code) {
						case 'auth/invalid-email':
							errMsg.value = 'Invalid email';
							break;
						case 'auth/user-not-found':
							errMsg.value = 'No account with that email was found';
							break;
						case 'auth/wrong-password':
							errMsg.value = 'Incorrect password';
							break;
						default:
							errMsg.value = 'Email or password was incorrect';
							break;
					}
				});
		}

		return {
			email,
			password,
			errMsg,
			login,
		};
	},
};
</script>
<style>
.v-input:focus-within .mdi-lock-outline {
	color: blue;
}
.v-input:focus-within .mdi-email-outline {
	color: blue;
}
.v-input:focus-within .mdi-account-outline {
	color: blue;
}
</style>
