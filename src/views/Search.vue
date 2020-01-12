<template>
	<div>
		<v-form @submit.prevent="submit()">
			<v-container>
				<v-row>
					<v-col cols="8" md="4">
						<v-text-field v-model="search.text" label="Search In Youtube" required></v-text-field>
					</v-col>

					<v-col cols="4" md="4">
						<v-btn type="submit" class="mt-4 mr-4" color="primary">Search</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-form>

		<v-container class="grey lighten-5">
			<v-row v-if="results.length">
				<v-col cols="12" md="4" sm="6" v-for="result in results" :key="result.id.videoId">
					<v-card class="mx-auto" max-width="400">
						<v-img class="white--text align-end" height="200px" :src="result.snippet.thumbnails.high.url">
							<v-card-title>{{ result.snippet.title }}</v-card-title>
						</v-img>

						<v-card-text class="text--primary">
							<div>{{ _.truncate(result.snippet.description, { length: 100 }) }}</div>
						</v-card-text>

						<v-card-actions>
							<v-btn color="primary" text @click="open_Video(result)"> Watch Video </v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
			</v-row>

			<v-row v-if="pagination.active">
				<v-col cols="12">
					<v-btn color="primary" text v-if="pagination.prevPageToken" @click="submit({ pageToken: pagination.prevPageToken })"> Back </v-btn>
					<v-btn color="primary" text v-if="pagination.nextPageToken" @click="submit({ pageToken: pagination.nextPageToken })"> Next </v-btn>
				</v-col>
			</v-row>
		</v-container>

		<v-dialog v-model="dialog" max-width="600" v-if="selected_video">
			<v-card>
				<v-card-title class="headline">{{ selected_video.snippet.title }}</v-card-title>

				<v-card-text>
					<iframe width="560" height="315" :src="'https://www.youtube.com/embed/' + selected_video.id.videoId + '?autoplay=1'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import _ from 'lodash'
import qs from 'querystring'

export default {
	data() {
		return {
			search: {
				API_KEY: process.env.VUE_APP_GOOGLE_API_KEY,
				text: null
			},
			results: [],
			dialog: false,
			selected_video: null,
			pagination: {
				active: false,
				page: 1,
				total: 1,
				nextPageToken: null,
				prevPageToken: null
			}
		};
	},

	watch: {
		dialog(val) {
			if(val === false) {
				this.selected_video = null;
			}
		},
	},

	methods: {
		submit(args) {
			/* https://www.googleapis.com/youtube/v3/search?part=snippet&q=[SEARCH]&type=video&key=[YOUR_API_KEY] */

			if(this.search.text === '' || this.search.text === null) {
				alert('Search text field is required.');

				return false;
			}

			if(typeof args === "undefined") {
				args = {}
			}

			var URL = "https://www.googleapis.com/youtube/v3/search";
			var defaults = {
				part: "snippet",
				q: this.search.text, 
				type: "video",
				key: this.search.API_KEY,
				maxResults: 6
			}
			
			let params = qs.stringify(_.merge(defaults, args));

			this.$http({
				method: 'GET',
				url: URL + '?' + params, 
			}).then(res => {
				this.results = res.data.items;

				let totalPage = res.data.pageInfo.totalResults / res.data.pageInfo.resultsPerPage;
				let pagingActive = totalPage > 1 ? true : false;
				let nextPageToken = res.data.nextPageToken ? res.data.nextPageToken : null;
				let prevPageToken = res.data.prevPageToken ? res.data.prevPageToken : null;

				this.pagination = {
					active: pagingActive,
					page: 1,
					total: totalPage,
					nextPageToken: nextPageToken,
					prevPageToken: prevPageToken
				}
			});
		},

		open_Video(result) {
			this.dialog = true;
			this.selected_video = result;
		}
	}
};
</script>
