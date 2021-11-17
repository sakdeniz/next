<template>
<div class="content">
  <div class="container-fluid">
		<h4>Meet The Community</h4>
		<h3>Social Media</h3>
		<span style="font-size:24px;color:#bbbbbb;">
		<a v-if="coin.social_youtube_url" class="external" style="color:red;margin-right:30px;" title="Youtube" target="_blank" v-bind:href="coin.social_youtube_url"><i class="ion-social-youtube" style="font-size:120px"></i></a>
		<a v-if="coin.social_facebook_url" class="external" style="color:#3B5998;margin-right:30px;" title="Facebook" target="_blank" v-bind:href="coin.social_facebook_url"><i class="ion-social-facebook" style="font-size:120px"></i></a>
		<a v-if="coin.social_twitter_url" class="external" style="color:#1da1f2;margin-right:30px;" title="Twitter" target="_blank" v-bind:href="coin.social_twitter_url"><i class="ion-social-twitter" style="font-size:120px"></i></a>
		<a v-if="coin.social_github_url" style="color:#333;margin-right:30px;" title="Github" target="_blank" v-bind:href="coin.social_github_url"><i class="ion-social-github" style="font-size:120px"></i></a>
		<a v-if="coin.social_reddit_url" style="color:#ff4500;margin-right:30px;" title="Reddit" target="_blank" v-bind:href="coin.social_reddit_url"><i class="ion-social-reddit" style="font-size:120px"></i></a>
		<a v-if="coin.social_instagram_url" class="external" style="color:#405de6;margin-right:30px;" title="Instagram" target="_blank" v-bind:href="coin.social_instagram_url"><i class="ion-social-instagram" style="font-size:120px"></i></a>
		<a v-if="coin.social_discord" class="external" style="color:#405de6;margin-right:30px;" title="Instagram" target="_blank" v-bind:href="coin.social_discord"><i class="ion-social-discord" style="font-size:120px"></i></a>
		</span>
		<h3>Other Resources</h3>
		<div class="ui massive nowrap vertical menu" style="width:400px">
			<a href="http://collab.navcoin.org" class="external item" target="_blank"><i class="ion-android-open"></i>&nbsp;NavCoin Collaboration Platform</a>
			<a href="http://forum.navcommunity.net" class="external item" target="_blank"><i class="ion-android-open"></i>&nbsp;NavCoin Community Forum</a>
			<a href="https://discord.gg/y4Vu9jw" class="external item" target="_blank"><i class="ion-android-open"></i>&nbsp;Discord</a>
			<a href="https://t.me/navcoin" class="external item" target="_blank"><i class="ion-android-open"></i>&nbsp;Telegram</a>
			<a href="http://medium.com/nav-coin" class="external item" target="_blank"><i class="ion-android-open"></i>&nbsp;Medium</a>
		</div>
  </div>
</div>
</template>
<script>
import StatsCard from "../../UIComponents/Cards/StatsCard.vue";
import Vue from "vue";
import {
  mapState,
  mapActions
} from "vuex";


export default {
  name: "Overview",
  components: {
    StatsCard
  },
  computed: {
    ...mapState({
      coin: "coin",
    })
  },
  created: function() {
	let vm=this;
	this.getCoin();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions({
      getCoin: "getCoin",
    }),
    }
}
</script>