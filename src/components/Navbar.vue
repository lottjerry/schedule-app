<template>
	<nav>
		<v-toolbar app>
			<v-app-bar-title class="text-primary">Schedule App</v-app-bar-title>

			<!-- dropdown menu -->
			<v-menu location="bottom" v-if="isLoggedIn">
				<template v-slot:activator="{ props }">
					<v-btn variant="tonal" v-bind="props">{{ user_name }}</v-btn>
				</template>
				<v-list>
					<!--
					<v-list-item to="/schedules">
						<v-list-item-title>Schedules</v-list-item-title>
					</v-list-item>
					-->
					<v-list-item @click="logout">
						<v-list-item-title>Log out</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-toolbar>
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
		const user_name = ref(null);
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
							user_name.value = doc.data().name;
						}
					});
				} else {
					isLoggedIn.value = false;
					user_email.value = null;
					user_name.value = null;
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
			user_name,
			isLoggedIn,
			logout,
		};
	},
};
</script>
