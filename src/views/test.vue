<template>
	<div>
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
	</div>
</template>

<script>
export default {
	setup() {
		return {};
	},
};
</script>

<style lang="scss" scoped></style>
