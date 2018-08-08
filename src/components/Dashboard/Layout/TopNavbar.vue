<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="#"><div><img style="width:48px;height:auto;" v-bind:src="coin.logo" v-bind:title="coin.name"></div></a>
	  &nbsp;&nbsp;&nbsp;
	  	<sui-dropdown icon="ion-arrow-down-b" class="labeled icon gray tiny button floating">
		{{coin.name}}
		<sui-dropdown-menu>
			<sui-dropdown-item v-bind:class=v[0].icon_class v-for="(v, k, i) in coins['Coins']" v-on:click="changecoin(k)">  {{v[0].name}} / {{v[0].symbol}}</sui-dropdown-item>
			</sui-dropdown-menu>
		</sui-dropdown>
        <sui-dropdown icon="ion-navicon-round" class="icon tiny gray" text="" button floating style="margin-right:10px;">
          <sui-dropdown-menu>
            <router-link to="/admin/console" tag="sui-dropdown-item"><i class="ion-code"></i>&nbsp;Console</router-link>
            <router-link to="/admin/logs" tag="sui-dropdown-item"><i class="ion-ios-paper-outline"></i>&nbsp;Logs</router-link>
            <router-link to="/admin/peer-list" tag="sui-dropdown-item"><i class="ion-radio-waves"></i>&nbsp;Peer List</router-link>
            <router-link to="/admin/softforks" tag="sui-dropdown-item"><i class="ion-fork-repo"></i>&nbsp;Soft Forks</router-link>
            <router-link to="/admin/merchants" tag="sui-dropdown-item"><i class="ion-earth"></i>&nbsp;Merchants</router-link>
          </sui-dropdown-menu>
        </sui-dropdown>
      <button type="button"
              class="navbar-toggler navbar-toggler-right"
              :class="{toggled: $sidebar.showSidebar}"
              aria-controls="navigation-index"
              aria-expanded="false"
              aria-label="Toggle navigation"
              @click="toggleSidebar">
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>
      <div class="collapse navbar-nav navbar-collapse justify-content-end">
		<span style="font-size:24px;color:#bbbbbb;">
		<a v-if="coin.social_youtube_url" class="external" style="color:#bbbbbb;margin-right:10px;" title="Youtube" target="_blank" v-bind:href="coin.social_youtube_url"><i class="ion-social-youtube"></i></a>
		<a v-if="coin.social_facebook_url" class="external" style="color:#bbbbbb;margin-right:10px;" title="Facebook" target="_blank" v-bind:href="coin.social_facebook_url"><i class="ion-social-facebook"></i></a>
		<a v-if="coin.social_twitter_url" class="external" style="color:#bbbbbb;margin-right:10px;" title="Twitter" target="_blank" v-bind:href="coin.social_twitter_url"><i class="ion-social-twitter"></i></a>
		<a v-if="coin.social_github_url" style="color:#bbbbbb;margin-right:10px;" title="Github" target="_blank" v-bind:href="coin.social_github_url"><i class="ion-social-github"></i></a>
		<a v-if="coin.social_reddit_url" style="color:#bbbbbb;margin-right:10px;" title="Reddit" target="_blank" v-bind:href="coin.social_reddit_url"><i class="ion-social-reddit"></i></a>
		<a v-if="coin.social_instagram_url" class="external" style="color:#bbbbbb;margin-right:10px;" title="Instagram" target="_blank" v-bind:href="coin.social_instagram_url"><i class="ion-social-instagram"></i></a>
		</span>
      </div>
    </div>
  </nav>
</template>
<script>
import Vue from "vue";
import {
  mapState,
  mapActions
} from "vuex";

  export default {
    computed: {
      routeName () {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      },
    ...mapState({
      coin: "coin",
      coins: "coins",
    })
    },
    data () {
      return {
        activeNotifications: false
      }
    },
    methods: {
    changecoin: function(coin) {
	  clearInterval(this.timer);
      swal({
        onOpen: () => {
          swal.showLoading()
        },
        allowOutsideClick: false,
        text: 'Changing coin to ' + coin + ' ...'
      });
      console.log("next:coin:"+coin);
    },
      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown () {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown () {
        this.activeNotifications = false
      },
      toggleSidebar () {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar () {
        this.$sidebar.displaySidebar(false)
      }
    }
  }
</script>
<style>

</style>
