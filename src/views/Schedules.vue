<template>
	<div>
		<div class="d-flex justify-center mt-10">
			<v-btn @click="showNewScheduleDialog" color="primary">
				New Schedule
			</v-btn>
		</div>

		<!-- ******* NEW SCHEDULE DIALOG ******* -->
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
				</v-card-text>
				<!-- ******* SCHEDULE PREVIEW ******* -->
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
									<v-btn variant="plain" @click="selectEmployee(employee)">
										{{ employee.name }}
									</v-btn>
								</td>
								<td v-for="s in employee.schedule" :key="s">
									<div>
										{{ s.time }}
										<p v-for="position in s.positions" :key="position">
											{{ position }}
										</p>
									</div>
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

			<!-- ******* EDIT EMPLOYEE SCHEDULE ******* -->
			<v-dialog v-model="showOptions" width="30%">
				<v-card width="80%" class="pa-10 ma-5">
					<v-card-title primary-title>
						Employee: {{ selectedEmployee }}</v-card-title
					>
					<v-card-item v-for="schedule in selectedSchedule" :key="schedule">
						<h6>{{ schedule.day }}</h6>
						<v-select
							class="pa-2"
							v-model="schedule.time"
							chips
							density="compact"
							label="Select Time"
							:items="options"
							variant="underlined"
						></v-select>
						<v-select
							class="pa-2"
							v-model="schedule.positions"
							multiple
							chips
							density="compact"
							label="Select Positions"
							:items="positions"
							variant="underlined"
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
let selectedEmployee = ref('');
let selectedSchedule = ref([]);
const scheduleDates = ref([]); // To store the array of dates
const employees = ref([
	{
		name: 'Jerry',
		schedule: [
			{
				day: 'Sunday',
				time: '',
				positions: [],
			},
			{
				day: 'Monday',
				time: '',
				positions: [],
			},
		],
	},
	{
		name: 'Kim',
		schedule: [
			{
				day: 'Sunday',
				time: '',
				positions: [],
			},
			{
				day: 'Monday',
				time: '',
				positions: [],
			},
		],
	},
]);

// Show Options
const selectEmployee = (employee) => {
	selectedEmployee.value = employee.name;
	selectedSchedule.value = employee.schedule;
	showOptions.value = true;
};

// Show New Schedule Dialog
const showNewScheduleDialog = () => {
	newScheduleDialog.value = true;
};

// Cancel New Schedule Dialog
const cancelNewScheduleDialog = () => {
	newScheduleDialog.value = false;
	startDate.value = '';
	endDate.value = '';
	scheduleDates.value = [];
};

// Reset Employee Data


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
	'7:00 am - 4:00 pm',
	'6:00 am - 3:00 pm',
	'8:00 am - 5:00 pm',
	'12:00 pm - 9:00 pm',
	'2:00 pm - 9:00 pm',
	'4:00 pm - 9:00 pm',
	'9:00 am - 6:00 pm',
	'3:30 pm - 9:30 pm',
	'4:00 pm -9:30 pm',
	'6:00 am - 5:00 pm',
	'7:00 am - 3:00 pm',
	'12:30 pm - 9:30 pm',
	'OFF',
	'NOT AVAILABLE',
	'VACATION',
];
</script>

<style></style>
