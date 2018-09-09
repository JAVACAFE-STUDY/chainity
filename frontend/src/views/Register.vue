<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <b-form novalidate="novalidate" class="was-validated" @submit="onSubmit">
                <h1>회원가입</h1>
                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text>@</b-input-group-text>
                  </b-input-group-prepend>
                  <input v-model="form.email" type="text" class="form-control" placeholder="Email" readonly>
                </b-input-group>

                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-user"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <input v-model="form.name" type="text" class="form-control" placeholder="이름">
                </b-input-group>

                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <input v-model="form.password" type="password" class="form-control" placeholder="비밀번호">
                </b-input-group>

                <b-input-group class="mb-4">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <input v-model="form.repeatPassword" type="password" class="form-control" placeholder="비밀번호 확인">
                </b-input-group>

                <b-button type="submit" variant="success" block>가입하기</b-button>
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Register',
  data () {
    return {
      form: {
        _id: this.$route.params._id,
        email: this.$route.params.email,
        name: '',
        password: '',
        repeatPassword: ''
      }
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      if (this.form.password !== this.form.repeatPassword) {
        alert('')
        return
      }
      this.$http.post('/api/auth/register', this.form)
        .then((response) => {
          this.$router.push('/register-complete')
        }).catch((error) => {
          alert(error.response.data.message)
        })
    }
  }
}
</script>
