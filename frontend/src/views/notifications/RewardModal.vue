<template>
  <b-modal :title="title" v-model="isActiveRewardModal" @ok="handleOk">
    <b-form @submit="onSubmit">
      <b-row>
          <b-col sm="12">
            <b-form-group>
              <label for="name">이름: </label>
              <b>{{ receiverName }}</b>
            </b-form-group>
            <b-form-group>
              <label for="tokens">금액: </label>
              <b>{{tokens}}</b>
            </b-form-group>
            <b-form-group>
              <label for="password">비밀번호</label>
              <b-form-input type="password" v-model="form.password" :state="!$v.form.password.$invalid" aria-describedby="password"></b-form-input>
                <b-form-invalid-feedback id="password">
                비밀번호를 입력해주세요
                </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
    </b-form>
  </b-modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'reward-modal',
  created () {
    this.$eventHub.$on('reward-modal-open', (title, tokens, receiverName, callback) => {
      this.title = title
      this.form.password = ''
      this.receiverName = receiverName
      this.tokens = tokens
      this.callback = callback
      this.activate()
    })
  },
  data () {
    return {
      title: '',
      tokens: 0,
      receiverName: '',
      isActiveRewardModal: false,
      form: {
        password: ''
      },
      callback: ''
    }
  },
  validations: {
    form: {
      password: {
        required
      }
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.submit()
    },
    activate () {
      this.isActiveRewardModal = true
    },
    deactivate () {
      this.isActiveRewardModal = false
    },
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      this.submit()
    },
    submit () {
      if (!this.$v.form.password.$invalid) {
        this.deactivate()
        this.callback(this.form.password)
      }
    }
  }
}
</script>
