<!--blue', 'azure', 'green', 'orange', 'red', 'purple', 'black'!-->
<template>
  <div class="sidebar"
       :style="sidebarStyle"
       :data-color="coin.bgcolor"
       :data-image="backgroundImage">
    <div class="sidebar-wrapper">
      <div class="logo">
		<a href="#" class="simple-text">
			<span class="logo-text">NEXT</span>
        </a>
      </div>

      <slot name="content"></slot>
      <ul class="nav">
        <!--By default vue-router adds an active class to each route link. This way the links are colored when clicked-->
        <slot>
          <sidebar-link v-for="(link,index) in sidebarLinks"
                        :key="link.name + index"
                        :to="link.path"
                        @click="closeNavbar"
                        :link="link">
            <i :class="link.icon"></i>
            <p>{{link.name}}</p>
          </sidebar-link>
        </slot>
      </ul>
    </div>
  </div>
</template>
<script>
import SidebarLink from './SidebarLink.vue'
import Vue from "vue";
import {
  mapState,
  mapActions
} from "vuex";

  export default {
    components: {
      SidebarLink
    },
    props: {
      backgroundImage: {
        type: String,
        default: 'static/img/sidebar/default.jpg'
      },
      activeColor: {
        type: String,
        default: 'success',
        validator: (value) => {
          let acceptedValues = ['primary', 'info', 'success', 'warning', 'danger']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      sidebarLinks: {
        type: Array,
        default: () => []
      },
      autoClose: {
        type: Boolean,
        default: true
      }
    },
    provide () {
      return {
        autoClose: this.autoClose
      }
    },
    computed: {
	    ...mapState({
      coin: "coin",
      coins: "coins",
    }),
      sidebarStyle () {
        return {
          backgroundImage: `url(${this.coin.bgimage})`
        }
      }
    }
  }

</script>