<template>
	<div class="mt-16 pt-16">
		<v-overlay :model-value="isLoading" class="align-center justify-center">
			<v-progress-circular
				color="primary"
				indeterminate
				size="64"
			></v-progress-circular>
		</v-overlay>
		<v-container class="mb-16">
			<v-row class="justify-center pa-10">
				<h1 class="text-primary">My Schedule</h1>
			</v-row>
			<v-row class="justify-center pa-10">
				<v-col lg="2" md="2" sm="4">
					<v-select
						color="primary"
						label="Select"
						:items="schedulesID"
						v-model="selectedSchedule"
						variant="outlined"
					></v-select>
				</v-col>
			</v-row>
			<v-row class="justify-center pa-3"> Updated @ {{ updatedAt }} </v-row>
			<!-- ******* SCHEDULES VIEW DESKTOP ******* -->
			<v-row class="hidden-sm-and-down justify-center">
				<v-table>
					<thead>
						<tr>
							<th v-if="selectedSchedule" class="text-left border"></th>
							<th
								class="text-left border"
								v-for="date in dates"
								:key="date"
								:class="{ 'text-indigo-darken-3 custom_border': isToday(date) }"
							>
								{{ date }}
							</th>
						</tr>
						<tr>
							<th v-if="selectedSchedule" class="text-left border"></th>
							<th class="text-left border" v-for="day in days" :key="day">
								<h2 class="pa-2">{{ day }}</h2>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="employee in schedules"
							:key="employee"
							class="border"
						>
							<td class="border">
								<h3 variant="plain" class="pa-3">
									{{ employee.employeeName }}
								</h3>
							</td>
							<td v-for="(day, index) in days" :key="index" class="border">
								<div class="pa-5">
									<h4>{{ employee.schedule[index].time}}</h4>
									<h4 v-for="positions in employee.schedule[index].positions" :key="positions">
										{{ positions }}
										<!-- Positions -->
									</h4>
								</div>
							</td>
						</tr>
					</tbody>
				</v-table>
			</v-row>

			<!-- ******* SCHEDULES VIEW MOBILE DEVICES ******* 
			<v-row v-if="selectedSchedule" class="hidden-md-and-up">
				<v-col
					><v-card
						flat
						color="transparent"
						v-for="(date, index) in dates"
						:key="date"
						width="350px"
						class="mx-auto"
						:class="{ 'text-indigo-darken-3 custom_border': isToday(date) }"
					>
						<v-container class="mb-4">
							<v-row>
								<p>{{ days[index] }} - {{ date }}</p>
							</v-row>
							<v-row
								v-for="schedule in schedules"
								:key="schedule"
								class="border rounded-xl mb-1"
							>
								<v-container>
									<v-row class="justify-center">
										<div
											class="text-caption"
											v-for="employeeSchedule in schedule.schedule"
											:key="employeeSchedule.day"
										>
											<div
												v-if="
													employeeSchedule.day.toLowerCase() ===
													days[index].toLowerCase()
												"
												class="pa-2 text-center"
											>
												<p>
													{{ employeeSchedule.time }}
												</p>
												<p
													v-for="position in employeeSchedule.positions"
													:key="position"
													class="mr-1"
												>
													{{ position }}
												</p>
											</div>
										</div>
									</v-row>
								</v-container>
							</v-row>
						</v-container>
					</v-card></v-col
				>
			</v-row>
			-->
		</v-container>
	</div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
//import { getAuth } from 'firebase/auth';

import {
	getFirestore,
	query,
	collection,
	getDocs,
	doc,
	getDoc,
} from 'firebase/firestore';
const db = getFirestore();
//const auth = getAuth();
//const user = auth.currentUser;

let schedulesID = ref([]);
let updatedAt = ref('');
let schedules = ref([]);
let dates = ref([]);
const isLoading = ref(false);
let selectedSchedule = ref(); // To store the selected value

const fetchSchedulesID = async () => {
	const querySnap = await getDocs(query(collection(db, 'Schedules')));

	// Clear the schedules array before populating it
	schedulesID.value = [];

	// Add each doc's "name" field to the schedules array
	querySnap.forEach((doc) => {
		schedulesID.value.push(doc.id);
	});
};

const fetchSchedules = async () => {
	const docRef = doc(db, 'Schedules', selectedSchedule.value);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		// updateAt
		updatedAt.value = new Date(
			docSnap.data().createdAt.toDate()
		).toLocaleString();
		// Schedules
		schedules.value = docSnap.data().scheduleData;
	} else {
		// docSnap.data() will be undefined in this case
		console.log('No such document!');
	}
};

// Function to generate an array of formatted date strings for 7 previous days before the end date
const generateDateArray = () => {
	dates.value = [];

	const endDate = new Date(selectedSchedule.value);

	for (let i = 6; i >= 0; i--) {
		const currentDate = new Date(endDate);
		currentDate.setDate(endDate.getDate() - i);
		const formattedDate = currentDate.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}); // Format the date as desired
		dates.value.push(formattedDate);
	}
};

// Format the date to show only the month, day, and year
const formatDate = (date) => {
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

// Get current Day

const isToday = (date) => {
	const today = new Date();
	const formattedDate = formatDate(today);
	return formattedDate === date;
};
// Watch for changes in the selectedSchedule and update other data
watch(selectedSchedule, (newSelectedSchedule, oldSelectedSchedule) => {
	if (newSelectedSchedule !== oldSelectedSchedule) {
		// You can perform additional actions here
		// For example, you can clear the existing schedules
		schedules.value = [];

		// Then fetch new schedules
		fetchSchedules();

		// Update other data as needed
		// For example, generate a new date array
		generateDateArray();
		// You can also perform any other actions you need here
	}
});

onMounted(() => {
	fetchSchedulesID();
});

const days = [
	'SUNDAY',
	'MONDAY',
	'TUESDAY',
	'WEDNESDAY',
	'THURSDAY',
	'FRIDAY',
	'SATURDAY',
];
</script>

<style scoped>
.custom_border {
	border-color: #283593 !important;
	border-width: 3px !important;
}
</style>
