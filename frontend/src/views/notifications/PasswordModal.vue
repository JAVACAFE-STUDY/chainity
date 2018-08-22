<template>
  <b-modal :title="title" v-model="isActive" @ok="handleOk">
    <b-form @submit="onSubmit">
      <b-row>
        <b-col sm="12">
          <b-form-group>
            <span v-html="message"></span>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12">
          <b-form-group>
            <!-- <label for="name">비밀번호</label> -->
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
  name: 'pw-modal',
  created () {
    this.$eventHub.$on('pw-modal-open', (title, message, callback) => {
      this.form.password = ''
      this.title = title
      this.message = message
      this.callback = callback
      this.activate()
    })
  },
  data () {
    return {
      title: '',
      message: '',
      isActive: false,
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
      this.isActive = true
    },
    deactivate () {
      this.isActive = false
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
