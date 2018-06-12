<template>
  <div class="card">
    <div class="card-header">
      <div><strong>토큰 충전</strong>
      </div>
    </div>
    <div class="card-body">
      <b-form novalidate="novalidate" class="was-validated" @submit="onSubmit" @reset="onReset">
        <div role="group" class="row">
          <div class="col-sm-12">
            <fieldset role="group" class="b-form-group form-group">
              <label class="mr-sm-2">이름</label>
              <input v-model="form.name" type="text" placeholder="" required="required" aria-required="true" class="form-control-warning form-control">
            </fieldset>
          </div>
        </div>
        <div role="group" class="row">
          <div class="col-sm-12">
            <fieldset role="group" class="b-form-group form-group">
              <label class="mr-sm-2">충전금액</label>
              <input v-model="form.tokens" type="number" placeholder="" required="required" aria-required="true" class="form-control">
            </fieldset>
          </div>
        </div>
        <button type="submit" class="btn btn-primary"><i class="fa fa-dot-circle-o"></i> Submit</button>
        <button type="reset" class="btn btn-danger"><i class="fa fa-ban"></i> Reset</button>
      </b-form>
    </div>

  </div>

</template>

<script>
export default {
  computed: {
    nameState () {
      return this.name.length > 2
    }
  },
  data () {
    return {
      form: {
        email: 'test@gmail.com',
        name: '',
        tokens: '',
        status: ''
      }
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      if (this.form.name !== '' && this.form.tokens !== '') {
        this.$http.post('/api/banks/nh/transfers', {'value': this.form.tokens})
          .then((response) => {
            alert(response.data.Header.Rsms)
            if (response.status === 200) {
              this.form.status = 'Bank'
            } else {
              this.form.status = 'Fail'
            }
            this.$http.post('/api/token-requests', this.form)
              .then((response) => {
                this.form.status = ''
                this.form.name = ''
                this.form.tokens = ''
              })
          })
      }
    },
    onReset (evt) {
      evt.preventDefault()
      /* Reset our form values */
      this.form.name = ''
      this.form.tokens = ''
    }
  }
}
</script>
