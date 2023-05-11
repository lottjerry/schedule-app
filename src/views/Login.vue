<template>
	<div class="d-flex flex-column align-center justify-center mt-5">
		<v-icon icon="mdi-home-outline" size="40" color="primary"></v-icon>
		<h1 class="text-primary text-h4 font-weight-bold pa-2">Log in</h1>
	</div>
	<div class="d-flex align-center justify-center">
		<v-card width="400">
			<v-form fast-fail @submit.prevent="login" class="pa-5">
				<v-text-field
					variant="underlined"
					v-model="username"
					label="User ID"
				></v-text-field>

				<v-text-field
					variant="underlined"
					v-model="password"
					label="Password"
				></v-text-field>
				<a href="#" class="text-body-2 font-weight-regular">Forgot Password?</a>

				<v-btn type="submit" color="primary" block class="mt-2">Sign in</v-btn>
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
export default {
	data() {
		return {
			username: '',
			password: '',
		};
	},
	methods: {
		login() {
			// Your login logic here
		},
	},
};
</script>
