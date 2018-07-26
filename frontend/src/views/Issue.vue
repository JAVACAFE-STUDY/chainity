<template>
  <div class="animated fadeIn">
    <b-card>
      <div slot="header">
        <strong>이슈 #{{ $route.params.id }}</strong>
        <small v-if="form.issueType === 'reward'">(타입: 보상)</small>
        <small v-else>(타입: 납부)</small>
        <div v-if="form.createdBy" class="card-actions">
          <!-- TODO : 이슈 수정 -->
          <a target="_blank">
            <i class="fa fa-gear"></i>
          </a>
        </div>
      </div>
      <div slot="footer" class="text-sm-right">
        <b-button variant="info" :to="{name: 'Issues'}">확인</b-button>
      </div>
      <b-row>
        <b-col sm="12">
          <b-form-group>
            <h2>{{ form.title }}</h2>
            <small>{{ form.createdDate | moment("YYYY-MM-DD HH:MM:SS")}} by {{ form.createdBy }}</small>
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
                  <p>{{ form.price }}</p>
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
                  <p class="h4">기간</p>
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
                  <p class="h4">참여가능 인원수</p>
                  <p v-if="form.maxNumberOfParticipants === 9999">멤버 전체</p>
                  <p v-else-if="form.maxNumberOfParticipants === -1">멤버 전체</p>
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
              <b-button variant="success" v-on:click="optIn()">참여하기</b-button>
              <b-button variant="danger" v-on:click="optOut()">참여취소</b-button>
            </div>
            <b-list-group v-if="form.participants.length > 0" flush>
              <!-- <b-list-group-item v-for="participant in form.participants">{{ msg }}</b-list-group-item> -->
              <b-list-group-item v-for="participant in form.participants" :key="participant.id">
                {{ participant }}
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
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import VueTagsInput from '@johmun/vue-tags-input'
import Datepicker from 'vuejs-datepicker'
import { ko } from 'vuejs-datepicker/dist/locale'

export default {
  name: 'forms',
  components: {
    VueEditor,
    VueTagsInput,
    Datepicker
  },
  created () {
    this.fetchIssue(this.$route.params.id)
    this.fetchUsers()
  },
  data () {
    return {
      form: {
        title: '',
        description: '',
        price: '500',
        maxNumberOfParticipants: '1',
        startDate: '',
        finishDate: '',
        participants: '',
        issueType: 'reward'
      },
      etc: {
        price: '',
        maxNumberOfParticipants: ''
      },
      enable: {
        start: false,
        finish: false,
        participants: false
      },
      lang: ko,
      users: [],
      tags: [],
      format: 'yyyy-MM-dd'
    }
  },
  computed: {
    items () {
      return this.users
        .filter(a => new RegExp(this.tag, 'i').test(a))
        .map(a => ({ text: a }))
    }
  },
  methods: {
    fetchUsers () {
      this.$http.get('/api/users')
        .then((response) => {
          const users = response.data
          for (let i = 0; i < users.length; i++) {
            if (users[i].status === 'active') {
              this.users.push(users[i].name)
            }
          }
        })
    },
    fetchIssue (id) {
      this.$http.get('/api/issues/' + id)
        .then((response) => {
          this.form = response.data
        })
    },
    optIn () {
      alert('개발중')
    },
    optOut () {
      alert('개발중')
    },
    cancel () {
      this.$router.push('/issues')
    },
    initialTag () {
      this.form.participants = ''
      this.tags = []
    },
    setIssueType (issueType) {
      this.form.issueType = issueType
    }
  }
}
</script>
