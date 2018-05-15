<template>
  <form id="myForm" @submit.prevent="addIssue">
    <b-row>
      <b-col sm="8">
        <b-card>
          <div slot="header">
            <strong>이슈 등록</strong>
          </div>
          <b-form-group>
            <label for="title">제목</label>
            <b-form-input type="text" id="title" v-model="title"></b-form-input>
          </b-form-group>
          <b-form-group>
            <label for="content">내용</label>
            <b-form-textarea id="content" :rows="8" :max-rows="8" v-model="content">
      </b-form-textarea>
          </b-form-group>
          <b-form-group>
            <label for="due_date">마감일</label>
            <b-form-input type="text" id="due_date"  v-model="due_date" placeholder="예: 2018-05-10"></b-form-input>
          </b-form-group>
          <b-row>
            <b-col sm="6">
              <b-form-group>
                <label for="count">인원수</label>
                <b-form-input type="number" id="count" v-model="count"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group>
                <label for="rewards">보상금액</label>
                <b-form-input type="number" id="rewards" v-model="rewards"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-form-group>
            <label for="assignee">Assignee</label>
            <b-form-input type="text" id="assignee"></b-form-input>
          </b-form-group>
          <b-button variant="primary" v-on:click="addIssue">등록</b-button>
          <b-button variant="primary" v-on:click="back">뒤로</b-button>
        </b-card>
      </b-col>
    </b-row>
  </form>
</template>

<script>
export default {
  methods: {
    addIssue: function () {
      if (!this.title) {
        alert('제목을 입력해주세요.')
        return true
      }
      if (!this.content) {
        alert('내용을 입력해주세요.')
        return true
      }
      if (!this.due_date) {
        alert('마감일을 입력해주세요.')
        return true
      }
      if (!this.count) {
        alert('인원수를 입력해주세요.')
        return true
      }
      if (!this.rewards) {
        alert('보상금액을 입력해주세요.')
        return true
      }
      this.$http.post('http://localhost:3000/api/issue/add', {
        title: this.title,
        content: this.content,
        due_date: this.due_date,
        count: this.count,
        rewards: this.rewards
      })
        .then((response) => {
          alert('이슈가 등록되었습니다.')
          this.$router.go(-1)
        })
    },
    back: function (event) {
      this.$router.go(-1)
    }
  }
}
</script>
