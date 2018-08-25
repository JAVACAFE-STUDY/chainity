<template>
  <div class="animated fadeIn">
    <b-row v-if="(user.role === 'system' || user.role === 'admin')">
      <b-col sm="12">
        <b-card header-tag="header" footer-tag="footer">
        <div>
          <b-form novalidate="novalidate" class="was-validated" @submit="onSubmit">
            <b-form-group>
              <b-input-group>
                <b-form-input v-model="form.email" type="email" placeholder="Email"></b-form-input>
                <!-- Attach Right button -->
                <b-input-group-append>
                  <b-button type="submit" variant="primary">Send invitation</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-form>
        </div>
        </b-card>
      </b-col><!--/.col-->
    </b-row><!--/.row-->
    <b-row>
      <b-col sm="12">
        <c-table ref="table" v-if="users.length > 0" striped :rows="users" :columns="userFields" caption="<i class='fa fa-align-justify'></i> 사용자 목록"></c-table>
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
      form: {
        email: ''
      },
      users: [],
      userFields: [
        {key: 'name', label: '이름', sortable: true},
        {key: 'email', label: '이메일', sortable: true},
        {key: 'role', label: '권한', sortable: true},
        {key: 'status', label: '상태', sortable: true},
        {key: 'createdAt', label: '가입일', sortable: true},
        {key: 'tokens', label: '보유토큰량', sortable: true}
      ],
      user: {}
    }
  },
  methods: {
    fetchData () {
      this.$http.get('/api/users')
        .then((response) => { this.users = response.data })
        .then(() => {
          for (let i = 0; i < this.users.length; i++) {
            const user = this.users[i]
            if (user.keyStore) {
              this.$http.get('/api/users/' + user._id + '/tokens')
                .then((response) => { this.users[i].tokens = response.data.tokens.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') })
            }
          }
        })
    },
    onSubmit (evt) {
      var _this = this
      evt.preventDefault()
      if (this.form.email !== '') {
        this.form.status = 'pending'
        this.form.role = 'user'
        this.form.name = ''
        this.$http.post('/api/users', this.form)
          .then((response) => {
            this.form.email = ''
            _this.$http.post('/api/mails/invitation/users/' + response.data._id)
              .then((response) => { alert('초대 메일이 발송되었습니다.') })
              .then(() => { this.users.unshift(response.data) })
          })
          .catch((error) => {
            console.error(error.response)
            alert(error.response.data.message)
          })
      }
    }
  }
}
</script>
