<template>
	<div>
		<div class="d-flex justify-center mt-10">
			<!-- New Schedule Button -->
			<v-btn @click="showNewScheduleDialog" color="primary">
				New Schedule
			</v-btn>
		</div>

		<!-- New Schedule Dialog -->
		<v-dialog v-model="newScheduleDialog" max-width="400px">
			<v-card d-flex justify-center align-center class="pa-16">
				<v-card-title class="text-center" style="color: blue">
					New Schedule
				</v-card-title>
				<v-card-text>
					<Datepicker
						v-model="date"
						week-picker
						week-start="0"
						inline
						auto-apply
					/>
					<div v-if="startDate">
						<p>Start Date: {{ startDate }}</p>
						<p>End Date: {{ endDate }}</p>
					</div>
					<v-file-input
						v-model="image"
						chips
						multiple
						variant="underlined"
						label="Insert Schedule Image"
					></v-file-input>
					<p v-if="errMsg" class="mb-4 text-red">{{ errMsg }}</p>
				</v-card-text>
				<v-card-actions>
					<v-btn
						@click="createSchedule"
						color="primary"
						variant="outlined"
						elevation="1"
					>
						Create Schedule
					</v-btn>
					<v-btn
						@click="cancelNewScheduleDialog"
						color="primary"
						variant="outlined"
						elevation="1"
					>
						Cancel
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Schedule List -->
		<div>
			<h2>Schedules</h2>
			<ul>
				<li v-for="(schedule, index) in schedules" :key="schedule.endDate">
					<h3>{{ schedule.startDate }} - {{ schedule.endDate }}</h3>
					<img
						:src="imageURLs[index]"
						alt="Schedule Image"
						style="height: 20vh"
					/>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import {
	getStorage,
	ref as storageRef,
	getDownloadURL,
	updateMetadata,
	uploadBytes,
} from 'firebase/storage';
import {
	collection,
	getFirestore,
	query,
	orderBy,
	onSnapshot,
	addDoc,
} from 'firebase/firestore';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const newScheduleDialog = ref(false);
const image = ref('');
const errMsg = ref('');
const date = ref('');
const startDate = ref('');
const endDate = ref('');
const db = getFirestore();
const storage = getStorage();
const imageRef = ref(storageRef(storage, 'images'));
const schedules = ref([]);
const imageURLs = ref([]);

// Show New Schedule Dialog
const showNewScheduleDialog = () => {
	newScheduleDialog.value = true;
};

// Cancel New Schedule Dialog
const cancelNewScheduleDialog = () => {
	newScheduleDialog.value = false;
	image.value = '';
	startDate.value = '';
	endDate.value = '';
};

// Create Schedule
const createSchedule = async () => {
  const docRef = await addDoc(collection(db, 'schedules'), {
    startDate: startDate.value,
    endDate: endDate.value,
  });

  if (image.value) {
    const file = image.value[0];
    const imageName = `${endDate.value}.jpg`;
    const imageStorageRef = storageRef(imageRef.value, imageName);
    await uploadBytes(imageStorageRef, file);

    // Set image metadata with start date and end date
    const metadata = {
      customMetadata: {
        startDate: startDate.value,
        endDate: endDate.value,
      },
    };
    await updateMetadata(imageStorageRef, metadata);

    alert('File Successfully Uploaded!');
  }

  alert('Document written with ID: ' + docRef.id);

  newScheduleDialog.value = false;
};


// Watch for changes in the date and update the formatted date
watch(date, (newDate) => {
	startDate.value = formatDate(newDate[0]);
	endDate.value = formatDate(newDate[1]);
});

// Format the date to show only the month, day, and year
const formatDate = (date) => {
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

// Fetch schedules and image URLs on component mount
onMounted(() => {
	fetchSchedules();
});

const fetchSchedules = () => {
	const schedulesCollection = collection(db, 'schedules');
	const q = query(schedulesCollection, orderBy('startDate'));
	onSnapshot(q, async (snapshot) => {
		const newSchedules = [];
		const newImageURLs = [];

		for (const doc of snapshot.docs) {
			const scheduleData = doc.data();
			newSchedules.push(scheduleData);

			const imageURL = await getImageURL(scheduleData.endDate);
			newImageURLs.push(imageURL);
		}

		schedules.value = newSchedules;
		imageURLs.value = newImageURLs;
	});
};

const getImageURL = async (endDate) => {
	const imageName = `${endDate}.jpg`;
	const imageStorageRef = storageRef(imageRef.value, imageName);
	const downloadURL = await getDownloadURL(imageStorageRef);
	return downloadURL;
};

</script>

<style></style>
