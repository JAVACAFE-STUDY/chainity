<template>
  <div class="animated fadeIn">
    <b-card>
      <div slot="header">
        <strong>이슈 #{{ $route.params.id }}</strong>
        <small v-if="form.issueType === 'reward'">(타입: 보상)</small>
        <small v-else>(타입: 납부)</small>
        <div v-if="form.createdBy" class="card-actions">
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
            <small v-if="users[form.createdBy]">{{ users[form.createdBy].name }}</small>
            <small v-else>{{ form.createdBy }}</small>
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
              <strong v-if="form.issueType != 'reward'">납부자</strong>
              <small>현재: {{ form.participants.length }}</small>
            </div>
            <div slot="footer" class="text-sm-center" v-if="form.isClosed === false">
              <b-button variant="success" v-if="form.issueType != 'reward'" v-on:click="askPermissionAndOptIn()">납부하기</b-button>
              <b-button variant="success" v-if="form.issueType === 'reward' && !isParticipant" v-on:click="optIn()">참여하기</b-button>
              <b-button variant="danger" v-if="form.issueType === 'reward' && isParticipant" v-on:click="form.issueType === 'reward' ? optOut() : askPermissionAndOptOut()">참여취소</b-button>
            </div>
            <b-list-group v-if="form.participants.length > 0" flush>
              <!-- <b-list-group-item v-for="participant in form.participants">{{ msg }}</b-list-group-item> -->
              <b-list-group-item v-for="participant in form.participants" :key="participant.id">
                <div class="avatar float-auto">
                  <img class="img-avatar" :src="getProfileUrl(participant.userId)" onerror="this.onerror=null;this.src='../static/img/avatars/profile_thumbnail.jpg';">
                </div>
                <strong>{{ findUserName(participant.userId).name }}</strong>
                <div class="float-right" v-if="(users['me'].role === 'system' || users['me'].role === 'admin') && form.issueType === 'reward' && !participant.isReceiveReward">
                  <b-button variant="info" :to="{name: '이슈'}" @click.stop="$eventHub.$emit('reward', form.tokens, participant)">보상하기</b-button>
                </div>
              </b-list-group-item>
            </b-list-group>
            <p v-else class="card-text text-center">
              <br>
              아직 참여자가 없습니다.
            </p>
          </b-card>
        </b-col>
      </b-row>
    </b-card>
    <pw-modal></pw-modal>
    <b-modal ref="rewardModalRef" :title="'보상하기'" :busy="modal.busy" :header-bg-variant="'dark'" :header-text-variant="'light'" @ok="handleOk">
      <b-form @submit="onSubmit">
        <b-row>
          <b-col sm="12">
            <b-form-group>
              <label for="name">이름:</label>
              <span><b>{{ modal.form.name }}</b></span>
            </b-form-group>
            <b-form-group>
              <label for="tokens">보상금액</label>
              <b-form-input type="number" step="any" v-model="modal.form.tokens"></b-form-input>
            </b-form-group>
            <b-form-group>
              <label for="password">비밀번호</label>
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
import pwModal from './notifications/PasswordModal.vue'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'issue',
  components: {pwModal},
  created () {
    this.fetchIssue()
    this.$eventHub.$on('reward', this.reward)
  },
  data () {
    return {
      isParticipant: false,
      form: {
        title: '',
        createdBy: '',
        createdByName: '',
        createdAt: '',
        description: '',
        tokens: '0',
        maxNumberOfParticipants: '',
        startDate: '',
        finishDate: '',
        issueType: 'reward',
        participants: []
      },
      userList: [],
      users: {},
      modal: {
        busy: false,
        form: {
          userId: '',
          name: '',
          tokens: 0,
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
  beforeDestroy: function () {
    this.$eventHub.$off('reward', this.reward)
  },
  methods: {
    fetchIssue () {
      this.$http.get('/api/users')
        .then((response) => {
          this.userList = response.data
          return this.$http.get('/api/issues/' + this.$route.params.id)
        })
        .then((response) => {
          this.form = response.data
        })
        .then(() => {
          this.fetchUser(this.form.createdBy)
        })
        .then(() => {
          this.fetchUser('me')
        })
    },
    fetchUser (userId) {
      this.$http.get('/api/users/' + userId)
        .then((response) => {
          this.users[userId] = response.data
        })
        .then(() => {
          // 로그인 한 사람이 이미 참여한 이슈인지 체크한 후, 참여하기 또는 참여취소 버튼의 visibility 설정
          if (userId === 'me') {
            var loginUserId = this.users[userId].id
            var participant = this.form.participants.filter(function (object) {
              return loginUserId === object.userId
            })
            this.isParticipant = participant.length !== 0
          }
          if (userId === this.form.createdBy) {
            this.form.createdByName = this.users[userId].name
            // trick to change createdByName
            this.form.title = this.form.title + ' '
          }
        })
    },
    reward: function (tokens, participant) {
      alert(this.findUserName(participant.userId).name + ' tokens: ' + tokens)
      this.modal.form.userId = participant.userId
      this.modal.form.name = this.findUserName(participant.userId).name
      this.modal.form.tokens = tokens
      this.modal.busy = false
      this.$v.$reset()
      this.showModal()
    },
    findUserName (userId) {
      return this.userList.find((user, idx) => {
        return userId === user._id
      })
    },
    askPermissionAndOptIn () {
      var tokenOwnerName = this.users['me'].name
      var spenderName = this.users[this.form.createdBy].name
      var spenderAddress = this.users[this.form.createdBy].keyStore.address
      var tokens = this.form.tokens

      this.$http.get('/api/users/me/tokens')
        .then((response) => {
          if (response.data.tokens < tokens) {
            alert('토큰 잔액 부족 - 보유량: ' + response.data.tokens)
            throw new Error()
          }
        })
        .then(() => {
          this.$eventHub.$emit('pw-modal-open',
            '토큰 전송 수락',
            tokenOwnerName + '님의 지갑으로부터 <b>' + spenderName + '님이 ' + tokens + '토큰을 지출</b> 할 수 있도록 수락하시겠습니까?',
            password => {
              var body = {
                spender: spenderAddress,
                tokens: tokens,
                password: password
              }
              this.$http.post('/api/contracts/mine/approval', body)
                .then((response) => {
                  this.optIn()
                })
                .catch((error) => {
                  alert(error.response.data.message)
                })
            }
          )
        })
        .catch((error) => {
          console.error(error)
          alert(error.response.data.message)
        })
    },
    askPermissionAndOptOut () {
      var tokenOwnerName = this.users['me'].name
      var spenderName = this.users[this.form.createdBy].name
      var spenderAddress = this.users[this.form.createdBy].keyStore.address
      var tokens = this.form.tokens

      this.$eventHub.$emit('pw-modal-open',
        '토큰 전송 취소',
        tokenOwnerName + '님의 지갑으로부터 <b>' + spenderName + '님이 ' + tokens + '토큰 지출 수락 건</b>을 취소하시겠습니까?',
        password => {
          var body = {
            spender: spenderAddress,
            tokens: 0,
            password: password
          }
          this.$http.post('/api/contracts/mine/approval', body)
            .then((response) => {
              this.optOut()
            })
            .catch((error) => {
              alert(error.response.data.message)
            })
        }
      )
    },
    getProfileUrl (userId) {
      return 'http://localhost:3000/api/images/' + userId + '/profile/thumbnail'
    },
    optIn () {
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
    cancel () {
      this.$router.push('/issues')
    },
    close: function (event) {
      if (confirm('이슈를 종료하시겠습니까?')) {
        this.$http.put('/api/issues/' + this.$route.params.id, {
          isClosed: true,
          closedAt: new Date()
        })
          .then((response) => {
            alert('이슈가 종료되었습니다.')
            this.$router.go(-1)
          })
      }
    },
    showModal () {
      this.$refs.rewardModalRef.show()
    },
    hideModal () {
      this.$refs.rewardModalRef.hide()
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
        coins: this.modal.form.tokens,
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

        this.$http.post('/api/mails/approval', {
          email: this.modal.form.email,
          name: this.modal.form.name})
          .then((response) => {
            this.$toastr.s('이메일 전송 완료')
          })

        this.$http.put('/api/users/' + this.modal.form._id, {status: 'active'})
          .then((response) => {
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
