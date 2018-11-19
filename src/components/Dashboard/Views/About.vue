<template>
<div class="content">
	<div class="container-fluid">
	<h4 class="card-title"><span class="logo-text-purple">NEXT</span></h4>
			<p>Multi-coin & multi-asset Open Source Cryptocurrency Wallet</p>
			<p>Build <b>{{version}}</b>&nbsp;&nbsp;&nbsp;Latest Build <b>{{latestVersion}}</b>&nbsp;&nbsp;&nbsp;<a v-if="version==latestVersion" class="ui green label">NEXT is up to date.</a><a v-else class="ui yellow label">New update available, please restart your wallet for update.</a></p>
			<a class="ui button violet external" title="NEXT Official Web Site" target="_blank" href="https://www.nextwallet.org"><i class="ion-android-open"></i>&nbsp;&nbsp;&nbsp;Official Site</a>
			<a class="ui button violet external" title="Github Repo" target="_blank" href="https://github.com/sakdeniz/next"><i class="ion-social-github"></i>&nbsp;&nbsp;&nbsp;Github Repo</a>
			<h2 class="ui dividing header">Lead Developer</h2>
			<div class="ui list">
				<div class="item">
					Seyhan Akdeniz
				</div>
			</div>
			<h2 class="ui dividing header">Contributors</h2>
			<div class="ui list">
				<div class="item">
					NavCoin Core Team
				</div>
				<div class="item">
					NavCoin Community Developers
				</div>
				<div class="item">
					NavCoin Community Members
				</div>
			</div>
			<h2 class="ui dividing header">Special Thanks</h2>
			<div class="ui list">
				<div class="item">
					igona <i class="ion-heart" style="color:red"></i>
				</div>
				<div class="item">
					Craig MacGregor
				</div>
				<div class="item">
					Rowan Savage
				</div>
				<div class="item">
					Alex Vazquez
				</div>
				<div class="item">
					Matt Paul
				</div>
				<div class="item">
					Paul Sanderson
				</div>
				<div class="item">
					Mike Delucchi
				</div>
				<div class="item">
					Jonathan
				</div>
				<div class="item">
					Beekart
				</div>
				<div class="item">
					Dan Tudor
				</div>
				<div class="item">
					hash512
				</div>
				<div class="item">
					Nio
				</div>
				<div class="item">
					LordNelsson
				</div>
				<div class="item">
					juguelio
				</div>
				<div class="item">
					salmonskinroll
				</div>
			</div>
	</div>
</div>
</template>
<script type="text/javascript">
import Vue from "vue";
import {
  mapState,
  mapActions
} from "vuex";

export default {
  computed: {
    ...mapState({
      version: "version",
	  latestVersion: "latestVersion",
    })
  },
  created: function() {
	this.getVersion();
	this.getLatestVersion();
  },
  methods: {
		...mapActions({
		getVersion: "getVersion",
		getLatestVersion: "getLatestVersion",
		}),
	}
}
</script>