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


<!-- ******* EDIT EMPLOYEE SCHEDULE DESKTOP ******* -->
			<v-dialog v-model="showEmployeeSchedule" width="30%" persistent>
				<v-card width="80%" class="pa-10 ma-5 hidden-sm-and-down">
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
