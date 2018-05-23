<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <b-form novalidate="novalidate" class="was-validated" @submit="onSubmit">
                <h1>Register</h1>
                <p class="text-muted">Create your account</p>
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
                  <input v-model="form.userName" type="text" class="form-control" placeholder="Username">
                </b-input-group>

                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <input v-model="form.password" type="password" class="form-control" placeholder="Password">
                </b-input-group>

                <b-input-group class="mb-4">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <input v-model="form.repeatPassword" type="password" class="form-control" placeholder="Repeat password">
                </b-input-group>

                <b-button variant="success" block>Create Account</b-button>
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
        email: this.$route.params.email,
        userName: '',
        password: '',
        repeatPassword: ''
      }
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      if (this.form.email !== '' && this.form.name !== '' && this.form.password !== '') {
        if (this.form.password !== this.form.repeatPassword) {
          alert('Repeat your password again!')
          return
        }
        this.$http.put('/api/auth/users/' + this.form.email, this.form)
          .then((response) => {
            if (response.status === 200) {
              this.$session.start()
              this.$session.set('user-token', response.data.token)
              this.$http.defaults.headers.common['Authorization'] = response.data.token
              this.$router.push('/')
            }
          }).catch((error) => {
            alert(error.response.data.message)
          })
      }
    }
  }
}
</script>
