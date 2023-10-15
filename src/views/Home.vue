<template>
	<div class="mt-16 pt-16">
		<v-container class="mb-16">
			<v-row class="justify-center pa-10">
				<h1 class="text-primary">Schedules</h1>
			</v-row>
			<v-row class="justify-center pa-5"
				><v-btn
					variant="outlined"
					@click="fetchData"
					:disabled="buttonDisabled"
				>
					Fetch Data
				</v-btn></v-row
			>
			<v-row class="justify-center pa-10">
				<v-col lg="2" md="2" sm="4">
					<v-select
						color="primary"
						label="Select"
						:hint="`${name} - ${status}`"
						:items="schedulesID"
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
									<v-row>
										<v-col class="text-caption">{{ schedule.name }}</v-col>
										<v-col
											class="text-caption"
											v-for="employeeSchedule in schedule.schedule"
											:key="employeeSchedule"
										>
											{{ employeeSchedule.time }}
											<span
												v-for="position in employeeSchedule.positions"
												:key="position"
												class="mr-1"
											>
												{{ position }}
											</span></v-col
										>
									</v-row>
								</v-container>
							</v-row>
						</v-container>
					</v-card></v-col
				>
			</v-row>
		</v-container>
	</div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { getFirestore, query, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();

let currentSchedule = ref([]);
let nextSchedule = ref([]);
let schedulesID = ref([]);
let scheduleStatus = ref([]);
let schedules = ref([]);
let dates = ref([]);
let name = ref('');
let status = ref('');
const buttonDisabled = ref(false);
let selectedSchedule = ref(); // To store the selected value

const saveDataToSession = () => {
	sessionStorage.setItem('schedulesID', JSON.stringify(schedulesID.value));
	sessionStorage.setItem(
		'scheduleStatus',
		JSON.stringify(scheduleStatus.value)
	);
	sessionStorage.setItem(
		'currentSchedule',
		JSON.stringify(currentSchedule.value)
	);
	sessionStorage.setItem('nextSchedule', JSON.stringify(nextSchedule.value));
};

const loadDataFromSession = () => {
	const storedSchedulesID = sessionStorage.getItem('schedulesID');
	const storedScheduleStatus = sessionStorage.getItem('scheduleStatus');
	const storedCurrentSchedule = sessionStorage.getItem('currentSchedule');
	const storedNextSchedule = sessionStorage.getItem('nextSchedule');

	if (storedSchedulesID) {
		schedulesID.value = JSON.parse(storedSchedulesID);
	}
	if (storedScheduleStatus) {
		scheduleStatus.value = JSON.parse(storedScheduleStatus);
	}
	if (storedCurrentSchedule) {
		currentSchedule.value = JSON.parse(storedCurrentSchedule);
	}
	if (storedNextSchedule) {
		nextSchedule.value = JSON.parse(storedNextSchedule);
	}
};

// Current Problem: Fetch Schedule IDs but not the actual schedule data. Have to click Fetch Data Button Twice
const fetchData = async () => {
	try {
		await fetchSchedulesID();
		await fetchCurrentSchedule();
		await fetchNextSchedule();
		alert('Data Fetched');

		// Save the data to session storage
		saveDataToSession();
	} catch (error) {
		console.error('An error occurred: ', error);
	}
};

// You should have two functions that return Promises, fetchSchedulesID and fetchSchedules.

const fetchSchedulesID = async () => {
	const querySnap = await getDocs(query(collection(db, 'Schedules')));

	// Clear the schedules array before populating it
	schedulesID.value = [];
	// Add each doc's "name" field to the schedules array
	querySnap.forEach((doc) => {
		schedulesID.value.push(doc.data());
		scheduleStatus.value.push(doc.data().status);
	});
};

const fetchNextSchedule = async () => {
	const querySnap = await getDocs(
		query(
			collection(
				db,
				'Schedules',
				schedulesID.value[0].name,
				schedulesID.value[0].name
			)
		)
	);
	querySnap.forEach((doc) => {
		nextSchedule.value.push(doc.data());
	});
};
const fetchCurrentSchedule = async () => {
	const querySnap = await getDocs(
		query(
			collection(
				db,
				'Schedules',
				schedulesID.value[1].name,
				schedulesID.value[1].name
			)
		)
	);
	querySnap.forEach((doc) => {
		currentSchedule.value.push(doc.data());
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

	if (newValue === schedulesID.value[0]) {
		schedules.value = nextSchedule.value;
	} else {
		schedules.value = currentSchedule.value;
	}
});

watch(schedulesID, () => {
	if (schedulesID.value) {
		buttonDisabled.value = true;
	} else {
		buttonDisabled.value = false;
	}
});

// Load data from storage when the component is mounted
onMounted(() => {
	loadDataFromSession();
});

const days = [
	'SUNDAY',
	'MONDAY',
	'TUESDAY',
	'WENDSDAY',
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
