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
  data () {
    return {
      userList: []
    }
  },
  methods: {
    findUserName (userId) {
      return this.userList.find((user, idx) => {
        var address = '0x' + user.keyStore.address
        return userId.toUpperCase() === address.toUpperCase()
      })
    }
  },
  mounted: function () {
    this.$http.get('/api/users')
      .then((responce) => {
        this.userList = responce.data
        return this.$http.get('/api/contracts/0x0000/receipts')
      })
      .then((response) => {
        var requestList = response.data
        for (let i = 0; i < requestList.length; i++) {
          var fromUser = this.findUserName(requestList[i].from)
          var toUser = this.findUserName(requestList[i].to)

          if (fromUser != null) {
            requestList[i].from = fromUser.name
          }

          if (toUser != null) {
            requestList[i].to = toUser.name
          }
        }
        this.$children[0].items = requestList
      })
  }
}
</script>
