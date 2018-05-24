<template>
  <b-row>
    <b-col sm="8">
      <b-card>
        <div slot="header">
          <strong>이슈 상세</strong>
        </div>
        <b-form-group>
          <label for="title">제목</label>
          <b-form-input type="text" v-model="item.title" readonly></b-form-input>
        </b-form-group>
        <b-form-group>
          <label for="content">내용</label>
          <b-form-textarea
                     :rows="8"
                     :max-rows="8"
                     v-model="item.content"
                     readonly>
    </b-form-textarea>
        </b-form-group>
        <b-form-group>
          <label for="dueDate">마감일</label>
          <b-form-input type="text" v-model="item.dueDate" readonly></b-form-input>
        </b-form-group>
        <b-row>
          <b-col sm="6">
            <b-form-group>
              <label for="count">인원수</label>
              <b-form-input type="text" v-model="item.count" readonly></b-form-input>
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group>
              <label for="rewards">보상금액</label>
              <b-form-input type="text" v-model="item.rewards" readonly></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group>
          <label for="assignee">Assignee</label>
          <b-form-input type="text" id="assignee" @click.native="modalShow = !modalShow"></b-form-input>
        </b-form-group>
        <b-button variant="primary" v-on:click="save">저장</b-button>
        <b-button variant="primary" v-on:click="back">뒤로</b-button>
      </b-card>
    </b-col>
    <b-modal v-model="modalShow">
      test
    </b-modal>
  </b-row>
</template>

<script>
export default {
  mounted: function () {
    this.$http.get('/api/issue/' + this.$route.query.id)
      .then((response) => {
        this.item = response.data[0]
      })
  },
  data: () => {
    return {
      item: [],
      users: null,
      userFields: [{key: 'name'}],
      modalShow: false
    }
  },
  methods: {
    save: function (event) {
      this.$router.go(-1)
    },
    back: function (event) {
      this.$router.go(-1)
    },
    getUsers: function (event) {
      this.$http.get('/api/users')
        .then((response) => {
          this.users = response.data
        })
    }
  }
}
</script>
