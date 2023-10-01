<template>
	<div>
		<div class="d-flex justify-center mt-10">
			<!-- New Schedule Button -->
			<v-btn @click="showNewScheduleDialog" color="primary">
				New Schedule
			</v-btn>
		</div>

		<!-- New Schedule Dialog -->
		<v-dialog
			v-model="newScheduleDialog"
			fullscreen
			:scrim="false"
			transition="dialog-bottom-transition"
		>
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
					<v-select
						chips
						multiple
						label="Select Positions"
						:items="positions"
						variant="outlined"
					></v-select>
				</v-card-text>
				<v-card-text>
					<v-table>
						<thead>
							<tr>
								<th class="text-left"></th>
								<th
									class="text-left"
									v-for="scheduleDate in scheduleDates"
									:key="scheduleDate"
								>
									{{ scheduleDate }}
								</th>
							</tr>
							<tr>
								<th class="text-left"></th>
								<th class="text-left" v-for="day in days" :key="day">
									{{ day }}
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="employee in employees" :key="employee">
								<td>
									<v-btn variant="plain" @click="toggleShowOptions">
										{{ employee }}
									</v-btn>
								</td>
							</tr>
						</tbody>
					</v-table>
				</v-card-text>

				<v-card-actions class="justify-center">
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
			<v-dialog v-model="showOptions" width="80%">
				<v-card width="80%" class="pa-10 ma-5">
					<v-card-title primary-title> Employee: </v-card-title>
					<v-card-item>
						<v-select
							label="Select Positions"
							:items="options"
							variant="outlined"
						></v-select>
					</v-card-item>
				</v-card>
			</v-dialog>
		</v-dialog>

		<!-- Schedule List -->
		<div>
			<h2>Schedules</h2>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const newScheduleDialog = ref(false);
const showOptions = ref(false);
const date = ref('');
const startDate = ref('');
const endDate = ref('');
const scheduleDates = ref([]); // To store the array of dates

// Show New Schedule Dialog
const showNewScheduleDialog = () => {
	newScheduleDialog.value = true;
};

//Show Options
const toggleShowOptions = () => {
	showOptions.value = true;
};

// Cancel New Schedule Dialog
const cancelNewScheduleDialog = () => {
	newScheduleDialog.value = false;
	startDate.value = '';
	endDate.value = '';
	scheduleDates.value = [];
};

// Watch for changes in the date and update the formatted date
watch(date, (newDate) => {
	startDate.value = formatDate(newDate[0]);
	endDate.value = formatDate(newDate[1]);
	scheduleDates.value = generateDateArray(newDate[0], newDate[1]);
});

// Format the date to show only the month, day, and year
const formatDate = (date) => {
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

// Format the month and day
const formatScheduleDate = (date) => {
	return date.toLocaleDateString(undefined, {
		month: 'long',
		day: 'numeric',
	});
};

// Function to generate an array of dates between start and end dates
const generateDateArray = (start, end) => {
	const dates = [];
	let currentDate = new Date(start);

	while (currentDate <= end) {
		dates.push(formatScheduleDate(new Date(currentDate))); // Format the date and push it
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dates;
};

// Data
const employees = [
	'KELLY',
	'KIM',
	'EMILY',
	'KRISTEN',
	'LEXIE',
	'ANN',
	'KAREN',
	'ALISON',
	'JENNIFER',
	'MARGARET',
	'MADDIE',
	'MORGAN',
	'SIDNEY',
	'KATLYN',
	'GAVIN',
	'JOHN',
	'WES',
	'TRISTAN',
	'ISAAC',
	'GREGORY',
	'DAYNE',
	'CONNER',
	'ISIAH',
	'WILLIAM',
	'CHRIS',
	'JERRY',
	'JACK',
	'LANCE',
];
const positions = ['OFFICE', 'SCAN', 'CASHIER', 'STOCK'];
const days = [
	'SUNDAY',
	'MONDAY',
	'TUESDAY',
	'WENDSDAY',
	'THURSDAY',
	'FRIDAY',
	'SATURDAY',
];

const options = [
	'7-4',
	'6-3',
	'8-5',
	'12-9',
	'2-9',
	'4-9',
	'9-6',
	'3:30-9:30',
	'4-9:30',
	'6-5',
	'7-3',
	'12:30-9:30',
	'OFF',
	'NOT AVAILABLE',
	'VACATION',
];
</script>

<style></style>
