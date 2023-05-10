<template>
	<nav>
		<v-app-bar>
			<v-app-bar-title>Schedule App</v-app-bar-title>
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
		</v-app-bar>
	</nav>
</template>

<script>
export default {
	data: () => ({
		items: [
			{ title: 'Schedules' },
			{ title: 'Profile' },
			{ title: 'Log out' },
		],
	}),
};
</script>
