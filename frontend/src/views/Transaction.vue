<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <c-table ref="table" v-if="transactions.length > 0" striped :rows="transactions" :columns="transactionFields" caption="<i class='fa fa-align-justify'></i> 토큰 거래 내역"></c-table>
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
      transactions: [],
      transactionFields: [
        {key: 'transactionFromName', label: '발신자', sortable: true},
        {key: 'transactionToName', label: '수신자', sortable: true},
        {key: 'tokenValue', label: '전송토큰', sortable: true},
        {key: 'txType', label: '타입', sortable: true},
        {key: 'createdAt', label: 'createdAt', sortable: true},
        {key: 'txHash', label: '상세이력', sortable: true}
      ]
    }
  },
  methods: {
    fetchData () {
      this.$http.get('/api/transactions')
        .then((response) => { this.transactions = response.data })
    }
  }
}
</script>
