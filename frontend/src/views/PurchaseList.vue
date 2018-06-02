<template>
  <div class="animated fadeIn">

    <b-row>
      <b-col sm="12">
        <c-table striped caption="<i class='fa fa-align-justify'></i> Striped Table"></c-table>
      </b-col><!--/.col-->
    </b-row><!--/.row-->

  </div>

</template>

<script>
import cTable from './base/PurchaseTable.vue'

export default {
  name: 'tables',
  components: {cTable},
  mounted: function () {
    this.$http.get('/api/token-requests')
      .then((response) => {
        this.$children[0].items = response.data
      })
  }
}
</script>
