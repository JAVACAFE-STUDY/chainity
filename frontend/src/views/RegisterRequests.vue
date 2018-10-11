<template>
  <div class="animated fadeIn">

    <b-row>
      <b-col sm="12">
        <c-table ref="table" v-if="users.length > 0" striped :rows="users" :columns="userFields" caption="<i class='fa fa-align-justify'></i> 가입 요청 목록"></c-table>
        <b-card v-else header="<i class='fa fa-align-justify'></i> 가입 요청 목록">
          <p class="text-center">가입 요청 대기자가 없습니다.</p>
        </b-card>
      </b-col><!--/.col-->
    </b-row><!--/.row-->

    <b-modal ref="approveModalRef" :title="'승인하기'" :busy="modal.busy" :header-bg-variant="'dark'" :header-text-variant="'light'" @ok="handleOk">
      <b-form @submit="onSubmit">
        <b-row>
          <b-col sm="12">
            <b-form-group>
              <label for="name">이름:</label>
              <span><b>{{ modal.form.name }}</b></span>
              <br/>
              <label for="name">이메일:</label>
              <span><b>{{ modal.form.email }}</b></span>
            </b-form-group>
            <b-form-group>
              <label for="name">ETH 코인 할당량</label>
              <b-form-input type="number" step="any" v-model="modal.form.coins"></b-form-input>
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
    this.$eventHub.$on('approve-clicked', (item) => {
      this.modal.form._id = item._id
      this.modal.form.email = item.email
      this.modal.form.name = item.name
      this.modal.form.address = item.keyStore.address
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
        {key: 'createdAt', label: '가입신청일', sortable: true},
        {key: 'approveButton', label: ' '}
      ],
      modal: {
        busy: false,
        form: {
          userId: '',
          email: '',
          name: '',
          address: '',
          coins: 0.01,
          allowance: 1000,
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
      this.$http.get('/api/users?status=pending')
        .then((response) => { this.users = response.data })
    },
    showModal () {
      this.$refs.approveModalRef.show()
    },
    hideModal () {
      this.$refs.approveModalRef.hide()
    },
    resetModal () {
      this.modal = {}
    },
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      this.sumbnit()
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.sumbnit()
    },
    async sumbnit () {
      this.$v.$touch()
      if (this.$v.$invalid) return
      this.modal.busy = true

      await Promise.all([this.submitCoin(), this.submitAllowance()])
      await this.activeUser()
      this.sendEmail()
      this.fetchData()
      this.hideModal()
      this.modal.busy = false
    },
    async submitCoin () {
      var self = this
      var body = {
        coins: this.modal.form.coins,
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
        const response = await this.$http.post('/api/users/' + this.modal.form._id + '/coins', body)
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
      } catch (error) {
        console.error(error)
        if (undefined !== before) {
          this.$toastr.Close(before)
        }
        this.$toastr.e('등록 실패' + error.response.data.message ? ': ' + error.response.data.message : '', '거래 내역')
      }
    },
    async submitAllowance () {
      var self = this
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
      } catch (error) {
        console.error(error)
        if (undefined !== before) {
          this.$toastr.Close(before)
        }
        this.$toastr.e('등록 실패' + error.response.data.message ? ': ' + error.response.data.message : '', '거래 내역')
      }
    },
    sendEmail () {
      this.$http.post('/api/mails/approval', {
        email: this.modal.form.email,
        name: this.modal.form.name })
        .then((response) => {
          this.$toastr.s('이메일 전송 완료')
        })
    },
    activeUser () {
      this.$http.put('/api/users/' + this.modal.form._id, {status: 'active'})
        .then((response) => {
          // this.fetchData()
        })
    }
  }
}
</script>
