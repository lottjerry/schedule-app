import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login';
import Home from '@/views/Home';
import Users from '@/views/Users';
import Schedules from '@/views/Schedules';
import PageNotFound from '@/views/PageNotFound';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
	{
		path: '/users',
		name: 'users',
		component: Users,
		meta: {
			requiresAuth: true,
			requiresAdmin: true,
		},
	},
	{
		path: '/schedules',
		name: 'schedules',
		component: Schedules,
		meta: {
			requiresAuth: true,
			requiresAdmin: true,
		},
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'pagenotfound',
		component: PageNotFound,
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

async function getUserRole(userId) {
	const db = getFirestore();
	const userRef = doc(db, 'users', userId);
	const userDoc = await getDoc(userRef);
	if (userDoc.exists()) {
		return userDoc.data().role;
	} else {
		throw new Error('User not found');
	}
}

router.beforeEach(async (to, from, next) => {
	if (to.name === 'login') {
		if (await getCurrentUser()) {
			next('/home');
		} else {
			next();
		}
	} else if (to.matched.some((record) => record.meta.requiresAdmin)) {
		const currentUser = await getCurrentUser();
		if (currentUser) {
			const userRole = await getUserRole(currentUser.uid);
			if (userRole === 'admin') {
				next();
			} else {
				next('/home');
			}
		} else {
			next('/');
		}
	} else {
		next();
	}
});

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
