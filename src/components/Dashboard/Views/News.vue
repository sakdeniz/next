<template>

<div class="content">
	<div class="container-fluid">
		<h4 class="card-title"><i class="ion-social-rss"></i> News</h4>
			<div class="ui grid">
				<div class="two column only row">
					<div class="column ui" style="margin-bottom:20px" :key=item.id v-for="item of communitySiteNews" v-if="!filter || item.category==filter">
						<div class="ui segment">
							<div class="image">
								<img v-bind:src="item.news_image">
							</div>
						<div class="content">
							<h4 style='margin-top:5px;'>{{item.news_title}}</h4>
							<div class="description">{{item.news_content}}</div>
						</div>
						<br>
						<div class="extra content">
							<span style="float:right">
								<a class="ui violet label"><i class="ion-bookmark"></i>&nbsp;{{item.news_category_name}}</a>
							</span>
							<span style="float:right">
								<a class="ui gray label"><i class="ion-person"></i>&nbsp;{{item.news_author}}</a>&nbsp;
							</span>
							<span>
								<a style="color:#795BB6"><i class="ion-calendar"></i>&nbsp;{{item.news_dt}}</a>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import {
  mapState,
  mapActions
} from 'vuex';
import moment from "moment";
export default {
  computed: {
    ...mapState({
      communitySiteNews: 'communitySiteNews'
    })
  },
  components: {},
  created: function() {
    this.getCommunitySiteNews();
  },
  beforeDestroy: function() {
    //clearInterval(this.getitemInterval);
  },
  methods: {
    formatTime: function(time) {
      return moment.unix(time).format("MM/DD/YYYY HH:MM:SS");
    },
    filterBy: function(f) {
      this.filter = f;
      this.getCommunitySiteNews();
    },
    ...mapActions({
      getCommunitySiteNews: 'getCommunitySiteNews',
    })
  }
};
</script>
