<template>
  <div class="animated fadeIn">

    <b-row>
      <b-col sm="12">
        <c-table ref="table" v-if="receipts.length > 0" striped :rows="receipts" :columns="receiptFields" caption="<i class='fa fa-align-justify'></i>토큰 거래 내역"></c-table>
      </b-col><!--/.col-->
    </b-row><!--/.row-->
  </div>

</template>

<script>
import cTable from './base/Table.vue'

export default {
  name: 'tables',
  components: {cTable},
  created () {
    this.fetchData()
  },
  data () {
    return {
      receipts: [],
      receiptFields: [
        {key: 'eventFrom', label: '발신자'},
        {key: 'eventTo', label: '수신자'},
        {key: 'value', label: '전송토큰', sortable: true},
        {key: 'tx', label: '상세이력'}
      ]
    }
  },
  methods: {
    fetchData () {
      this.$http.get('/api/contracts/0x0000/receipts')
        .then((response) => {
          this.receipts = response.data
        })
    }
  }
}
</script>
