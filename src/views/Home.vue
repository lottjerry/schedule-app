<template>
	<div>
		<v-container class="mb-10">
			<v-row class="justify-center pa-10">
				<h1 class="text-primary">Schedules</h1>
			</v-row>
			<v-row class="justify-center pa-10">
				<v-col cols="2">
					<v-select
						color="primary"
						label="Select"
						:items="schedulesID"
						v-model="selectedSchedule"
						variant="outlined"
					></v-select>
				</v-col>
			</v-row>
			<!-- ******* SCHEDULES VIEW ******* -->
			<v-row>
				<v-table>
					<thead>
						<tr>
							<th class="text-left border"></th>
							<th class="text-left border" v-for="date in dates" :key="date">
								{{ date }}
							</th>
						</tr>
						<tr>
							<th class="text-left border"></th>
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
		</v-container>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getFirestore, query, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();

let schedulesID = ref([]);
let schedules = ref([]);
let dates = ref([]);
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
	const querySnap = await getDocs(
		query(
			collection(
				db,
				'Schedules',
				selectedSchedule.value,
				selectedSchedule.value
			)
		)
	);
	querySnap.forEach((doc) => {
		schedules.value.push(doc.data());
	});
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

// Watch for changes in the date and update the formatted date
watch(selectedSchedule, () => {
	fetchSchedules();
	generateDateArray();
	console.log(dates.value);
});

onMounted(() => {
	fetchSchedulesID();
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

<style lang="scss" scoped></style>
