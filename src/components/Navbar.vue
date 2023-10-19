<template>
	<nav>
		<v-app-bar app density="compact">
			<v-app-bar-title class="text-primary">Schedule App</v-app-bar-title>

			<!-- dropdown menu -->
			<v-menu location="bottom" v-if="isLoggedIn">
				<template v-slot:activator="{ props }">
					<v-btn variant="tonal" v-bind="props" color="primary">{{
						user_firstName
					}}</v-btn>
				</template>
				<v-list color="primary">
					<v-list-item to="/home">
						<v-list-item-title>My Schedule</v-list-item-title>
					</v-list-item>
					<v-list-item to="/grocery_schedules">
						<v-list-item-title>Grocery Schedule</v-list-item-title>
					</v-list-item>
					<div v-if="user_role === 'admin'">
						<v-list-item to="/users">
							<v-list-item-title>Users</v-list-item-title>
						</v-list-item>
						<v-list-item to="/schedules">
							<v-list-item-title>Schedules</v-list-item-title>
						</v-list-item>
					</div>

					<v-list-item @click="logout">
						<v-list-item-title>Log out</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-app-bar>
		<router-view></router-view>
	</nav>
</template>

<script>
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { app } from '@/main';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default {
	setup() {
		const user_email = ref(null);
		const user_firstName = ref(null);
		const user_role = ref(null);
		const isLoggedIn = ref(false);
		const router = useRouter();

		// Get Firestore instance
		const db = getFirestore(app);

		let auth;
		onMounted(() => {
			auth = getAuth();
			onAuthStateChanged(auth, (user) => {
				if (user) {
					isLoggedIn.value = true;
					user_email.value = user.email;
					const userDocRef = doc(db, 'users', user.uid);
					getDoc(userDocRef).then((doc) => {
						if (doc.exists()) {
							user_firstName.value = doc.data().firstName;
							user_role.value = doc.data().role;
						}
					});
				} else {
					isLoggedIn.value = false;
					user_email.value = null;
					user_firstName.value = null;
					user_role.value = null;
				}
			});
		});

		const logout = async () => {
			try {
				await signOut(auth);
				router.push('/');
			} catch (error) {
				console.error(error);
			}
		};

		return {
			user_email,
			user_firstName,
			user_role,
			isLoggedIn,
			logout,
		};
	},
};
</script>
