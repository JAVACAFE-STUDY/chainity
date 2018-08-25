<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col cols="6" lg="2">
        <b-card :no-body="true" footer-class="px-3 py-2">
          <b-card-body class="p-3 clearfix">
            <!-- <i class="fa fa-bell bg-danger p-3 font-2xl mr-3 float-left"></i> -->
            <i class="fa fa-bitcoin bg-danger p-3 font-2xl mr-3 float-left"></i>
            <div class="h5 text-danger mb-0 mt-2">JC {{ tokens }}</div>
            <div class="text-muted text-uppercase font-weight-bold font-xs">토큰 보유량</div>
          </b-card-body>
          <b-collapse id="accordion1" accordion="my-accordion" role="tabpanel">
            <b-card-body class="border-right-0">
              <span>은행 : {{ form.receiverBank }}</span><br/>
              <span>예금주 : {{ form.receiverName }}</span><br/>
              <span>계좌번호 : {{ form.receiverAccount }}</span><br/><br/>
              <small>충전하고자 하는 JC토큰만큼 <b>원화를 입금</b> 한 후, 아래 입금자명과 입금액을 작성 후 "토큰 충전 신청" 버튼을 누르면 신청이 완료 됩니다.</small><br/>
              <small class='text-danger'><b>* JC토큰/원화 환율: JC 1 ⇄ ₩ 1,000</b></small><br/><br/>
              <b-form @submit="onSubmit" @reset="onReset">
                <b-form-group id="exampleInputGroup1"
                              label="입금자명"
                              label-for="exampleInput1"
                              description="받는 분 통장 표시">
                  <b-form-input id="exampleInput1"
                                type="text"
                                v-model="form.senderName"
                                required
                                placeholder="입금자명 입력">
                  </b-form-input>
                </b-form-group>
                <b-form-group id="exampleInputGroup2"
                              label="입금액"
                              label-for="exampleInput2"
                              v-bind:description="'JC ' + (form.price > 0 ? (form.price/1000) : 0)">
                  <b-form-input id="exampleInput2"
                                type="number"
                                min="0"
                                v-model="form.price"
                                required
                                placeholder="입금액 입력">
                  </b-form-input>
                </b-form-group>
                <br/>
                <b-button block type="submit" variant="success">토큰 충전 신청</b-button>
                <!-- <b-btn block href="#" v-b-toggle.accordion1 variant="success">토큰 충전 신청</b-btn> -->
              </b-form>
            </b-card-body>
          </b-collapse>
          <div slot="footer">
            <a class="font-weight-bold font-xs btn-block text-muted" href="#" v-b-toggle.accordion1>충전하기 <i class="fa fa-angle-down float-right font-lg"></i></a>
          </div>
        </b-card>
      </b-col>
      <b-col cols="6" lg="10">
        <c-table ref="table" v-if="tokensRequests !== null" striped :rows="tokensRequests" :columns="tokensRequestsFields" caption="<i class='fa fa-align-justify'></i> 충전 신청 내역"></c-table>
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
    this.fetchMyTokens()
    this.fetchMyTokensRequests()
  },
  data: () => {
    return {
      form: {
        receiverBank: '하나은행',
        receiverName: '황희정',
        receiverAccount: '110-5157-45127874',
        senderName: '',
        price: 0
      },
      tokens: 0,
      tokensRequests: null,
      tokensRequestsFields: [
        {key: 'senderName', label: '입금자명'},
        {key: 'price', label: '입금액', sortable: true},
        {key: 'tokens', label: '토큰'},
        {key: 'createdDate', label: '신청일', sortable: true},
        {key: 'status', label: '상태', sortable: true}
      ]
    }
  },
  methods: {
    fetchMyTokens () {
      this.$http.get('/api/users/me/tokens')
        .then((response) => {
          this.tokens = response.data.tokens
        }).catch((error) => {
          console.error(error)
          alert(error.response.data.message)
        })
    },
    fetchMyTokensRequests () {
      this.$http.get('/api/users/me/tokens-requests')
        .then((response) => {
          this.tokensRequests = response.data
        })
        .then(() => {
          for (let i = 0; i < this.tokensRequests.length; i++) {
            const tokensRequest = this.tokensRequests[i]
            this.tokensRequests[i].createdDate = this.$moment.utc(tokensRequest.createdDate).local().format('YYYY-MM-DD HH:mm:ss')
            this.tokensRequests[i].tokens = tokensRequest.price / 1000
            if (this.tokensRequests[i].tx) {
              this.tokensRequests[i].status = '완료'
            } else {
              this.tokensRequests[i].status = '대기중'
            }
          }
        }).catch((error) => {
          console.error(error)
          alert(error.response.data.message)
        })
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.$http.post('/api/tokens-requests', this.form)
        .then((response) => {
          this.onReset(evt)
          alert('토큰 신청이 정상적으로 등록되었습니다.')
        })
        .then(() => {
          this.fetchMyTokensRequests()
        })
    },
    onReset (evt) {
      evt.preventDefault()
      this.form.senderName = ''
      this.form.price = ''
    }
  }
}
</script>
