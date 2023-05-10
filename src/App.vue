<template>
	<v-app>
		<Navbar />
		<!--
		<v-toolbar color="#616161" class="">
			<v-btn to="/"> Home </v-btn>
			<v-btn to="/about"> About </v-btn>
		</v-toolbar>
		<router-view></router-view>
		-->
	</v-app>
</template>

<script>
import Navbar from './components/Navbar'
export default {
	components: {
		Navbar
	},
	name: 'App',
	data() {
		return {};
	},
};
</script>

<style>
	html { overflow-y: auto !important}
</style>