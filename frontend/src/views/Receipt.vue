<template>
  <div class="animated fadeIn">

    <b-row>
      <b-col sm="12">
        <c-table striped caption="<i class='fa fa-align-justify'></i> 거래 내역"></c-table>
      </b-col><!--/.col-->
    </b-row><!--/.row-->

  </div>

</template>

<script>
import cTable from './base/ReceiptTable.vue'

export default {
  name: 'tables',
  components: {cTable},
  mounted: function () {
    this.$http.get('/api/contracts/0x0000/receipts')
      .then((response) => {
        this.$children[0].items = response.data
      })
  }
}
</script>
