<template>
  <div class="animated fadeIn">

    <b-row>
      <b-col sm="12">
        <c-table ref="table" v-if="tokensRequestList !== null" striped :rows="tokensRequestList" :columns="tokensRequestFields" caption="<i class='fa fa-align-justify'></i> 토큰 충전 신청 목록"></c-table>
      </b-col><!--/.col-->
    </b-row><!--/.row-->

  <pw-modal></pw-modal>
  </div>

</template>

<script>
import cTable from './base/Table.vue'
import pwModal from './notifications/PasswordModal.vue'

export default {
  name: 'tables',
  components: {cTable, pwModal},
  created () {
    this.fetchData()
  },
  data () {
    return {
      tokensRequestList: null,
      tokensRequests: null,
      tokensRequestFields: [
        {key: 'senderName', label: '입금자명'},
        {key: 'price', label: '입금액', sortable: true},
        {key: 'tokens', label: '토큰'},
        {key: 'tokenRequestUserName', label: '신청자', sortable: true},
        {key: 'createdAt', label: '신청일', sortable: true},
        {key: 'status', label: '상태', sortable: true},
        {key: 'tokensRequestAcceptible', label: '승인 여부'}
      ],
      userList: []
    }
  },
  methods: {
    findUserName (userId) {
      return this.userList.find((user, idx) => {
        return userId === user._id
      })
    },
    fetchData () {
      this.$http.get('/api/tokens-requests')
        .then((response) => {
          this.tokensRequests = response.data
          return this.$http.get('/api/users')
        })
        .then((response) => {
          this.userList = response.data
        })
        .then(() => {
          for (let i = 0; i < this.tokensRequests.length; i++) {
            const tokensRequest = this.tokensRequests[i]
            this.tokensRequests[i].tokens = tokensRequest.price / 1000
            if (this.tokensRequests[i].tx) {
              this.tokensRequests[i].status = '완료'
              this.tokensRequests[i].tokensRequestAcceptible = false
            } else {
              this.tokensRequests[i].status = '대기중'
              this.tokensRequests[i].tokensRequestAcceptible = true
            }
            this.tokensRequests[i].tokenRequestUserName = this.findUserName(this.tokensRequests[i].createdBy).name
          }
          this.tokensRequestList = this.tokensRequests
        })
    }
  }
  // mounted: function () {
  //   this.$http.get('/api/tokens-requests')
  //     .then((response) => {
  //       this.$children[0].items = response.data
  //     })
  // }
}
</script>
