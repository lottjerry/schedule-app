<template>
	<div>
		<div class="d-flex justify-center mt-10">
			<v-btn>
				New User
				<v-overlay
					activator="parent"
					location-strategy="connected"
					scroll-strategy="block"
					location="top center"
					origin="auto"
				>
					<div>
						<v-card width="400">
							<div class="pa-5 flex">
								<v-text-field
									color="primary"
									variant="underlined"
									v-model="name"
									label="Name"
									prepend-icon="mdi-account-outline"
								></v-text-field>
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
								<p v-if="errMsg" class="mb-4 text-red">{{ errMsg }}</p>
								<v-btn @click="createUser" color="primary" block class="mt-2"
									>Create User</v-btn
								>
							</div>
						</v-card>
					</div>
				</v-overlay>
			</v-btn>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const email = ref('');
const password = ref('');
const name = ref('');
const db = getFirestore();

const createUser = () => {
	createUserWithEmailAndPassword(getAuth(), email.value, password.value)
		.then((userCredentials) => {
			setDoc(doc(db, 'users', userCredentials.user.uid), {
				name: name.value,
				email: userCredentials.user.email,
				role: 'user',
			})
				.then(() => {
					alert(`Successfully created user ${name.value}`);
					email.value = '';
					password.value = '';
					name.value = '';
				})
				.catch((error) => {
					alert(`Error adding user to database: ${error.message}`);
				});
		})
		.catch((error) => {
			alert(`Error creating user: ${error.message}`);
		});
};

</script>

<style lang="scss" scoped></style>
