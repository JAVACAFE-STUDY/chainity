<template>
  <div class="animated fadeIn">
    <b-card>
      <div slot="header">
        <strong>이슈 #{{ $route.params.id }}</strong>
        <small v-if="form.issueType === 'reward'">(타입: 보상)</small>
        <small v-else>(타입: 납부)</small>
      </div>
      <div slot="footer" class="text-sm-right">
        <b-button variant="success" v-on:click="updateIssue">수정</b-button>
        <b-button variant="warning" v-on:click="cancel">취소</b-button>
      </div>
      <b-row>
        <b-col sm="6">
          <b-card>
            <div slot="header">
              <strong>내용</strong>
            </div>
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <label for="name">제목</label>
                  <b-form-input type="text" v-model="form.title"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <label v-if="form.issueType === 'reward'" for="name">보상 금액</label>
                  <label v-else for="name">납부 금액</label>
                  <b-form-input type="number" min="0" :disabled="true" v-model="form.tokens"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <label for="ccnumber">상세 내용</label>
                  <vue-editor v-model="form.description"></vue-editor>
                </b-form-group>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col sm="6">
          <b-card>
            <div slot="header">
              <strong>기간</strong>
            </div>
            <b-form-group>
              <label for="start">참여 시작일</label>
              <b-form-checkbox-group>
                <div class="custom-control custom-checkbox custom-control-inline">
                  <input type="checkbox" class="custom-control-input" id="startCheckboxIn" v-model="enable.start" @change="form.startDate = ''">
                  <label class="custom-control-label" for="startCheckboxIn">지정</label>
                </div>
              </b-form-checkbox-group>
              <datepicker :language="lang" :format="format"  :bootstrap-styling=true v-model="form.startDate" v-bind:disabled="!enable.start"></datepicker>
            </b-form-group>
            <b-form-group>
              <label for="finish">참여 마감일</label>
              <b-form-checkbox-group>
                <div class="custom-control custom-checkbox custom-control-inline">
                  <input type="checkbox" class="custom-control-input" id="finishCheckboxIn" v-model="enable.finish" @change="form.finishDate = ''">
                  <label class="custom-control-label" for="finishCheckboxIn">지정</label>
                </div>
              </b-form-checkbox-group>
              <datepicker :language="lang" :format="format" :bootstrap-styling=true v-model="form.finishDate" v-bind:disabled="!enable.finish"></datepicker>
            </b-form-group>
          </b-card>
          <b-card>
            <div slot="header">
              <strong>대상자</strong>
            </div>
            <b-form-group>
              <label for="">참여가능 인원수</label>
              <b-form-radio-group
                  plain
                  :options="[
                    {text: '1명 ',value: '1'},
                    {text: '멤버 전체 ',value: '9999'},
                    {text: '기타 ',value: '-1'}
                  ]"
                  checked="1"
                  v-model="form.maxNumberOfParticipants" @change="etc.maxNumberOfParticipants = ''">
              </b-form-radio-group>
              <b-form-input type="number" min="0" v-bind:disabled="form.maxNumberOfParticipants!=='-1'" v-model="etc.maxNumberOfParticipants"></b-form-input>
            </b-form-group>
            <b-form-group>
              <label for="">사전 참여자 등록</label>
              <b-form-checkbox-group>
                <div class="custom-control custom-checkbox custom-control-inline">
                  <input type="checkbox" class="custom-control-input" id="participantsCheckboxIn" value="false" v-model="enable.participants" @change="initialTag()">
                  <label class="custom-control-label" for="participantsCheckboxIn">지정</label>
                </div>
              </b-form-checkbox-group>
              <vue-tags-input
                class="tags-input"
                v-model="tag"
                v-bind:disabled="!enable.participants"
                :tags="tags"
                :allow-edit-tags="true"
                :add-only-from-autocomplete="true"
                @tags-changed="newTags => tags = newTags"
                :autocomplete-items="items">
                <div slot="tagCenter" slot-scope="props">
                  <span
                    @click="props.performOpenEdit(props.index)"
                    v-if="!props.edit">{{ props.tag.text }}
                  </span>
                  <div class="inputs" v-else>
                    <select
                      v-model="props.tag.text"
                      @change="props.validateTag(props.index)">
                      <option v-for="(user, index) in users" :key="index">{{ user }}</option>
                    </select>
                    <i class="material-icons" @click="props.performSaveTag(props.index)">check</i>
                  </div>
                </div>
              </vue-tags-input>
            </b-form-group>
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
        _id: '',
        title: '',
        description: '',
        tokens: '500',
        maxNumberOfParticipants: '1',
        startDate: '',
        finishDate: '',
        participants: [],
        status: 'ready',
        issueType: 'reward'
      },
      etc: {
        tokens: '',
        maxNumberOfParticipants: ''
      },
      enable: {
        start: false,
        finish: false,
        participants: false
      },
      lang: ko,
      users: [],
      tag: '',
      tags: [],
      format: 'yyyy-MM-dd'
    }
  },
  computed: {
    items () {
      return this.users
        .filter(user => new RegExp(this.tag, 'i').test(user.email) || new RegExp(this.tag, 'i').test(user.name))
        .map(user => ({ text: user.name, _id: user._id }))
    }
  },
  methods: {
    fetchUsers () {
      this.$http.get('/api/users')
        .then((response) => {
          const users = response.data
          for (let i = 0; i < users.length; i++) {
            if (users[i].status === 'active') {
              this.users.push(users[i])
            }
          }
        })
    },
    fetchIssue (id) {
      this.$http.get('/api/issues/' + id)
        .then((response) => {
          this.form = response.data
        })
        .then((response) => {
          this.enable.start = this.form.startDate !== null
          this.enable.finish = this.form.finishDate !== null
          if (this.form.maxNumberOfParticipants > 1 && this.form.maxNumberOfParticipants < 9999) {
            this.etc.maxNumberOfParticipants = this.form.maxNumberOfParticipants
            this.form.maxNumberOfParticipants = '-1'
          }
        })
    },
    updateIssue () {
      this.form.tokens = (this.form.tokens === '-1') ? this.etc.tokens : this.form.tokens
      this.form.maxNumberOfParticipants = (this.form.maxNumberOfParticipants === '-1') ? this.etc.maxNumberOfParticipants : this.form.maxNumberOfParticipants
      this.form.participants = this.tags.map(participant => (participant._id))
      this.$http.put('/api/issues/' + this.$route.params.id, this.form)
        .then((response) => {
          this.$router.push('/issues/' + this.$route.params.id)
        })
    },
    cancel () {
      this.$router.push('/issues/' + this.$route.params.id)
    },
    initialTag () {
      this.tag = ''
      this.tags = []
    },
    setIssueType (issueType) {
      this.form.issueType = issueType
    }
  }
}
</script>
