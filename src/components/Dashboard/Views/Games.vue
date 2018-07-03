<template>

<div class="content">
	<div class="container-fluid">
		<h4 class="card-title"><i class="ion-trophy"></i> Games</h4>
			<div class="ui grid">
				<div class="two column only row">
					<div class="column ui" style="margin-bottom:20px" :key=item.id v-for="item of communitySiteGames">
						<div class="ui segment">
							<div class="image">
								<img v-bind:src="item.game_image">
							</div>
						<div class="content">
							<h4 style='margin-top:5px;'>{{item.game_name}}</h4>
						</div>
							<div class="extra content">
							<span style="float:right">
								<a target="_blank" class="ui btn large violet label" v-bind:href="item.game_url"></i>&nbsp;Play</a>
							</span>
						</div>
						<br>
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
      communitySiteGames: 'communitySiteGames'
    })
  },
  components: {},
  created: function() {
    this.getCommunitySiteGames();
  },
  methods: {
    ...mapActions({
      getCommunitySiteGames: 'getCommunitySiteGames',
    })
  }
};
</script>