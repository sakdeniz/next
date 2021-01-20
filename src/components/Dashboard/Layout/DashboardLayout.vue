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
      <sidebar-link to="/admin/swap">
        <i class="ion-loop"></i>
        <p>Swap</p>
      </sidebar-link>
      <sidebar-link to="/admin/transactions">
        <i class="ion-arrow-swap"></i>
        <p>Transactions</p>
      </sidebar-link>
      <sidebar-link v-if="coin.bool_support_staking=='1'" to="/admin/staking">
        <i class="ion-leaf"></i>
        <p>Staking</p>
      </sidebar-link>
      <!--<sidebar-link to="/admin/store">
        <i class="ion-bag"></i>
        <p>STORE</p>
      </sidebar-link>!-->
      <!--<sidebar-link to="/admin/games">
        <i class="ion-trophy"></i>
        <p>GAMES</p>
      </sidebar-link>!-->
      <sidebar-link v-if="coin.bool_support_community_fund=='1'" to="/admin/community-proposals">
        <i class="ion-erlenmeyer-flask"></i>
        <p>COMMUNITY FUND</p>
      </sidebar-link>
      <sidebar-link v-if="coin.bool_support_dao=='1'" to="/admin/dao">
        <i class="ion-code"></i>
        <p>DAO</p>
      </sidebar-link>
      <!--<sidebar-link to="/admin/news">
        <i class="ion-social-rss"></i>
        <p>NEWS</p>
      </sidebar-link>!-->
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
  import {
  mapState,
  mapActions
 } from "vuex";
  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu
    },
	computed: {
    ...mapState({
      coin: "coin",
    })
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
