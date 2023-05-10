<template>
	<nav>
		<v-toolbar app>
			<v-app-bar-title>Schedule App</v-app-bar-title>
				<v-btn to="/"> Login </v-btn>
			<!-- dropdown menu -->
			<v-menu location="bottom">
				<template v-slot:activator="{ props }">
					<v-btn variant="tonal" v-bind="props">Jerry</v-btn>
				</template>

				<v-list>
					<v-list-item v-for="(item, i) in items" :key="i">
						<v-list-item-title>{{ item.title }}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-toolbar>
		<router-view></router-view>
	</nav>
</template>

<script>
export default {
	data: () => ({
		items: [{ title: 'Schedules' }, { title: 'Profile' }, { title: 'Log out' }],
	}),
};
</script>
