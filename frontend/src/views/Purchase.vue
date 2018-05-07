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
              <input v-model="form.balance" type="number" placeholder="" required="required" aria-required="true" class="form-control">
            </fieldset>
          </div>
        </div>
        <b-button type="submit" class="btn btn-primary btn-sm"><i class="fa fa-dot-circle-o"></i> Submit</b-button>
        <b-button type="reset" class="btn btn-danger btn-sm"><i class="fa fa-ban"></i> Reset</b-button>
      </b-form>
    </div>

  </div>

</template>

<script>
  export default {
    computed: {
      nameState () {
        return this.name.length > 2 ? true : false
      }
    },
    data() {
      return {
        form: {
          id: '1',
          name: '',
          balance: ''
        }
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault();
        if(this.form.name != '' && this.form.balance != '') {
          this.$http.post('http://localhost:3000/api/purchase', this.form)
            .then((response) => {
              alert(JSON.stringify(response.data));
            })
        }
      },
      onReset(evt) {
        evt.preventDefault();
        /* Reset our form values */
        this.form.name = '';
        this.form.balance = '';
      }
    }
  }
</script>
