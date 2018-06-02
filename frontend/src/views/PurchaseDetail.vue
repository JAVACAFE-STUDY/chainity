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
          <b-form-input type="text" v-model="item.balance" readonly></b-form-input>
        </b-form-group>
        <b-form-group>
          <label for="due_date">신청일</label>
          <b-form-input type="text" v-model="item.registered" readonly></b-form-input>
        </b-form-group>
        <b-button id="bt_approve" variant="success" v-on:click="approve" :disabled="item.status != 'Pending'">승인</b-button>
        <b-button id="bt_reject" variant="danger" v-on:click="reject" :disabled="item.status != 'Pending'">반려</b-button>
        <b-button variant="primary" v-on:click="back">뒤로</b-button>
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
      this.item.status = 'Success'
      this.$http.put('/api/token-requests/' + this.$route.query.id, this.item)
        .then((response) => {
          alert('승인 되었습니다.')
          this.$router.go(-1)
        })
    },
    reject: function (event) {
      this.item.status = 'Fail'
      this.$http.put('/api/token-requests/' + this.$route.query.id, this.item)
        .then((response) => {
          alert('반려 되었습니다.')
          this.$router.go(-1)
        })
    },
    back: function (event) {
      this.$router.go(-1)
    }
  }
}
</script>
