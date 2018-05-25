<template>
<div class="content">
  <div class="container-fluid">
    <h4 class="card-title"><i class="ion-social-rss"></i> News</h4>
    <div id="news">
      <ul></ul>
    </div>
  </div>
</div>
</template>

<script>
import ChartCard from 'src/components/UIComponents/Cards/ChartCard.vue'
import StatsCard from 'src/components/UIComponents/Cards/StatsCard.vue'
import Card from 'src/components/UIComponents/Cards/Card.vue'
import LTable from 'src/components/UIComponents/Table.vue'
import Checkbox from 'src/components/UIComponents/Inputs/Checkbox.vue'
import axios from 'axios';
import moment from 'moment';

export default {
  components: {
    Checkbox,
    Card,
    LTable,
    ChartCard,
    StatsCard
  },
  created: function() {
    this.getnews();
  },
  methods: {
    getnews: function(event) {
      $.ajax({
        type: "GET",
        url: "https://navcoin.org/feed",
        dataType: "xml",
        success: function(xml) {

          var contain = $("#news ul");
          var limit = 50;

          $(xml).find('item').each(function(index) {
            if (index < limit) {
              var title = $(this).find('title').text();
              var url = $(this).find('link').text();
              var pubDate = $(this).find('pubDate').text();
              $('<li></li>').html('<a target="_blank" href="' + url + '">' + title + '</a><br><small>' + pubDate + '</small>').appendTo(contain);
              return;
            }

          }); //end each
        }
      });
    }
  },
}
</script>
