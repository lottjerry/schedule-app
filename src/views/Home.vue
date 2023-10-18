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
						:hint="`${name} - ${status}`"
						:items="employeeSchedulesID"
						item-title="status"
						item-value="name"
						v-model="selectedSchedule"
						variant="outlined"
						persistent-hint
						return-object
						single-line
					></v-select>
				</v-col>
			</v-row>

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
						<tr v-for="schedule in schedules" :key="schedule" class="border">
							<td class="border">
								<h3 variant="plain" class="pa-3">
									{{ schedule.name }}
								</h3>
							</td>
							<td
								v-for="employeeSchedule in schedule.schedule"
								:key="employeeSchedule"
								class="border"
							>
								<div class="pa-5">
									<h4>{{ employeeSchedule.time }}</h4>
									<h4
										v-for="position in employeeSchedule.positions"
										:key="position"
									>
										{{ position }}
										<!-- Positions -->
									</h4>
								</div>
							</td>
						</tr>
					</tbody>
				</v-table>
			</v-row>
			<!-- ******* SCHEDULES VIEW MOBILE DEVICES ******* -->
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

			<v-row>
				<!-- Current Schedule -->
				<v-col v-for="schedule in sc" :key="schedule">
					<p>{{ schedule }}</p>
				</v-col>
				<!-- Next Schedule -->
				<v-col></v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';

import {
	getFirestore,
	query,
	collection,
	getDocs,
	where,
} from 'firebase/firestore';

const db = getFirestore();
const auth = getAuth();
const user = auth.currentUser;

let employeeCurrentSchedule = ref([]);
let employeeNextSchedule = ref([]);
let employeeSchedulesID = ref([]);
let employeeScheduleStatus = ref([]);
let schedules = ref([]);
let dates = ref([]);
let name = ref('');
let status = ref('');
const isLoading = ref(false);
const buttonDisabled = ref(false);
let selectedSchedule = ref(); // To store the selected value

const saveDataToSession = () => {
	isLoading.value = true;
	sessionStorage.setItem(
		'employeeSchedulesID',
		JSON.stringify(employeeSchedulesID.value)
	);
	sessionStorage.setItem(
		'employeeScheduleStatus',
		JSON.stringify(employeeScheduleStatus.value)
	);
	sessionStorage.setItem(
		'employeeCurrentSchedule',
		JSON.stringify(employeeCurrentSchedule.value)
	);
	sessionStorage.setItem(
		'employeeNextSchedule',
		JSON.stringify(employeeNextSchedule.value)
	);
	isLoading.value = false;
};

const loadDataFromSession = () => {
	isLoading.value = true;
	const storedemployeeSchedulesID = sessionStorage.getItem(
		'employeeSchedulesID'
	);
	const storedemployeeScheduleStatus = sessionStorage.getItem(
		'employeeScheduleStatus'
	);
	const storedemployeeCurrentSchedule = sessionStorage.getItem(
		'employeeCurrentSchedule'
	);
	const storedemployeeNextSchedule = sessionStorage.getItem(
		'employeeNextSchedule'
	);

	if (storedemployeeSchedulesID) {
		employeeSchedulesID.value = JSON.parse(storedemployeeSchedulesID);
	}
	if (storedemployeeScheduleStatus) {
		employeeScheduleStatus.value = JSON.parse(storedemployeeScheduleStatus);
	}
	if (storedemployeeCurrentSchedule) {
		employeeCurrentSchedule.value = JSON.parse(storedemployeeCurrentSchedule);
	}
	if (storedemployeeNextSchedule) {
		employeeNextSchedule.value = JSON.parse(storedemployeeNextSchedule);
	}
	isLoading.value = false;
};

// Current Problem: Fetch Schedule IDs but not the actual schedule data. Have to click Fetch Data Button Twice
const fetchData = async () => {
	isLoading.value = true;
	try {
		await fetchemployeeSchedulesID();
		await fetchemployeeCurrentSchedule();
		await fetchemployeeNextSchedule();

		// Save the data to session storage
		saveDataToSession();
	} catch (error) {
		console.error('An error occurred: ', error);
	}
	isLoading.value = false;
};

// You should have two functions that return Promises, fetchemployeeSchedulesID and fetchSchedules.

const fetchemployeeSchedulesID = async () => {
	const querySnap = await getDocs(query(collection(db, 'Schedules')));

	// Clear the schedules array before populating it
	employeeSchedulesID.value = [];
	employeeScheduleStatus.value = []
	// Add each doc's "name" field to the schedules array
	querySnap.forEach((doc) => {
		employeeSchedulesID.value.push(doc.data());
		employeeScheduleStatus.value.push(doc.data().status);
	});
};

const fetchemployeeNextSchedule = async () => {
	employeeNextSchedule.value = []
	const querySnap = await getDocs(
		query(
			collection(
				db,
				'Schedules',
				employeeSchedulesID.value[0].name,
				employeeSchedulesID.value[0].name
			),
			where('name', '==', user.displayName)
		)
	);
	querySnap.forEach((doc) => {
		employeeNextSchedule.value.push(doc.data());
	});
};
const fetchemployeeCurrentSchedule = async () => {
	employeeCurrentSchedule.value = []
	const querySnap = await getDocs(
		query(
			collection(
				db,
				'Schedules',
				employeeSchedulesID.value[1].name,
				employeeSchedulesID.value[1].name
			),
			where('name', '==', user.displayName)
		)
	);
	querySnap.forEach((doc) => {
		employeeCurrentSchedule.value.push(doc.data());
	});
};

// Function to generate an array of formatted date strings for 7 previous days before the end date
const generateDateArray = () => {
	dates.value = [];
	name.value = null;
	status.value = null;

	name.value = selectedSchedule.value.name;
	status.value = selectedSchedule.value.status;

	const endDate = new Date(selectedSchedule.value.name);

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

// Watch for changes in the date and update the formatted date

watch(selectedSchedule, (newValue) => {
	generateDateArray();

	if (newValue === employeeSchedulesID.value[0]) {
		schedules.value = employeeNextSchedule.value;
	} else {
		schedules.value = employeeCurrentSchedule.value;
	}
});

watch(employeeSchedulesID, () => {
	if (employeeSchedulesID.value) {
		buttonDisabled.value = true;
	} else {
		buttonDisabled.value = false;
	}
});

// Load data from storage when the component is mounted
onMounted(() => {
	fetchData();
	loadDataFromSession();
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
