<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="#"><div><img style="width:128px;height:auto;" src="static/img/nav-logo-extended.png"></div></a>
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
        <sui-dropdown icon="ion-navicon-round" class="icon tiny gray" text="" button floating>
          <sui-dropdown-menu>
            <router-link to="/admin/console" tag="sui-dropdown-item"><i class="ion-code"></i>&nbsp;Console</router-link>
            <router-link to="/admin/logs" tag="sui-dropdown-item"><i class="ion-ios-paper-outline"></i>&nbsp;Logs</router-link>
            <router-link to="/admin/peer-list" tag="sui-dropdown-item"><i class="ion-radio-waves"></i>&nbsp;Peer List</router-link>
            <router-link to="/admin/softforks" tag="sui-dropdown-item"><i class="ion-fork-repo"></i>&nbsp;Soft Forks</router-link>
            <router-link to="/admin/merchants" tag="sui-dropdown-item"><i class="ion-earth"></i>&nbsp;Merchants</router-link>
          </sui-dropdown-menu>
        </sui-dropdown>&nbsp;&nbsp;&nbsp;
		<span style="font-size:24px;color:#bbbbbb;">
		<a class="external" style="color:#bbbbbb;" title="Youtube" target="_blank" href="https://www.youtube.com/channel/UCjDs4JceVSsaeCyvkA9cWCg"><i class="ion-social-youtube"></i></a>&nbsp;&nbsp;&nbsp;
		<a class="external" style="color:#bbbbbb;" title="Facebook" target="_blank" href="https://www.facebook.com/navcoin"><i class="ion-social-facebook"></i></a>&nbsp;&nbsp;&nbsp;
		<a class="external" style="color:#bbbbbb;" title="Twitter" target="_blank" href="https://www.twitter.com/navcoin"><i class="ion-social-twitter"></i></a>&nbsp;&nbsp;&nbsp;
		<a style="color:#bbbbbb;" title="Github" target="_blank" href="https://www.github.com/navcoin"><i class="ion-social-github"></i></a>&nbsp;&nbsp;&nbsp;
		<a style="color:#bbbbbb;" title="Reddit" target="_blank" href="https://www.reddit.com/r/NavCoin/"><i class="ion-social-reddit"></i></a>&nbsp;&nbsp;&nbsp;
		<a class="external" style="color:#bbbbbb;" title="Instagram" target="_blank" href="https://www.instagram.com/navcore"><i class="ion-social-instagram"></i></a>&nbsp;&nbsp;&nbsp;
		</span>

      </div>
    </div>
  </nav>
</template>
<script>
  export default {
    computed: {
      routeName () {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      }
    },
    data () {
      return {
        activeNotifications: false
      }
    },
    methods: {
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
