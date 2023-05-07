<template>
	<v-app>
		<v-toolbar color="#616161" class="">
			<v-btn to="/"> Home </v-btn>
			<v-btn to="/about"> About </v-btn>
		</v-toolbar>
		<router-view></router-view>
	</v-app>
</template>

<script>
export default {
	name: 'App',
	data() {
		return {};
	},
};
</script>
