<template>
  <footer class="footer">
    <div class="container-fluid">
      <nav>
        <ul class="footer-menu">
          <li>
            <router-link :to="{path:'/admin'}"></router-link>
          </li>
        </ul>
      </nav>
  	  <div class="copyright text-center">Build {{version}}</div>
    </div>
  </footer>
</template>
<script>
import StatsCard from "src/components/UIComponents/Cards/StatsCard.vue";
import Vue from "vue";
import {
  mapState,
  mapActions
} from "vuex";

export default {
  name: "Footer",
  computed: {
    ...mapState({
      version: "version",
    })
  },
  created: function() {
	this.getVersion();
  },
  methods: {
    ...mapActions({
      getVersion: "getVersion",
    }),
	}
}
</script>