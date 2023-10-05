<script setup>
import { ref } from 'vue';

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

const pos = ['office', 'cashier', 'stock', 'scan'];
</script>

<template>
	<div v-for="employee in employees" :key="employee">
		<h1>{{ employee.name }}</h1>
		<div v-for="s in employee.schedule" :key="s">
			<h3>{{ s.day }}</h3>
			<p>Time: {{ s.time }}</p>
			<p>Positions: {{ s.positions }}</p>
		</div>
	</div>

	<div v-for="employee in employees" :key="employee">
		<h1>{{ employee.name }}</h1>
		<div v-for="s in employee.schedule" :key="s">
			<h3>{{ s.day }}</h3>
			<label for="time">Time</label>
			<input v-model="s.time" id="time" />
			<div v-for="p in pos" :key="p" id="p">
				<label for="positions">{{ p }}</label>
				<input type="checkbox" v-model="s.positions" :value="p" />
			</div>
		</div>
	</div>
</template>
