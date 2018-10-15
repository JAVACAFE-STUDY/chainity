<template>
  <div class="animated fadeIn">
    <b-row v-if="user.role === 'admin'">
      <b-col sm="12">
        <div class="text-sm-right">
          <b-button variant="primary" :to="'new-issue'" append>이슈 등록</b-button>
        </div>
        <br/>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <c-table ref="table" v-if="issues !== null" striped :rows="issues" :columns="issueFields" caption="<i class='fa fa-align-justify'></i> 이슈 목록"></c-table>
      </b-col><!--/.col-->
    </b-row><!--/.row-->
  </div>
</template>

<script>
import cTable from './base/Table.vue'

export default {
  name: 'tables',
  components: {cTable},
  created () {
    this.fetchData()
    this.$http.get('/api/users/me')
      .then((response) => {
        this.user = response.data
      })
  },
  data () {
    return {
      issues: null,
      issueFields: [
        {key: 'id', label: '아이디', sortable: true},
        {key: 'title', label: '제목', sortable: true},
        {key: 'tokens', label: '보상/납부 금액', sortable: true, variant: 'info'},
        {key: 'createdAt', label: '등록일시', sortable: true},
        {key: 'startDate', label: '참여 시작일', sortable: true},
        {key: 'finishDate', label: '참여 마감일', sortable: true, variant: 'warning'},
        {key: 'participants', label: '참여자 수', sortable: true},
        {key: 'issueStatus', label: '상태', sortable: true}
      ],
      user: {}
    }
  },
  methods: {
    fetchData () {
      this.$http.get('/api/issues')
        .then((response) => {
          this.issues = response.data
        })
        .then(() => {
          for (let i = 0; i < this.issues.length; i++) {
            const issue = this.issues[i]
            if (issue.participants) {
              this.issues[i].participants = issue.participants.length
            } else {
              this.issues[i].participants = 0
            }
          }
        })
    }
  }
}
</script>
