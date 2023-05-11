<template>
	<v-app>
		<Navbar />
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