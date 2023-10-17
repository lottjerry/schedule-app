<script setup>
import { ref } from 'vue'

const employees = ref([
{
		name: 'KELLY',
		schedule: [
			{
				day: 'Sunday',
				time: 4,
				positions: ['p1', 'p2'],
			},
			{
				day: 'Monday',
				time: 3,
				positions: ['p1', 'p2'],
			},
			{
				day: 'Tuesday',
				time: 3,
				positions: ['p1', 'p2'],
			},
			{
				day: 'Wednesday',
				time: 2,
				positions: ['p1', 'p2'],
			},
			{
				day: 'Thursday',
				time: 1,
				positions: ['p1', 'p2'],
			},
			{
				day: 'Friday',
				time: 0,
				positions: ['p1', 'p2'],
			},
			{
				day: 'Saturday',
				time: 4,
				positions: ['p1', 'p2'],
			},
		],
	},
	{
		name: 'KIM',
		schedule: [
			{
				day: 'Sunday',
				time: 14,
				positions: ['p3','p4'],
			},
			{
				day: 'Monday',
				time: 44,
				positions: ['p3','p4'],
			},
			{
				day: 'Tuesday',
				time: 55,
				positions: ['p3','p4'],
			},
			{
				day: 'Wednesday',
				time: 77,
				positions: ['p3','p4'],
			},
			{
				day: 'Thursday',
				time: 47,
				positions: ['p3','p4'],
			},
			{
				day: 'Friday',
				time: 47,
				positions: ['p3','p4'],
			},
			{
				day: 'Saturday',
				time: 444,
				positions: ['p3','p4'],
			},
		],
	},
])

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

<template>
<div v-for="day in days" :key="day" class="bor2">
<h1></h1>
<div v-for="employee in employees" :key="employee">
  <div class="bor">
  <p>Name: {{employee.name}}</p>
  <div v-for="schedule in employee.schedule" :key="schedule">
    <p>{{schedule.day}}</p>
	<p>{{schedule.time}}</p>
	<div v-for="position in schedule.positions" :key="position">
	<span>{{position}}</span>
	</div>
  </div>
  </div>
</div>
</div>

</template>

<style>
.bor {
border: 2px solid red;
padding: 10px;
margin: 10px;
}
.bor2 {
border: 2px dotted green;
padding: 10px;
margin: 10px;
}
</style>