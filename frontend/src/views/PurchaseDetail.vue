<template>
  <b-row>
    <b-col sm="8">
      <b-card>
        <div slot="header">
          <strong>토큰 충전 상세</strong>
        </div>
        <b-form-group>
          <label for="title">이름</label>
          <b-form-input type="text" v-model="item.username" readonly></b-form-input>
        </b-form-group>
              <b-form-group>
          <label for="due_date">신청금액</label>
          <b-form-input type="text" v-model="item.balance" readonly></b-form-input>
        </b-form-group>
        <b-form-group>
          <label for="due_date">신청일</label>
          <b-form-input type="text" v-model="item.registered" readonly></b-form-input>
        </b-form-group>
        <b-button variant="primary" v-on:click="approve">승인</b-button>
        <b-button variant="primary" v-on:click="back">뒤로</b-button>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  mounted: function () {
    this.$http.get('/api/purchase/' + this.$route.query.id)
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
      this.$http.put('/api/purchase/' + this.$route.query.id)
        .then((response) => {
          alert(response.data)
          this.$router.go(-1)
        })
    },
    back: function (event) {
      this.$router.go(-1)
    }
  }
}
</script>
