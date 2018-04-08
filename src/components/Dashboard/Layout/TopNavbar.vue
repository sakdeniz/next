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
      <div class="collapse navbar-collapse justify-content-end">
        <span style="font-size:24px;color:#bbbbbb;">
		<a style="color:#bbbbbb;" title="Facebook" target="_blank" href="https://www.facebook.com/navcoin"><i class="ion-social-facebook"></i></a>&nbsp;&nbsp;&nbsp;
		<a style="color:#bbbbbb;" title="Twitter" target="_blank" href="https://www.twitter.com/navcoin"><i class="ion-social-twitter"></i></a>&nbsp;&nbsp;&nbsp;
		<a style="color:#bbbbbb;" title="Github" target="_blank" href="https://www.github.com/navcoin"><i class="ion-social-github"></i></a>&nbsp;&nbsp;&nbsp;
		<a style="color:#bbbbbb;" title="Reddit" target="_blank" href="https://www.reddit.com/r/NavCoin/"><i class="ion-social-reddit"></i></a>&nbsp;&nbsp;&nbsp;
		<a style="color:#bbbbbb;" title="Instagram" target="_blank" href="https://www.instagram.com/navcore"><i class="ion-social-instagram"></i></a>&nbsp;&nbsp;&nbsp;
		</span>
		<ul class="nav navbar-nav mr-auto" style="display:none">
          <li class="nav-item">
            <a class="nav-link" href="#" data-toggle="dropdown">
              <i class="nc-icon nc-palette"></i>
            </a>
          </li>
          <drop-down tag="li">
            <template slot="title">
              <i class="nc-icon nc-planet"></i>
              <b class="caret"></b>
              <span class="notification">5</span>
            </template>
            <a class="dropdown-item" href="#">Notification 1</a>
            <a class="dropdown-item" href="#">Notification 2</a>
            <a class="dropdown-item" href="#">Notification 3</a>
            <a class="dropdown-item" href="#">Notification 4</a>
            <a class="dropdown-item" href="#">Another notification</a>
          </drop-down>
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="nc-icon nc-zoom-split"></i>
              <span class="d-lg-block">&nbsp;Search</span>
            </a>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto" style="display:none">
          <li class="nav-item">
            <a class="nav-link" href="#">
              Account
            </a>
          </li>
          <drop-down title="Dropdown">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something</a>
            <div class="divider"></div>
            <a class="dropdown-item" href="#">Separated link</a>
          </drop-down>
          <li class="nav-item">
            <a href="#" class="nav-link">
              Log out
            </a>
          </li>
        </ul>
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
