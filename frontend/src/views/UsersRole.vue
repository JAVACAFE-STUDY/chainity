<template>
  <div class="animated fadeIn">

    <b-row>
      <b-col sm="12">
        <c-table ref="table" v-if="users.length > 0" striped :rows="users" :columns="userFields" caption="<i class='fa fa-align-justify'></i> 사용자 목록"></c-table>
        <b-card v-else header="<i class='fa fa-align-justify'></i> 사용자 목록">
          <p class="text-center">등록된 사용자가 없습니다.</p>
        </b-card>
      </b-col><!--/.col-->
    </b-row><!--/.row-->

    <b-modal ref="roleModalRef" :title="'역할 변경'" :busy="modal.busy" :header-bg-variant="'dark'" :header-text-variant="'light'" @ok="handleOk">
      <b-form @submit="onSubmit">
        <b-row>
          <b-col sm="12">
            <b-form-group>
              <label for="name">이름:</label>
              <span><b>{{ modal.form.name }}</b></span>
              <br/>
              <label for="name">이메일:</label>
              <span><b>{{ modal.form.email }}</b></span>
              <br/>
              <label for="name">역할:</label>
              <span>
                <b v-if="modal.form.role === 'admin'">관리자</b>
                <b v-else>회원</b>
              </span>
            </b-form-group>
            <b-form-group>
              <label for="name">JC 토큰 사용 허용량</label>
              <b-form-input type="number" step="any" v-model="modal.form.allowance"></b-form-input>
            </b-form-group>
            <b-form-group>
              <label for="name">비밀번호</label>
              <b-form-input type="password" v-model="modal.form.password" :state='!$v.modal.form.password.$error'></b-form-input>
              <b-form-invalid-feedback v-if="!$v.modal.form.password.required">
                비밀번호를 입력해주세요
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </div>

</template>

<script>
import cTable from './base/Table.vue'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'tables',
  components: {cTable},
  created () {
    this.fetchData()
    this.$eventHub.$on('role-admin-clicked', async (item) => {
      this.modal.form = {}
      this.modal.form._id = item._id
      this.modal.form.address = item.keyStore.address
      this.modal.form.email = item.email
      this.modal.form.name = item.name
      this.modal.form.role = 'admin'
      const response = await this.$http.get('/api/contracts/0x9bf53b7c67b3a43e6982243befc81ade27b7443f/tokens')
      this.modal.form.allowance = response.data.tokens
      this.modal.busy = false
      this.$v.$reset()
      this.showModal()
    })
    this.$eventHub.$on('role-user-clicked', (item) => {
      this.modal.form = {}
      this.modal.form._id = item._id
      this.modal.form.address = item.keyStore.address
      this.modal.form.email = item.email
      this.modal.form.name = item.name
      this.modal.form.role = 'user'
      this.modal.form.allowance = 0
      this.modal.busy = false
      this.$v.$reset()
      this.showModal()
    })
  },
  data () {
    return {
      users: [],
      userFields: [
        {key: 'name', label: '이름', sortable: true},
        {key: 'email', label: '이메일', sortable: true},
        {key: 'tokens', label: '토큰 사용 허용량', sortable: true},
        {key: 'role', label: '역할'},
        {key: 'roleDropdown', label: ' '}
      ],
      modal: {
        busy: false,
        form: {
          userId: '',
          email: '',
          name: '',
          allowance: 0,
          password: ''
        }
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    modal: {
      form: {
        password: {
          required
        }
      }
    }
  },
  methods: {
    fetchData () {
      this.users = []
      this.$http.get('/api/users?status=active')
        .then((response) => { this.users = response.data })
        .then(() => {
          for (let i = 0; i < this.users.length; i++) {
            const user = this.users[i]
            if (user.keyStore) {
              this.$http.get('/api/users/' + user._id + '/tokens-allowance')
                .then((response) => {
                  this.users[i].name = this.users[i].name + ' '
                  this.users[i].tokens = response.data.allowance
                })
            }
          }
        })
    },
    showModal () {
      this.$refs.roleModalRef.show()
    },
    hideModal () {
      this.$refs.roleModalRef.hide()
    },
    resetModal () {
      this.modal = {}
    },
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      this.submit()
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.submit()
    },
    async submit () {
      var self = this
      this.$v.$touch()
      if (this.$v.$invalid) return

      this.modal.busy = true

      var body = {
        spender: this.modal.form.address,
        tokens: this.modal.form.allowance,
        password: this.modal.form.password
      }
      var before
      try {
        before = this.$toastr.Add({
          title: '거래 내역',
          msg: '생성 중...',
          clickClose: false,
          timeout: 0,
          type: 'info'
        })

        const response = await this.$http.post('/api/contracts/mine/approval', body)
        this.$toastr.Close(before)

        this.$toastr.Add({
          title: '거래 내역',
          msg: '블록체인 원장에 등록 중... (<a target="_blank" href="https://rinkeby.etherscan.io/tx/' + response.data.txHash + '">상세보기 <i class="fa fa-external-link" aria-hidden="true"></i></a>)',
          clickClose: false,
          timeout: 10000,
          type: 'info',
          progressBar: true,
          onClosed: function () {
            // TODO - websocket
            self.$toastr.s('등록 완료 (<a target="_blank" href="https://rinkeby.etherscan.io/tx/' + response.data.txHash + '">상세보기 <i class="fa fa-external-link" aria-hidden="true"></i></a>)', '거래 내역')
          }
        })

        this.$http.put('/api/users/' + this.modal.form._id, {role: this.modal.form.role})
          .then((response) => {
            this.$toastr.s('변경 완료')
            this.fetchData()
          })

        this.hideModal()
      } catch (error) {
        console.error(error)
        if (undefined !== before) {
          this.$toastr.Close(before)
        }
        this.$toastr.e('등록 실패' + error.response.data.message ? ': ' + error.response.data.message : '', '거래 내역')
      }

      this.modal.busy = false
    }
  }
}
</script>
