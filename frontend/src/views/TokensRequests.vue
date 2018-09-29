<template>
  <div class="animated fadeIn">

    <b-row>
      <b-col sm="12">
        <c-table ref="table" v-if="tokensRequests.length > 0" striped :rows="tokensRequests" :columns="tokensRequestFields" caption="<i class='fa fa-align-justify'></i> 토큰 충전 요청 목록"></c-table>
        <b-card v-else header="<i class='fa fa-align-justify'></i> 토큰 충전 요청 목록">
          <p class="text-center">토큰 충전 요청 내역이 없습니다.</p>
        </b-card>
      </b-col><!--/.col-->
    </b-row><!--/.row-->

    <b-modal ref="tokensRequestModalRef" :title="'토큰 지급'" :busy="modal.busy" :header-bg-variant="'dark'" :header-text-variant="'light'" @ok="handleOk">
      <b-form @submit="onSubmit">
        <b-row>
          <b-col sm="12">
            <b-form-group>
              <label for="name">입금자명:</label>
              <span><b>{{ modal.form.senderName }}</b></span>
              <br/>
              <label for="name">입금액:</label>
              <span><b>{{ modal.form.price }}</b></span>
              <br/>
              <span>위와 같은 입금 내역을 확인 하셨습니까?</span>
              <br/>
              <span>승인 시, <b>{{ modal.form.createdBy.name }}</b>님에게 <b>JC {{ modal.form.tokens }}을(를) 지급</b> 합니다.</span>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="12">
            <b-form-group>
              <!-- <label for="name">비밀번호</label> -->
              <b-form-input type="password" v-model="modal.form.password" :state="!$v.modal.form.password.$invalid" aria-describedby="password"></b-form-input>
              <b-form-invalid-feedback id="password">
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
    this.$eventHub.$on('toekens-request-clicked', (item) => {
      this.modal.form = {}
      this.modal.form.tokensRequestId = item._id
      this.modal.form.senderName = item.senderName
      this.modal.form.price = item.price
      this.modal.form.createdBy = item.createdBy
      this.modal.form.tokens = item.price
      this.modal.busy = false
      this.$v.$reset()
      this.showModal()
    })
  },
  data () {
    return {
      tokensRequests: [],
      tokensRequestFields: [
        {key: 'senderName', label: '입금자명'},
        {key: 'price', label: '입금액', sortable: true},
        {key: 'tokens', label: '토큰', sortable: true},
        {key: 'createdBy', label: '신청자'},
        {key: 'createdAt', label: '신청일', sortable: true},
        {key: 'tokensRequestButton', label: ' '}
        // {key: 'tokensRequestAcceptible', label: '승인 여부'}
      ],
      modal: {
        busy: false,
        form: {
          senderName: '',
          price: 0,
          createdBy: {},
          tokens: 0
        }
      },
      userList: []
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
    findUserName (userId) {
      return this.userList.find((user, idx) => {
        return userId === user._id
      })
    },
    fetchData () {
      this.tokensRequests = []
      this.$http.get('/api/tokens-requests')
        .then((response) => {
          this.tokensRequests = response.data
        })
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
    showModal () {
      this.$refs.tokensRequestModalRef.show()
    },
    hideModal () {
      this.$refs.tokensRequestModalRef.hide()
    },
    async submit () {
      var self = this
      this.$v.$touch()
      if (this.$v.$invalid) return

      this.modal.busy = true

      var body = {
        receiver: this.modal.form.createdBy.keyStore.address,
        tokens: this.modal.form.tokens,
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

        const response = await this.$http.post('/api/contracts/mine/tokens', body)
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

        this.$http.put('/api/tokens-requests/' + this.modal.form.tokensRequestId, {tx: response.data.txHash, approvedAt: new Date()})
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
