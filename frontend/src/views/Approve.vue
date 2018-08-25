<template>
  <div class="card">
    <div class="card-header">
      <div><strong>Approve</strong>
      </div>
    </div>
    <div class="card-body">
      <b-form novalidate="novalidate" class="was-validated" @submit="onSubmit" @reset="onReset">
        <div role="group" class="row">
          <div class="col-sm-12">
            <fieldset role="group" class="b-form-group form-group">
              <label class="mr-sm-2">주소</label>
              <input v-model="form.spender" type="text" placeholder="" required="required" aria-required="true" class="form-control-warning form-control">
            </fieldset>
          </div>
        </div>
        <div role="group" class="row">
          <div class="col-sm-12">
            <fieldset role="group" class="b-form-group form-group">
              <label class="mr-sm-2">토큰</label>
              <input v-model="form.tokens" type="number" min="0" placeholder="" required="required" aria-required="true" class="form-control">
            </fieldset>
          </div>
        </div>
        <div role="group" class="row">
          <div class="col-sm-12">
            <fieldset role="group" class="b-form-group form-group">
              <label class="mr-sm-2">패스워드</label>
              <input v-model="form.password" type="password" placeholder="" required="required" aria-required="true" class="form-control">
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
      return this.address.length > 2
    }
  },
  data () {
    return {
      form: {
        spender: '',
        tokens: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      if (this.form.address !== '' && this.form.tokens !== '') {
        this.$http.post('/api/contracts/0x000/approval', this.form)
          .then((response) => {
            console.log(response.data)
            if (response.data.result === 'success') {
              alert('충전 요청이 등록되었습니다.')
              this.form.spender = ''
              this.form.tokens = ''
              this.form.password = ''
            } else {
              alert(response.data.error)
            }
          })
      }
    },
    onReset (evt) {
      evt.preventDefault()
      /* Reset our form values */
      this.form.spender = ''
      this.form.tokens = ''
      this.form.password = ''
    }
  }
}
</script>
