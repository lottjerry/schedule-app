import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login';
import Home from '@/views/Home';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const routes = [
	{
		path: '/',
		name: 'login',
		component: Login,
	},
	{
		path: '/home',
		name: 'home',
		component: Home,
		meta: {
			requiresAuth: true,
		},
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

const getCurrentUser = () => {
	return new Promise((resolve, reject) => {
		const removeListener = onAuthStateChanged(
			getAuth(),
			(user) => {
				removeListener();
				resolve(user);
			},
			reject
		);
	});
};

router.beforeEach(async (to, from, next) => {
if (to.name === 'login') {
	if (await getCurrentUser()) {
		next('/home');
	} else {
		next();
	}
} else if (to.matched.some((record) => record.meta.requiresAuth)) {
	if (await getCurrentUser()) {
		next();
	} else {
		next('/');
	}
} else {
	next();
}
});


export default router;
