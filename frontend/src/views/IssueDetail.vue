<template>
  <b-row>
    <b-col sm="8">
      <b-card>
        <div slot="header">
          <strong>이슈 상세</strong>
        </div>
        <b-form-group>
          <label for="title">제목</label>
          <b-form-input type="text" id="title"></b-form-input>
        </b-form-group>
        <b-form-group>
          <label for="content">내용</label>
          <b-form-textarea id="textarea1"
                     v-model="text"
                     :rows="8"
                     :max-rows="8">
    </b-form-textarea>
        </b-form-group>
        <b-form-group>
          <label for="due_date">마감일</label>
          <b-form-input type="text" id="due_date"></b-form-input>
        </b-form-group>
        <b-row>
          <b-col sm="6">
            <b-form-group>
              <label for="count">인원수</label>
              <b-form-input type="text" id="count"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group>
              <label for="rewards">보상금액</label>
              <b-form-input type="text" id="rewards"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group>
          <label for="assignee">Assignee</label>
          <b-form-input type="text" id="assignee"></b-form-input>
        </b-form-group>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'tables',
  mounted: function () {
    this.$http.get('http://localhost:3000/api/issues')
      .then((response) => {
        console.log(response.data)
        this.$children[0].items = response.data
      })
  }
}
</script>
