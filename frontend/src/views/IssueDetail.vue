<template>
  <b-row >
    <b-col sm="9">
      <b-card>
        <div slot="header">
          <strong>{{ item.title }}</strong>
        </div>
        <b-form-group>
          <p>{{ item.content }}</p>
        </b-form-group>
        <b-row>
          <b-col sm="2">
            <label for="count">마감일</label>
          </b-col>
          <b-col>
            <p>{{ item.dueDate.substr(0, 10) }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="2">
            <label for="count">인원수 </label>
          </b-col>
          <b-col>
            <p>{{ item.count }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="2">
            <label for="count">보상금액</label>
          </b-col>
          <b-col>
            <p>{{ item.rewards }}</p>
          </b-col>
        </b-row>
        <b-form-group>
          <b-button v-if="(this.my_email !== 'system' && this.item.status === 'open')" variant="primary" v-on:click="save">Assign</b-button>
          <b-button v-if="(this.my_email === 'system' && this.item.status === 'open')" variant="primary" v-on:click="close">종료</b-button>
          <b-button variant="primary" v-on:click="back">뒤로</b-button>
        </b-form-group>
      </b-card>
    </b-col>
    <b-col sm="3">
      <b-card>
        <div slot="header">
          <strong>Assignee</strong>
        </div>
        <b-form-group>
          <select v-model="selected" multiple>
            <option v-for="option in options" v-bind:key="option.name" v-bind:value="option.email">
              {{ option.name }}
            </option>
          </select>
          <div><strong>{{ selected }}</strong></div>
        </b-form-group>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  created: function () {
    this.$http.get('/api/users/active')
      .then((response) => {
        // alert('data: ' + JSON.stringify(response.data))
        this.options = response.data
      })
  },
  mounted: function () {
    this.$http.get('/api/issues/' + this.$route.query.id)
      .then((response) => {
        this.item = response.data[0]
        this.selected = this.item.assignee_email
      })
  },
  data: () => {
    return {
      selected: [],
      options: [],
      item: []
    }
  },
  methods: {
    save: function (event) {
      this.$http.put('/api/issues/' + this.$route.query.id, {
        issue: this.item,
        selected: this.selected
      })
        .then((response) => {
          alert('이슈가 할당되었습니다.')
          this.$router.go(-1)
        })
    },
    close: function (event) {
      this.$http.put('/api/issues/' + this.$route.query.id, {
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
    }
  }
}
</script>
