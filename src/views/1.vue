<template>
	<div class="mt-16 pt-16">
		<v-container class="">
			<v-row>
				<v-col> <v-btn small @click="fetchSchedules">Click</v-btn> </v-col>
			</v-row>
			<v-row v-for="item in schedule" :key="item.id">
				{{item.GAVIN[0].day}}
			</v-row>
		</v-container>
	</div>
</template>

<script setup>
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { ref } from 'vue';

let schedule = ref([]);
let name = ref('');
let createdAt = ref('');

const db = getFirestore();

const fetchSchedules = async () => {
	const docRef = doc(db, 'Schedules', 'December 2, 2023');
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		schedule.value.push(docSnap.data());
		name.value = schedule.value[0].name;
		createdAt.value = new Date(
			schedule.value[0].createdAt.toDate()
		).toLocaleString();
		console.log(name.value);
		console.log(createdAt.value);
	} else {
		// docSnap.data() will be undefined in this case
		console.log('No such document!');
	}
};
</script>

<style></style>
