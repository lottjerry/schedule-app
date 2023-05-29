<template>
  <div>
    <div class="d-flex justify-center mt-10">
      <!-- New User Button -->
      <v-btn @click="showNewUserDialog" color="primary"> New User </v-btn>
    </div>

    <!-- New User Dialog -->
    <v-dialog v-model="newUserDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-center" style="color: blue">New User</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="name"
            label="Name"
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
          >Create User</v-btn>
          <v-btn
            @click="cancelNewUserDialog"
            color="primary"
            variant="outlined"
            elevation="1"
          >Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Users Table -->
    <v-card class="mx-auto pa-5 mt-5 back" style="width: 500px">
      <v-card-title primary-title class="text-center" style="color: blue">
        Users
      </v-card-title>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Role</th>
            <th class="text-left"></th>
            <th class="text-left"></th> <!-- New column for Edit button -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>
              <v-btn @click="deleteUser(user)" color="error">Delete</v-btn>
            </td>
            <td>
              <v-btn @click="editUser(user)" color="primary">Edit</v-btn> <!-- Edit button -->
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Edit User Dialog -->
    <v-dialog v-model="editUserDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-center" style="color: blue">Edit User</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editName"
            label="Name"
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
          >Update User</v-btn>
          <v-btn
            @click="cancelEditUserDialog"
            color="primary"
            variant="outlined"
            elevation="1"
          >Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

const email = ref('');
const password = ref('');
const name = ref('');
const editName = ref('');
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
  const querySnapshot = await getDocs(collection(db, 'users'));
  const usersData = [];
  querySnapshot.forEach((doc) => {
    usersData.push({ ...doc.data(), id: doc.id });
  });
  users.value = usersData;
};

// Create User
const createUser = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((userCredentials) => {
      const newUser = {
        name: name.value,
        email: userCredentials.user.email,
        role: 'user',
      };

      setDoc(doc(db, 'users', userCredentials.user.uid), newUser)
        .then(() => {
          alert(`Successfully created user ${name.value}`);
          email.value = '';
          password.value = '';
          name.value = '';
          newUserDialog.value = false;
          fetchUsers(); // Fetch updated user list
        })
        .catch((error) => {
          errMsg.value = `Error adding user to database: ${error.message}`;
        });
    })
    .catch((error) => {
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
  const userRef = doc(db, 'users', user.id);
  deleteDoc(userRef)
    .then(() => {
      alert(`Successfully deleted user ${user.name}`);
      fetchUsers(); // Fetch updated user list
    })
    .catch((error) => {
      errMsg.value = `Error deleting user: ${error.message}`;
    });
};

// Edit User
const editUser = (user) => {
  editUserId = user.id;
  editName.value = user.name;
  editEmail.value = user.email;
  editUserDialog.value = true;
};

// Update User
const updateUser = () => {
  if (editUserId) {
    const userRef = doc(db, 'users', editUserId);
    updateDoc(userRef, {
      name: editName.value,
      email: editEmail.value,
    })
      .then(() => {
        alert(`Successfully updated user ${editName.value}`);
        editUserId = null;
        editName.value = '';
        editEmail.value = '';
        editUserDialog.value = false;
        fetchUsers(); // Fetch updated user list
      })
      .catch((error) => {
        editErrMsg.value = `Error updating user: ${error.message}`;
      });
  }
};

// Cancel Edit User Dialog
const cancelEditUserDialog = () => {
  editUserId = null;
  editName.value = '';
  editEmail.value = '';
  editUserDialog.value = false;
};

// Fetch users on component mount
onMounted(fetchUsers);
</script>

<style></style>
