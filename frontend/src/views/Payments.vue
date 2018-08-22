<template>
  <div class="animated fadeIn">
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text">
          <i class="icon-pie-chart"></i>
        </span>
      </div>
      <input type="text" class="form-control" v-model="tokens" readonly>
    </div>

    <b-row>
      <b-col sm="12">
        <c-table ref="table" v-if="tokensRequest !== null" striped :rows="tokensRequest" :columns="tokensRequestFields" caption="<i class='fa fa-align-justify'></i> 충전 신청 내역"></c-table>
      </b-col><!--/.col-->
    </b-row><!--/.row-->

    <div class="text-sm-right">
      <b-button variant="primary" v-on:click="purchase">토큰 충전 신청</b-button>
    </div>
  </div>

</template>

<script>
import cTable from './base/Table.vue'

export default {
  name: 'tables',
  components: {cTable},
  data: () => {
    return {
      tokens: 0,
      tokensRequest: null,
      tokensRequestFields: [{key: 'name', sortable: true}, {key: 'registered', sortable: true}, {key: 'tokens', sortable: true}, {key: 'status', sortable: true}]
    }
  },
  mounted: function () {
    this.$http.get('/api/users/token')
      .then((response) => {
        this.tokens = response.data.token + ' JC'
      })

    this.$http.get('/api/tokens-requests/me')
      .then((response) => {
        this.tokensRequest = response.data
      })
  },
  methods: {
    purchase: function (event) {
      this.$router.push('/Purchase')
    }
  }
}
</script>
