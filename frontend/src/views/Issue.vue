<template>
  <div class="animated fadeIn">
    <b-card>
      <div slot="header">
        <strong>이슈 #{{ $route.params.id }}</strong>
        <small v-if="form.issueType === 'reward'">(타입: 보상)</small>
        <small v-else>(타입: 납부)</small>
        <div v-if="form.createdBy ? (form.createdBy._id === user._id) : false" class="card-actions">
          <b-link :to="'edit'" append><i class="fa fa-gear"></i></b-link>
        </div>
      </div>
      <div slot="footer" class="text-sm-right">
        <b-button variant="info" :to="{name: '이슈'}">확인</b-button>
        <b-button variant="danger" v-on:click="close" v-if="form.isClosed === false">종료</b-button>
      </div>
      <b-row>
        <b-col sm="12">
          <b-form-group>
            <h2>{{ form.title }}</h2>
            <small>{{ form.createdAt | moment("YYYY-MM-DD HH:MM:SS") }} </small>
            <small> by </small>
            <small>{{ form.createdBy ? form.createdBy.name : ''}}</small>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="8">
          <b-card>
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <p v-if="form.issueType === 'reward'" class="h4">보상 금액</p>
                  <p v-else class="h4">납부 금액</p>
                  <p>{{ form.tokens }}</p>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <p class="h4">상세 내용</p>
                  <p v-html="form.description"></p>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <p class="h4">참여 가능 기간</p>
                  <p v-if="form.startDate || form.finishDate">
                    {{ form.startDate | moment("YYYY-MM-DD")}} ~ {{ form.finishDate | moment("YYYY-MM-DD")}}
                  </p>
                  <p v-else>무제한</p>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <p class="h4">참여 가능 인원 수</p>
                  <p v-if="form.maxNumberOfParticipants === 9999">멤버 전체</p>
                  <p v-else>{{ form.maxNumberOfParticipants }}</p>
                </b-form-group>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col sm="4">
          <b-card no-body>
            <div slot="header">
              <strong v-if="form.issueType === 'reward'">참여자</strong>
              <strong v-if="form.issueType !== 'reward'">납부자</strong>
              <small>현재: {{ form.participants ? form.participants.length : 0 }}</small>
            </div>
            <div slot="footer" class="text-sm-center" v-if="form.issueType === 'reward' && form.isClosed === false && !isRewardedParticipants()">
              <b-button variant="success" v-if="!isParticipant()" v-on:click="optIn()">참여하기</b-button>
              <b-button variant="danger" v-if="isParticipant()" v-on:click="optOut()">참여취소</b-button>
            </div>
            <div slot="footer" class="text-sm-center" v-if="form.issueType !== 'reward' && form.isClosed === false && !isParticipant()">
              <b-button variant="success" v-on:click="payToken()">납부하기</b-button>
            </div>
            <b-list-group v-if="form.participants && form.participants.length > 0" flush>
              <b-list-group-item v-for="participant in form.participants" :key="participant.id">
                <div class="avatar float-auto">
                  <img class="img-avatar" :src="participant.avatar ? $http.defaults.baseURL + '/api/images/' + participant.avatar : '/static/img/avatars/profile_thumbnail.jpg'" onerror="this.onerror=null;this.src='/static/img/avatars/profile_thumbnail.jpg';">
                </div>
                <strong>{{ participant.name }}</strong>
                <div class="float-right" v-if="form.createdBy._id === user._id && form.issueType === 'reward'">
                  <b-button variant="primary" v-on:click="rewardParticipant(form.tokens, participant)">보상하기</b-button>
                </div>
              </b-list-group-item>
            </b-list-group>
            <div v-else class="card-text text-center">
              <br/>
              <p v-if="form.issueType === 'reward'">아직 참여자가 없습니다.</p>
              <p v-if="form.issueType !== 'reward'">아직 납부자가 없습니다.</p>
            </div>
          </b-card>

          <b-card v-if="form.issueType === 'reward'" no-body>
            <div slot="header">
              <strong>보상 완료</strong>
              <small>현재: {{ form.rewardedParticipants ? form.rewardedParticipants.length : 0 }}</small>
            </div>
            <b-list-group v-if="form.rewardedParticipants && form.rewardedParticipants.length > 0" flush>
              <b-list-group-item v-for="participant in form.rewardedParticipants" :key="participant.id">
                <div class="avatar float-auto">
                  <img class="img-avatar" :src="participant.avatar ? $http.defaults.baseURL + '/api/images/' + participant.avatar : '/static/img/avatars/profile_thumbnail.jpg'" onerror="this.onerror=null;this.src='/static/img/avatars/profile_thumbnail.jpg';">
                </div>
                <strong>{{ participant.name }}</strong>
              </b-list-group-item>
            </b-list-group>
            <p v-else class="card-text text-center">
              <br/>
              아직 참여자가 없습니다.
              <br/><br/>
            </p>
          </b-card>
        </b-col>
      </b-row>
    </b-card>
    <pw-modal></pw-modal>
    <reward-modal></reward-modal>
  </div>
</template>

<script>
import pwModal from './notifications/PasswordModal.vue'
import rewardModal from './notifications/RewardModal.vue'

export default {
  name: 'issue',
  components: {
    pwModal,
    rewardModal
  },
  async created () {
    await this.fetchUser()
    await this.fetchIssue()
  },
  data () {
    return {
      form: {
        title: '',
        createdBy: {},
        createdAt: '',
        description: '',
        tokens: 0,
        maxNumberOfParticipants: 0,
        startDate: '',
        finishDate: '',
        issueType: 'reward',
        participants: [],
        rewardedParticipants: []
      },
      user: {}
    }
  },
  methods: {
    fetchIssue () {
      this.form = {}
      this.$http.get('/api/issues/' + this.$route.params.id)
        .then((response) => {
          this.form = response.data
        })
    },
    fetchUser () {
      this.user = {}
      this.$http.get('/api/users/me')
        .then((response) => {
          this.user = response.data
        })
    },
    isParticipant () {
      var self = this
      var participant = this.form.participants.filter(function (object) {
        return self.user._id === object._id
      })
      return participant.length !== 0
    },
    isRewardedParticipants () {
      var self = this
      var rewardedParticipant = this.form.rewardedParticipants.filter(function (object) {
        return self.user._id === object._id
      })
      return rewardedParticipant.length !== 0
    },
    payToken () {
      var participants = this.form.participants.length + this.form.rewardedParticipants.length
      if (participants >= this.form.maxNumberOfParticipants) {
        alert('참여 가능 인원 수가 이미 꽉 찼습니다.')
        return
      }
      var senderName = this.form.createdBy.name
      var receiverAddress = this.user.keyStore.address
      var tokens = this.form.tokens

      this.$http.get('/api/users/me/tokens')
        .then((response) => {
          if (response.data.tokens < tokens) {
            alert('토큰 잔액 부족 - 보유량: ' + response.data.tokens)
            throw new Error()
          }
        })
        .then(() => {
          this.$eventHub.$emit('reward-modal-open',
            '납부하기',
            tokens,
            senderName,
            password => {
              var body = {
                receiver: receiverAddress,
                tokens: tokens,
                password: password
              }
              this.sendToken(body)
            }
          )
        })
        .catch((error) => {
          console.error(error)
          alert(error.response.data.message)
        })
    },
    optIn () {
      var participants = this.form.participants.length + this.form.rewardedParticipants.length
      if (participants >= this.form.maxNumberOfParticipants) {
        alert('참여 가능 인원 수가 이미 꽉 찼습니다.')
        return
      }
      this.$http.put('/api/issues/' + this.$route.params.id + '/participants/me')
        .then((response) => {
          this.fetchIssue()
          alert('참여가 완료되었습니다.')
        })
    },
    optOut () {
      this.$http.delete('/api/issues/' + this.$route.params.id + '/participants/me')
        .then((response) => {
          this.fetchIssue()
          alert('참여가 취소되었습니다.')
        })
    },
    close: function (event) {
      if (confirm('이슈를 종료하시겠습니까?')) {
        this.$http.put('/api/issues/' + this.$route.params.id, {
          isClosed: true,
          closedAt: new Date()
        })
          .then((response) => {
            alert('이슈가 종료되었습니다.')
            this.$router.push('/issues')
          })
      }
    },
    rewardParticipant (tokens, participant) {
      this.$http.get('/api/users/me/tokens-allowance')
        .then((response) => {
          if (response.data.tokens < tokens) {
            alert('토큰 잔액 부족 - 보유량: ' + response.data.tokens)
            throw new Error()
          }
        })
        .then(() => {
          this.$eventHub.$emit('reward-modal-open',
            '보상하기',
            tokens,
            participant.name,
            password => {
              var body = {
                receiverId: participant._id,
                receiver: participant.keyStore.address,
                tokens: tokens,
                password: password,

              }
              this.sendToken(body)
            }
          )
        })
        .catch((error) => {
          console.error(error)
          alert(error.response.data.message)
        })
    },
    async sendToken (body) {
      var before
      try {
        before = this.$toastr.Add({
          title: '거래 내역',
          msg: '생성 중...',
          clickClose: false,
          timeout: 0,
          type: 'info'
        })

        var url = (this.form.issueType === 'reward') ? '/api/contracts/mine/tokens' : '/api/contracts/mine/trasfer'
        const response = await this.$http.post(url, body)
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

        if (this.form.issueType === 'reward') {
          this.$http.put('/api/issues/' + this.$route.params.id + '/rewardedParticipants/' + body.receiverId)
            .then((response) => {
              this.fetchIssue()
              alert('보상이 완료되었습니다.')
            })
        } else {
          this.$http.put('/api/issues/' + this.$route.params.id + '/participants/me')
            .then((response) => {
              this.fetchIssue()
              alert('납부가 완료되었습니다.')
            })
        }
      } catch (error) {
        console.error(error)
        if (undefined !== before) {
          this.$toastr.Close(before)
        }
        this.$toastr.e('등록 실패' + error.response.data.message ? ': ' + error.response.data.message : '', '거래 내역')
      }
    }
  }
}
</script>
