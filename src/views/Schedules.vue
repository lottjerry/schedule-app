<template>
	<div class="mt-16 pt-16">
		<v-overlay :model-value="isLoading" class="align-center justify-center">
			<v-progress-circular
				color="primary"
				indeterminate
				size="64"
			></v-progress-circular>
		</v-overlay>
		<div class="d-flex justify-center ma-10">
			<v-btn @click="showNewScheduleDialog" color="primary">
				New Schedule
			</v-btn>
		</div>

		<!-- ******* NEW SCHEDULE DIALOG DESKTOP ******* -->
		<v-dialog
			class="hidden-sm-and-down"
			v-model="newScheduleDialog"
			persistent
			fullscreen
			:scrim="false"
			transition="dialog-bottom-transition"
		>
			<v-app-bar density="compact" class="custom_margin2">
				<v-app-bar-title class="text-primary"> New Schedule </v-app-bar-title>
				<div>
					<v-btn
						@click="cancelNewScheduleDialog"
						color="primary"
						variant="outlined"
						elevation="1"
						class="ma-1"
					>
						Cancel
					</v-btn>
					<v-btn
						@click="createSchedule"
						color="primary"
						variant="outlined"
						elevation="1"
						class="ma-1"
					>
						Create Schedule
					</v-btn>
				</div>
			</v-app-bar>
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
				</v-card-text>
				<v-card-text>
					<v-container>
						<v-row class="justify-center">
							<v-col cols="1" class="justify-center">
								<p>Schedule Status</p>
								<v-switch
									color="indigo-darken-3"
									value="indigo-darken-3"
									class="justify-center"
									v-model="scheduleStatus"
									hide-details
									true-value="Next"
									false-value="Current"
									:label="scheduleStatus"
								></v-switch
							></v-col>
						</v-row>
					</v-container>
				</v-card-text>

				<!-- ******* SCHEDULE PREVIEW DESKTOP ******* -->
				<v-card-text class="hidden-sm-and-down">
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
			</v-card>

			<!-- ******* EDIT EMPLOYEE SCHEDULE DESKTOP ******* -->
			<v-dialog
				v-model="showEmployeeSchedule"
				width="30%"
				persistent
				class="hidden-sm-and-down"
			>
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

		<!-- *********************************************************** -->

		<!-- ******* NEW SCHEDULE DIALOG MOBILE ******* -->
		<v-dialog
			class="hidden-md-and-up"
			v-model="newScheduleDialog"
			persistent
			fullscreen
			:scrim="false"
			transition="dialog-bottom-transition"
		>
			<v-app-bar density="compact" class="custom_margin">
				<v-app-bar-title class="text-primary text-button">
					New Schedule
				</v-app-bar-title>
				<div>
					<v-btn
						@click="cancelNewScheduleDialog"
						color="primary"
						variant="outlined"
						elevation="1"
						class="text-caption ma-1"
						density="compact"
					>
						Cancel
					</v-btn>
					<v-btn
						@click="createSchedule"
						color="primary"
						variant="outlined"
						elevation="1"
						class="text-caption ma-1"
						density="compact"
					>
						Create Schedule
					</v-btn>
				</div>
			</v-app-bar>

			<v-card d-flex justify-center align-center>
				<v-card-text>
					<Datepicker
						class="justify-center pt-16 mt-16"
						v-model="date"
						week-picker
						week-start="0"
						inline
						auto-apply
					/>
				</v-card-text>
				<v-card-text>
					<v-container>
						<v-row class="justify-center">
							<v-col cols="6" class="justify-center">
								<p>Schedule Status</p>
								<v-switch
									color="indigo-darken-3"
									value="indigo-darken-3"
									class="justify-center"
									v-model="scheduleStatus"
									hide-details
									true-value="Next"
									false-value="Current"
									:label="scheduleStatus"
								></v-switch
							></v-col>
						</v-row>
					</v-container>
				</v-card-text>
				<!-- ******* SCHEDULE PREVIEW MOBILE ******* -->
				<v-card-text>
					<v-row>
						<v-col
							><v-card
								flat
								color="transparent"
								v-for="(scheduleDate, index) in scheduleDates"
								:key="scheduleDate"
								width="350px"
								class="mx-auto"
							>
								<v-container class="mb-4">
									<v-row>
										<p>{{ days[index] }} - {{ scheduleDate }}</p>
									</v-row>
									<v-row
										v-for="employee in employees"
										:key="employee"
										class="border rounded-xl mb-1"
									>
										<v-container>
											<v-row>
												<v-col cols="5"
													><v-btn
														variant="plain"
														class="text-caption"
														@click="selectEmployee(employee)"
													>
														{{ employee.name }}
													</v-btn></v-col
												>
												<div
													class="text-caption"
													v-for="employeeSchedule in employee.schedule"
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
				</v-card-text>
			</v-card>

			<!-- ******* EDIT EMPLOYEE SCHEDULE MOBILE ******* -->
			<v-dialog
				v-model="showEmployeeSchedule"
				persistent
				class="hidden-md-and-up"
			>
				<v-card>
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

		<!-- ******* SCHEDULE LIST ******* -->
		<v-container>
			<v-row class="justify-center">
				<h2>Schedules</h2>
			</v-row>
			<!-- Desktop View -->
			<v-row
				v-for="schedule in schedules"
				:key="schedule"
				class="pa-5 mx-10 my-5 justify-center hidden-sm-and-down"
				><v-card width="30%">
					<v-container class="border">
						<v-row>
							<v-col cols="8"
								><p>{{ schedule.name }} - {{ schedule.status }}</p></v-col
							>
							<v-col
								><v-btn
									text
									color="primary"
									variant="outlined"
									@click="deleteDocument(schedule.name)"
								>
									Delete
								</v-btn></v-col
							>
						</v-row>
					</v-container>
				</v-card></v-row
			>
			<!-- Mobile View -->
			<v-row
				v-for="schedule in schedules"
				:key="schedule"
				class="justify-center hidden-md-and-up"
				><v-card flat color="transparent" width="350px">
					<v-container class="border rounded-xl my-3">
						<v-row>
							<v-col
								><p>{{ schedule.name }} - {{ schedule.status }}</p></v-col
							>
							<v-col
								><v-btn
									text
									color="primary"
									variant="outlined"
									@click="deleteDocument(schedule.name)"
								>
									Delete
								</v-btn></v-col
							>
						</v-row>
					</v-container>
				</v-card></v-row
			>
		</v-container>

		<div></div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import {
	doc,
	setDoc,
	getFirestore,
	getDocs,
	query,
	collection,
	deleteDoc,
} from 'firebase/firestore';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const db = getFirestore();
const isLoading = ref(false);
const newScheduleDialog = ref(false);
const showEmployeeSchedule = ref(false);
const date = ref('');
const startDate = ref('');
const endDate = ref('');
let selectedEmployee = ref('');
let selectedSchedule = ref([]);
let scheduleStatus = ref('');
let schedules = ref([]);
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

const fetchSchedules = async () => {
	isLoading.value = true;
	const querySnap = await getDocs(query(collection(db, 'Schedules')));

	// Clear the schedules array before populating it
	schedules.value = [];
	// Add each doc's "name" field to the schedules array
	querySnap.forEach((doc) => {
		schedules.value.push(doc.data());
	});
	isLoading.value = false;
};

const deleteDocument = async (id) => {
	isLoading.value = true;
	try {
		await deleteDoc(doc(db, 'Schedules', id));
		isLoading.value = false;
		alert(id + ' Deleted!');
		fetchSchedules();
	} catch (error) {
		isLoading.value = false;
		console.log(error);
	}
};

const createSchedule = async () => {
	//const scheduleTitle = `${startDate.value} - ${endDate.value}`;
	// Replace 'employees' with your Firestore collection name
	isLoading.value = true;
	createDocument();

	for (const employee of employees.value) {
		try {
			await setDoc(
				doc(db, 'Schedules', endDate.value, endDate.value, employee.name),
				{
					name: employee.name,
					schedule: employee.schedule.map((day) => ({
						day: day.day,
						time: day.time,
						positions: day.positions,
					})),
				},
				{ merge: true }
			);
		} catch (error) {
			isLoading.value = false;
			console.error(`Error adding employee ${employee.name}:`, error);
		}
	}
	isLoading.value = false;
	alert(`New Schedule with end date ${endDate.value} has been made`);
	cancelNewScheduleDialog();
	fetchSchedules();
};

const createDocument = async () => {
	// Generate a custom document ID or use an existing one
	const customDocumentID = endDate.value; // Replace 'your_custom_id' with the ID you want to assign

	try {
		// Specify the custom document ID when creating the endDate document
		const endDateDocRef = doc(db, 'Schedules', customDocumentID);

		await setDoc(
			endDateDocRef,
			{
				// Include other data for the endDate document
				name: endDate.value, // Modify this as needed
				status: scheduleStatus.value,
			},
			{ merge: true }
		);

		console.log(
			(isLoading.value = false`EndDate document added to Firestore with ID: ${customDocumentID}`)
		);
	} catch (error) {
		console.error('Error adding endDate document:', error);
	}
};

// Show Employee Schedule Dialog
const selectEmployee = (employee) => {
	isLoading.value = true;
	selectedEmployee.value = employee.name;
	selectedSchedule.value = employee.schedule;
	showEmployeeSchedule.value = true;
	isLoading.value = false;
};

// Clear Employee Schedule Data
const clearEmployeeData = () => {
	isLoading.value = true;
	for (let employee of employees.value) {
		for (let schedule of employee.schedule) {
			schedule.time = null;
			schedule.positions = [];
		}
	}
	isLoading.value = false;
};

// Save Employee Data
const saveEmployeeData = () => (showEmployeeSchedule.value = false);
isLoading.value = true;
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
	isLoading.value = false;
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

onMounted(() => {
	fetchSchedules();
});

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

<style scoped>
.custom_margin {
	margin-top: -25%;
}

.custom_margin2 {
	margin-top: -2.5%;
}
</style>
