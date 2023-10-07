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
			persistent
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
						class="justify-center"
						v-model="date"
						week-picker
						week-start="0"
						inline
						auto-apply
					/>
					<!-- 
					<div v-if="startDate" class="justify-center border">
						<p>Start Date: {{ startDate }}</p>
						<p>End Date: {{ endDate }}</p>
					</div>
					-->
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
						@click="cancelNewScheduleDialog"
						color="primary"
						variant="outlined"
						elevation="1"
					>
						Cancel
					</v-btn>
					<v-btn
						@click="createSchedule"
						color="primary"
						variant="outlined"
						elevation="1"
					>
						Create Schedule
					</v-btn>
				</v-card-actions>
			</v-card>

			<!-- ******* EDIT EMPLOYEE SCHEDULE ******* -->
			<v-dialog v-model="showEmployeeSchedule" width="30%" persistent>
				<v-card width="80%" class="pa-10 ma-5">
					<v-card-title primary-title>
						Employee: {{ selectedEmployee }}</v-card-title
					>
					<v-card-item v-for="schedule in selectedSchedule" :key="schedule">
						<h4>{{ schedule.day }}</h4>
						<v-combobox
							class="pa-2"
							clearable
							v-model="schedule.time"
							chips
							density="compact"
							label="Select Time"
							:items="options"
							variant="outlined"
						></v-combobox>
						<v-combobox
							class="pa-2"
							clearable
							v-model="schedule.positions"
							multiple
							chips
							density="compact"
							label="Select Positions"
							:items="positions"
							variant="outlined"
						></v-combobox>
					</v-card-item>
					<v-card-actions class="justify-center">
						<v-btn
							@click="cancelEmployeeSchedule"
							color="primary"
							variant="outlined"
							class="mr-5"
							>Cancel</v-btn
						>
						<v-btn @click="saveEmployeeData" color="primary" variant="outlined"
							>Save</v-btn
						>
					</v-card-actions>
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
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const db = getFirestore();

const newScheduleDialog = ref(false);
const showEmployeeSchedule = ref(false);
const date = ref('');
const startDate = ref('');
const endDate = ref('');
let selectedEmployee = ref('');
let selectedSchedule = ref([]);
const scheduleDates = ref([]); // To store the array of dates
const employees = ref([
	{
		name: 'KELLY',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'KIM',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'EMILY',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'KRISTEN',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'LEXIE',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'ANN',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'KAREN',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'ALISON',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'JENNIFER',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'MARGARET',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'MADDIE',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'MORGAN',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'SIDNEY',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'KATLYN',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'GAVIN',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'JOHN',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'WES',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'TRISTAN',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'ISAAC',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'GREGORY',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'DAYNE',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'CONNER',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'ISIAH',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'WILLIAM',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'CHRIS',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'JERRY',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'JACK',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
	{
		name: 'LANCE',
		schedule: [
			{
				day: 'Sunday',
				time: null,
				positions: [],
			},
			{
				day: 'Monday',
				time: null,
				positions: [],
			},
			{
				day: 'Tuesday',
				time: null,
				positions: [],
			},
			{
				day: 'Wednesday',
				time: null,
				positions: [],
			},
			{
				day: 'Thursday',
				time: null,
				positions: [],
			},
			{
				day: 'Friday',
				time: null,
				positions: [],
			},
			{
				day: 'Saturday',
				time: null,
				positions: [],
			},
		],
	},
]);

const createSchedule = async () => {
	const scheduleTitle = `${startDate.value} - ${endDate.value}`;
	//const employeesCollection = collection(db, endDate.value); // Replace 'employees' with your Firestore collection name

	for (const employee of employees.value) {
		try {
			await setDoc(doc(db, scheduleTitle, employee.name), {
				name: employee.name,
				schedule: employee.schedule.map((day) => ({
					day: day.day,
					time: day.time,
					positions: day.positions,
				})),
			});
			console.log(`Employee ${employee.name} added to Firestore`);
		} catch (error) {
			console.error(`Error adding employee ${employee.name}:`, error);
		}
	}
	alert(`New Schedule with end date ${endDate.value} has been made`);
	cancelNewScheduleDialog();
};

// Show Employee Schedule Dialog
const selectEmployee = (employee) => {
	selectedEmployee.value = employee.name;
	selectedSchedule.value = employee.schedule;
	showEmployeeSchedule.value = true;
};

// Clear Employee Schedule Data
const clearEmployeeData = () => {
	for (let employee of employees.value) {
		for (let schedule of employee.schedule) {
			schedule.time = null;
			schedule.positions = [];
		}
	}
};

// Save Employee Data
const saveEmployeeData = () => (showEmployeeSchedule.value = false);

// Cancel Employee Schedule Dialog
const cancelEmployeeSchedule = () => {
	// Clear the selected employee's time and positions
	if (selectedEmployee.value) {
		const selectedEmployeeIndex = employees.value.findIndex(
			(employee) => employee.name === selectedEmployee.value
		);
		if (selectedEmployeeIndex !== -1) {
			const selectedEmployeeSchedule =
				employees.value[selectedEmployeeIndex].schedule;
			for (let schedule of selectedEmployeeSchedule) {
				schedule.time = null;
				schedule.positions = [];
			}
		}
	}
	showEmployeeSchedule.value = false;
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
	clearEmployeeData();
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
