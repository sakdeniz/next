<template>
<div class="content">
  <div class="container-fluid">
    <h4 class="card-title"><i class="ion-android-search"></i> Block Explorer</h4>
    <a v-for="block_explorer in coin.block_explorers" class="btn btn-fill btn-info" style="margin-right:10px;" target="_blank" v-bind:href="block_explorer.url"><i class="ion-android-open"></i>&nbsp;{{block_explorer.name}}</a>
  </div>
</div>
</template>
<script>
import Vue from "vue";
import {
  mapState,
  mapActions
} from "vuex";

export default {
    computed: {
    ...mapState({
      coin: "coin",
    })
    }
}
</script>