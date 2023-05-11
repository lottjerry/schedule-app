import { createRouter, createWebHistory } from "vue-router";
import Login from '@/views/Login'
import Profile from '@/views/Profile'
import Schedule from '@/views/Schedule'

const routes = [
	{
		path: '/',
		name: 'login',
		component: Login,
	},
	{
		path: '/profile',
		name: 'profile',
		component: Profile,
	},
	{
		path: '/schedule',
		name: 'schedule',
		component: Schedule,
	},

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
