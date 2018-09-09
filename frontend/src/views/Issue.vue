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
              <strong>참여자</strong>
              <small>현재: {{ form.participants.length }}</small>
            </div>
            <div slot="footer" class="text-sm-right">
              <b-button variant="success" v-on:click="form.issueType === 'reward' ? optIn() : askPermissionAndOptIn()">참여하기</b-button>
              <b-button variant="danger" v-on:click="form.issueType === 'reward' ? optOut() : askPermissionAndOptOut()">참여취소</b-button>
            </div>
            <b-list-group v-if="form.participants.length > 0" flush>
              <!-- <b-list-group-item v-for="participant in form.participants">{{ msg }}</b-list-group-item> -->
              <b-list-group-item v-for="participant in form.participants" :key="participant.id">
                <div class="avatar float-right">
                  <img class="img-avatar" :src="getProfileUrl(participant._id)" onerror="this.onerror=null;this.src='../static/img/avatars/profile_thumbnail.jpg';">
                </div>
                <div>
                  <strong>{{ participant.name }}</strong>
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
  </div>
</template>

<script>
import pwModal from './notifications/PasswordModal.vue'

export default {
  name: 'issue',
  components: {pwModal},
  created () {
    this.fetchIssue()
    this.fetchUser('me')
  },
  data () {
    return {
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
      users: {}
    }
  },
  methods: {
    fetchUser (userId) {
      this.$http.get('/api/users/' + userId)
        .then((response) => {
          this.users[userId] = response.data
        })
        .then(() => {
          if (userId === this.form.createdBy) {
            this.form.createdByName = this.users[userId].name
            // trick to change createdByName
            this.form.title = this.form.title + ' '
          }
        })
    },
    fetchIssue () {
      this.$http.get('/api/issues/' + this.$route.params.id)
        .then((response) => {
          this.form = response.data
        })
        .then(() => {
          this.fetchUser(this.form.createdBy)
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
          alert('참여 완료')
        })
    },
    optOut () {
      this.$http.delete('/api/issues/' + this.$route.params.id + '/participants/me')
        .then((response) => {
          this.fetchIssue()
          alert('참여 취소 완료')
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
    }
  }
}
</script>
