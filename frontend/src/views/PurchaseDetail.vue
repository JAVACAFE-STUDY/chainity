<template>
  <b-row>
    <b-col sm="8">
      <b-card>
        <div slot="header">
          <strong>토큰 충전 상세</strong>
        </div>
        <b-form-group>
          <label for="title">이름</label>
          <b-form-input type="text" v-model="item.name" readonly></b-form-input>
        </b-form-group>
              <b-form-group>
          <label for="due_date">신청금액</label>
          <b-form-input type="text" v-model="item.tokens" readonly></b-form-input>
        </b-form-group>
        <b-form-group>
          <label for="due_date">신청일</label>
          <b-form-input type="text" v-model="item.registered" readonly></b-form-input>
        </b-form-group>
        <b-form-group>
          <label for="due_date">패스워드</label>
          <b-form-input type="text" v-model="item.password"></b-form-input>
        </b-form-group>
        <b-button id="bt_approve" variant="success" v-on:click="approve" :disabled="item.status != 'Pending'">승인</b-button>
        <b-button id="bt_reject" variant="danger" v-on:click="reject" :disabled="item.status != 'Pending'">반려</b-button>
        <b-button variant="primary" v-on:click="back">뒤로</b-button>
        <b-button id="bt_reject" variant="danger" v-on:click="test">테스트</b-button>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  mounted: function () {
    this.$http.get('/api/token-requests/' + this.$route.query.id)
      .then((response) => {
        this.item = response.data[0]
      })
  },
  data: () => {
    return {
      item: []
    }
  },
  methods: {
    approve: function (event) {
      if (this.item.password !== '') {
        this.item.status = 'Success'
        this.item.sender = '0xA5C4B67A464AA5A511f0C8B360b2e8Ad83a49A06'

        this.$http.post('/api/contracts/0x000/tokens', this.item)
          .then((response) => {
            console.log(response.data)
            if (response.data.result === 'success') {
              this.item.transactionHash = response.data.hash
              this.$http.put('/api/token-requests/' + this.$route.query.id, this.item)
                .then((response) => {
                  alert('승인 되었습니다.')
                  this.$router.go(-1)
                })
            } else {
              alert(response.data.error)
            }
          })
      } else {
        alert('패스워드를 입력하세요.')
      }
    },
    reject: function (event) {
      this.item.status = 'Fail'
      this.$http.put('/api/token-requests/' + this.$route.query.id, this.item)
        .then((response) => {
          alert('반려 되었습니다.')
          this.$router.go(-1)
        })
    },
    test: function (event) {
      if (this.item.password !== '') {
        this.item.status = 'Fail'
        this.item.sender = '0xA5C4B67A464AA5A511f0C8B360b2e8Ad83a49A06'

        this.$http.post('/api/contracts/0x000/tokens', this.item)
          .then((response) => {
            console.log(response.data)
            if (response.data.result === 'success') {
              this.item.transactionHash = response.data.hash
              this.$http.put('/api/token-requests/' + this.$route.query.id, this.item)
                .then((response) => {
                  alert('승인 되었습니다.')
                  this.$router.go(-1)
                })
            } else {
              alert(response.data.error)
            }
          })
      } else {
        alert('패스워드를 입력하세요.')
      }
    },
    back: function (event) {
      this.$router.go(-1)
    }
  }
}
</script>
