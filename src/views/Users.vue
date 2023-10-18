<template>
	<div class="mt-16 pt-16">
		<v-overlay :model-value="isLoading" class="align-center justify-center">
			<v-progress-circular
				color="primary"
				indeterminate
				size="64"
			></v-progress-circular>
		</v-overlay>
		<div class="d-flex justify-center mt-10">
			<!-- New User Button -->
			<v-btn @click="showNewUserDialog" color="primary"> New User </v-btn>
		</div>

		<!-- New User Dialog -->
		<v-dialog v-model="newUserDialog" max-width="400px">
			<v-card>
				<v-card-title class="text-center" style="color: blue"
					>New User</v-card-title
				>
				<v-card-text>
					<v-text-field
						v-model="firstName"
						label="First Name"
						prepend-icon="mdi-account-outline"
						variant="underlined"
						color="primary"
					></v-text-field>
					<v-text-field
						v-model="lastName"
						label="Last Name"
						prepend-icon="mdi-account-outline"
						variant="underlined"
						color="primary"
					></v-text-field>
					<v-text-field
						v-model="position"
						label="Position"
						prepend-icon="mdi-account-outline"
						variant="underlined"
						color="primary"
					></v-text-field>
					<v-text-field
						v-model="email"
						label="Email"
						prepend-icon="mdi-email-outline"
						variant="underlined"
						color="primary"
					></v-text-field>
					<v-text-field
						v-model="password"
						label="Password"
						type="password"
						prepend-icon="mdi-lock-outline"
						variant="underlined"
						color="primary"
					></v-text-field>
					<p v-if="errMsg" class="mb-4 text-red">{{ errMsg }}</p>
				</v-card-text>
				<v-card-actions>
					<v-btn
						@click="createUser"
						color="primary"
						variant="outlined"
						elevation="1"
						>Create User</v-btn
					>
					<v-btn
						@click="cancelNewUserDialog"
						color="primary"
						variant="outlined"
						elevation="1"
						>Cancel</v-btn
					>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Users Table -->
		<v-card class="mx-auto pa-5 mt-5 hidden-sm-and-down" style="width: 1000px">
			<v-card-title primary-title class="text-center" style="color: blue">
				Users
			</v-card-title>
			<v-table>
				<thead>
					<tr>
						<th class="text-left">First Name</th>
						<th class="text-left">Last Name</th>
						<th class="text-left">Position</th>
						<th class="text-left">Role</th>
						<th class="text-left"></th>
						<th class="text-left"></th>
						<!-- New column for Edit button -->
					</tr>
				</thead>
				<tbody>
					<tr v-for="user in users" :key="user.id">
						<td>{{ user.firstName }}</td>
						<td>{{ user.lastName }}</td>
						<td>{{ user.position }}</td>
						<td>{{ user.role }}</td>
						<td>
							<v-btn @click="deleteUser(user)" color="error">Delete</v-btn>
						</td>
						<td>
							<v-btn @click="editUser(user)" color="primary">Edit</v-btn>
							<!-- Edit button -->
						</td>
						<td>
							<v-btn @click="resetPassword(user)" color="purple"
								>Reset Password</v-btn
							>
						</td>
						<!-- Password Reset Button -->
					</tr>
				</tbody>
			</v-table>
		</v-card>

		<!-- Users Cards -->
		<v-card width="350px" class="mx-auto hidden-md-and-up mt-5">
			<v-col v-for="user in users" :key="user.id">
				<v-card class="pa-8">
					<v-card-title class="text-center"
						>{{ user.firstName }} {{ user.lastName }}</v-card-title
					>
					<v-card-text class="text-center">
						<div>Position: {{ user.position }}</div>
						<div>Role: {{ user.role }}</div>
					</v-card-text>
					<v-card-actions class="justify-center">
						<v-btn
							@click="deleteUser(user)"
							color="error"
							variant="outlined"
							elevation="1"
							size="small"
							>Delete</v-btn
						>
						<v-btn
							@click="editUser(user)"
							color="primary"
							variant="outlined"
							elevation="1"
							size="small"
							>Edit</v-btn
						>
						<v-btn
							@click="resetPassword(user)"
							color="purple"
							variant="outlined"
							elevation="1"
							size="small"
							>Reset Password</v-btn
						>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-card>

		<!-- Edit User Dialog -->
		<v-dialog v-model="editUserDialog" max-width="400px">
			<v-card>
				<v-card-title class="text-center" style="color: blue"
					>Edit User</v-card-title
				>
				<v-card-text>
					<v-text-field
						v-model="editFirstName"
						label="First Name"
						prepend-icon="mdi-account-outline"
						variant="underlined"
						color="primary"
					></v-text-field>
					<v-text-field
						v-model="editLastName"
						label="Last Name"
						prepend-icon="mdi-account-outline"
						variant="underlined"
						color="primary"
					></v-text-field>
					<v-text-field
						v-model="editPosition"
						label="Position"
						prepend-icon="mdi-account-outline"
						variant="underlined"
						color="primary"
					></v-text-field>
					<v-text-field
						v-model="editEmail"
						label="Email"
						prepend-icon="mdi-email-outline"
						variant="underlined"
						color="primary"
					></v-text-field>
					<p v-if="editErrMsg" class="mb-4 text-red">{{ editErrMsg }}</p>
				</v-card-text>
				<v-card-actions>
					<v-btn
						@click="updateUser"
						color="primary"
						variant="outlined"
						elevation="1"
						>Update User</v-btn
					>
					<v-btn
						@click="cancelEditUserDialog"
						color="primary"
						variant="outlined"
						elevation="1"
						>Cancel</v-btn
					>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import {
	getAuth,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signOut,
	updateProfile,
} from 'firebase/auth';
import {
	getFirestore,
	doc,
	setDoc,
	collection,
	getDocs,
	deleteDoc,
	updateDoc,
} from 'firebase/firestore';

const isLoading = ref(false);
const router = useRouter();
const email = ref('');
const password = ref('');
const name = ref('');
const firstName = ref('');
const lastName = ref('');
const position = ref('');
const editFirstName = ref('');
const editLastName = ref('');
const editPosition = ref('');
const editEmail = ref('');
const db = getFirestore();
const users = ref([]);
const newUserDialog = ref(false);
const editUserDialog = ref(false);
const errMsg = ref('');
const editErrMsg = ref('');
let editUserId = null;

// Fetch Users
const fetchUsers = async () => {
	isLoading.value = true;
	const querySnapshot = await getDocs(collection(db, 'users'));
	const usersData = [];
	querySnapshot.forEach((doc) => {
		usersData.push({ ...doc.data(), id: doc.id });
	});
	users.value = usersData;
	isLoading.value = false;
};

// Create User
const createUser = () => {
	isLoading.value = true;
	createUserWithEmailAndPassword(getAuth(), email.value, password.value)
		.then((userCredentials) => {
			const newUser = {
				firstName: firstName.value,
				lastName: lastName.value,
				position: position.value,
				email: userCredentials.user.email,
				role: 'user',
			};

			// Set the user's display name to the firstName
			updateProfile(userCredentials.user, {
				displayName: firstName.value,
			})
				.then(() => {
					setDoc(doc(db, 'users', userCredentials.user.uid), newUser)
						.then(() => {
							isLoading.value = true;
							alert(`Successfully created user ${firstName.value}`);
							isLoading.value = false;
							logout();
							firstName.value = '';
							lastName.value = '';
							position.value = '';
							email.value = '';
							password.value = '';
							name.value = '';
							newUserDialog.value = false;
							fetchUsers(); // Fetch updated user list
						})
						.catch((error) => {
							isLoading.value = false;
							errMsg.value = `Error adding user to the database: ${error.message}`;
						});
				})
				.catch((error) => {
					isLoading.value = false;
					errMsg.value = `Error setting display name: ${error.message}`;
				});
		})
		.catch((error) => {
			isLoading.value = false;
			errMsg.value = `Error creating user: ${error.message}`;
		});
};

// Show New User Dialog
const showNewUserDialog = () => {
	newUserDialog.value = true;
};

// Cancel New User Dialog
const cancelNewUserDialog = () => {
	newUserDialog.value = false;
};

// Delete User
const deleteUser = (user) => {
	isLoading.value = true;
	const userRef = doc(db, 'users', user.id);
	deleteDoc(userRef)
		.then(() => {
			isLoading.value = false;
			alert(`Successfully deleted user ${user.firstName}`);
			fetchUsers(); // Fetch updated user list
		})
		.catch((error) => {
			isLoading.value = false;
			errMsg.value = `Error deleting user: ${error.message}`;
		});
};

// Edit User
const editUser = (user) => {
	editUserId = user.id;
	editFirstName.value = user.firstName;
	editLastName.value = user.lastName;
	editPosition.value = user.position;
	editEmail.value = user.email;
	editUserDialog.value = true;
};

// Update User
const updateUser = () => {
	isLoading.value = true;
	if (editUserId) {
		const userRef = doc(db, 'users', editUserId);
		const newFirstName = editFirstName.value; // Store the new first name

		// Update the user's data in Firestore
		updateDoc(userRef, {
			firstName: newFirstName,
			lastName: editLastName.value,
			position: editPosition.value,
			email: editEmail.value,
		})
			.then(() => {
				// Set the user's display name to the new first name
				const user = getAuth().currentUser;
				updateProfile(user, {
					displayName: newFirstName,
				})
					.then(() => {
						isLoading.value = false;
						alert(`Successfully updated user ${newFirstName}`);
						editUserId = null;
						editFirstName.value = '';
						editLastName.value = '';
						editPosition.value = '';
						editEmail.value = '';
						editUserDialog.value = false;
						fetchUsers(); // Fetch updated user list
					})
					.catch((error) => {
						isLoading.value = false;
						editErrMsg.value = `Error updating user profile: ${error.message}`;
					});
			})
			.catch((error) => {
				isLoading.value = false;
				editErrMsg.value = `Error updating user: ${error.message}`;
			});
	}
};
// Cancel Edit User Dialog
const cancelEditUserDialog = () => {
	editUserId = null;
	editFirstName.value = '';
	editLastName.value = '';
	editPosition.value = '';
	editEmail.value = '';
	editUserDialog.value = false;
};

// Reset Password
const resetPassword = (user) => {
	isLoading.value = true;
	const auth = getAuth();
	const email = user.email;

	sendPasswordResetEmail(auth, email)
		.then(() => {
			isLoading.value = false;
			alert(`Reset password email sent to ${email}`);
		})
		.catch((error) => {
			isLoading.value = false;
			errMsg.value = `Error resetting password: ${error.message}`;
		});
};

const logout = async () => {
	const auth = getAuth();
	try {
		await signOut(auth);
		router.push('/');
	} catch (error) {
		console.error(error);
	}
};

// Fetch users on component mount
onMounted(fetchUsers);
</script>

<style></style>
