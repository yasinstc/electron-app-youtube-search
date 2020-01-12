<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<v-container>
				<div class="d-flex align-center">Search YouTube</div>
			</v-container>
		</v-app-bar>

		<v-content>
			<router-view></router-view>
		</v-content>
	</v-app>
</template>

<script>
export default {
	name: "App",

	components: {},

	data: () => ({
		//
	})
};
</script>
