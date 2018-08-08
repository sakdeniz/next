<template>
<div class="content">
  <div class="container-fluid">
  <h4 class="card-title"><i class="ion-earth"></i> Merchants</h4>
  <gmap-map
    id="map"
    :center="center"
    :zoom="7"
    :options="options"
    map-type-id="terrain">
        <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
        {{infoContent}}<br>
		{{infoPhone}}
      </gmap-info-window>
      <gmap-marker :key="i" v-for="(m,i) in markers" :position="m.position" :clickable="true" @click="toggleInfoWindow(m,i)" @mouseover="statusText = m.infoText" @mouseout="statusText = null"></gmap-marker>
	        <div slot="visible">
        <div style="top: 0; left: 0; background-color: #cc3399; color: white; position: absolute; z-index: 100">
          {{statusText}}
        </div>
</div>
  </gmap-map>
  </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import * as VueGoogleMaps from 'vue2-google-maps'
  Vue.use(VueGoogleMaps, {
    load: {
      key: ""
    }
  })
  export default {
    data () {
      return {
          center: {
            lat: 40.6672865,
            lng: 16.6019728
          },
   	      statusText: '',
          infoContent: '',
          infoPhone: '',
          infoWindowPos: null,
          infoWinOpen: false,
          currentMidx: null,
          //optional: offset infowindow so it visually sits nicely on top of our marker
          infoOptions: {
            pixelOffset: {
              width: 0,
              height: -35
            }
          },
	    markers: [],
		array_categories: [],
        options: {
          styles: [{
            'featureType': 'water',
            'stylers': [{'saturation': 43}, {'lightness': -11}, {'hue': '#0088ff'}]
          }, {
            'featureType': 'road',
            'elementType': 'geometry.fill',
            'stylers': [{'hue': '#ff0000'}, {'saturation': -100}, {'lightness': 99}]
          }, {
            'featureType': 'road',
            'elementType': 'geometry.stroke',
            'stylers': [{'color': '#808080'}, {'lightness': 54}]
          }, {
            'featureType': 'landscape.man_made',
            'elementType': 'geometry.fill',
            'stylers': [{'color': '#ece2d9'}]
          }, {
            'featureType': 'poi.park',
            'elementType': 'geometry.fill',
            'stylers': [{'color': '#ccdca1'}]
          }, {
            'featureType': 'road',
            'elementType': 'labels.text.fill',
            'stylers': [{'color': '#767676'}]
          }, {
            'featureType': 'road',
            'elementType': 'labels.text.stroke',
            'stylers': [{'color': '#ffffff'}]
          }, {'featureType': 'poi', 'stylers': [{'visibility': 'off'}]}, {
            'featureType': 'landscape.natural',
            'elementType': 'geometry.fill',
            'stylers': [{'visibility': 'on'}, {'color': '#b8cb93'}]
          }, {'featureType': 'poi.park', 'stylers': [{'visibility': 'on'}]}, {
            'featureType': 'poi.sports_complex',
            'stylers': [{'visibility': 'on'}]
          }, {'featureType': 'poi.medical', 'stylers': [{'visibility': 'on'}]}, {
            'featureType': 'poi.business',
            'stylers': [{'visibility': 'simplified'}]
          }]
        }
      }
    }
	,
    created: function() {
		let vm = this;
		axios.post(window.hostname + 'navcommunity-getmerchantlist', {
          rpcuser: window.rpcuser,
		  token: window.token,
          rpcport: window.rpcport,
        }, window.config).then(function(res) {
		var categoryObj = jsonQ(res.data).pathValue([0, "categories"]);
        jsonQ.each(categoryObj, function(k, v)
		{
			vm.array_categories.push({merchant_category_id: v.merchant_category_id,merchant_category_type: v.merchant_category_type});
		});
		console.log(vm.array_categories);
        var merchants = jsonQ(res.data).pathValue([1, "merchants"]);
		jsonQ.each(merchants, function(k, v)
		{
			var marker=new google.maps.Marker({position: new google.maps.LatLng(v.merchant_pos_lat,v.merchant_pos_lng),infoText:v.merchant_name,infoPhone:v.merchant_phone});
			vm.markers.push(marker);
		})
		})
		.catch(function(err)
		{
			console.log(err);
		})
	  },
	  methods: {
          toggleInfoWindow: function(marker, idx) {
            this.infoWindowPos = marker.position;
            this.infoContent = marker.infoText;
            this.infoPhone = marker.infoPhone;
            if (this.currentMidx == idx) {
              this.infoWinOpen = !this.infoWinOpen;
            }
            //if different marker set infowindow to open and reset current marker index
            else {
              this.infoWinOpen = true;
              this.currentMidx = idx;
            }
          }
        }
  }
</script>
<style>
  #map {min-height: calc(100vh - 240px);}
</style>