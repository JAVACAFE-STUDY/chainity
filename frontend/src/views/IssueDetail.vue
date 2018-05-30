<template>
  <b-row>
    <b-col sm="8">
      <b-card>
        <div slot="header">
          <strong>이슈</strong>
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
          <label for="assignee_name">Assignee</label>
          <b-form-input type="text" v-model="item.assignee_name" readonly></b-form-input>
          <a id='assignToMe' v-on:click='assignToMe' v-bind:style="{ color: '#2CA9D6', cursor: 'pointer' }">{{text}}</a>
        </b-form-group>
        <b-form-group>
          <b-button v-if="(this.my_email !== 'system' && this.item.status === 'open')" variant="primary" v-on:click="save">저장</b-button>
          <b-button v-if="(this.my_email === 'system' && this.item.status === 'open')" variant="primary" v-on:click="close">종료</b-button>
          <b-button variant="primary" v-on:click="back">뒤로</b-button>
        </b-form-group>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  created: function () {
    this.$http.get('/api/users/me')
      .then((response) => {
        this.my_email = response.data.email
        this.my_id = response.data.name
      })
  },
  mounted: function () {
    this.$http.get('/api/issue/' + this.$route.query.id)
      .then((response) => {
        this.item = response.data[0]
        // alert('data: ' + JSON.stringify(response.data[0]))
      })
  },
  data: () => {
    return {
      text: 'Assign to me',
      item: [],
      my_email: null,
      my_id: null,
      userFields: [{key: 'name'}],
      modalShow: false
    }
  },
  methods: {
    save: function (event) {
      this.$http.put('/api/issue/' + this.$route.query.id, {
        issue: this.item
      })
        .then((response) => {
          alert('이슈가 저장되었습니다.')
          this.$router.go(-1)
        })
    },
    close: function (event) {
      this.$http.put('/api/issue/' + this.$route.query.id, {
        issue: this.item,
        status: 'close'
      })
        .then((response) => {
          alert('이슈가 종료되었습니다.')
          this.$router.go(-1)
        })
    },
    back: function (event) {
      this.$router.go(-1)
    },
    assignToMe: function (event) {
      if (this.text === 'Assign to me') {
        this.text = 'Unassigned'
        this.item.assignee_email.push(this.my_email)
        this.item.assignee_name.push(this.my_id)
      } else {
        this.text = 'Assign to me'
        this.item.assignee_email.pop()
        this.item.assignee_name.pop()
      }
    }
  }
}
</script>
