import { createRouter, createWebHistory } from "vue-router";
import Login from '@/views/Login'
import Schedules from '@/views/Schedules'

const routes = [
	{
		path: '/',
		name: 'login',
		component: Login,
	},
	{
		path: '/schedules',
		name: 'schedules',
		component: Schedules,
	},

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
