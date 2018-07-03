<template>
  <div class="wrapper">
	<side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/admin/overview">
        <i class="ion-home"></i>
        <p>Home</p>
      </sidebar-link>
      <sidebar-link to="/admin/send">
        <i class="ion-paper-airplane"></i>
        <p>Send</p>
      </sidebar-link>
      <sidebar-link to="/admin/receive">
        <i class="ion-archive"></i>
        <p>Receive</p>
      </sidebar-link>
      <sidebar-link to="/admin/transactions">
        <i class="ion-arrow-swap"></i>
        <p>Transactions</p>
      </sidebar-link>
      <sidebar-link to="/admin/staking">
        <i class="ion-leaf"></i>
        <p>Staking</p>
      </sidebar-link>
      <sidebar-link to="/admin/store">
        <i class="ion-bag"></i>
        <p>STORE</p>
      </sidebar-link>
      <sidebar-link to="/admin/games">
        <i class="ion-trophy"></i>
        <p>GAMES</p>
      </sidebar-link>
      <sidebar-link to="/admin/community-proposals">
        <i class="ion-erlenmeyer-flask"></i>
        <p>COMMUNITY FUND</p>
      </sidebar-link>
      <sidebar-link to="/admin/block-explorer">
        <i class="ion-android-search"></i>
        <p>BLOCK EXPLORER</p>
      </sidebar-link>
      <sidebar-link to="/admin/news">
        <i class="ion-social-rss"></i>
        <p>NEWS</p>
      </sidebar-link>
      <sidebar-link to="/admin/settings">
        <i class="ion-gear-a"></i>
        <p>SETTINGS</p>
      </sidebar-link>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './MobileMenu.vue'
  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu
    },
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      }
    }
  }

</script>
