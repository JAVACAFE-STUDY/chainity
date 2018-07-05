<template>
  <div class="animated fadeIn">
    <div class="card mx-4">
      <div class="card-body p-4">
        <h1>Profile</h1>
        <br>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="icon-user"></i>
            </span>
          </div>
          <input type="text" class="form-control" v-model="item.name" placeholder="Username">
        </div>

        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">@</span>
          </div>
          <input type="text" class="form-control" v-model="item.email" placeholder="Email" readonly>
        </div>

        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="icon-pie-chart"></i>
            </span>
          </div>
          <input type="text" class="form-control" v-model="tokens" readonly>
        </div>

        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="icon-home"></i>
            </span>
          </div>
          <input type="text" class="form-control" v-model="item.keyStore.address" readonly>
        </div>

        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="icon-people"></i>
            </span>
          </div>
          <input type="text" class="form-control" v-model="item.role" placeholder="Role" readonly>
        </div>

        <button type="button" v-on:click="updateProfile" class="btn btn-block btn-success">Update Profile</button>
      </div>
    </div>

    <b-row>
      <b-col sm="12">
        <c-table class="card mx-4" ref="table" v-if="tokensRequest !== null" striped :rows="tokensRequest" :columns="tokensRequestFields" caption="<i class='fa fa-align-justify'></i> 충전 신청 내역"></c-table>
      </b-col><!--/.col-->
    </b-row><!--/.row-->
  </div>
</template>

<script>
import cTable from './base/Table.vue'

export default {
  name: 'Profile',
  components: {cTable},
  data: () => {
    return {
      item: [],
      tokens: 0,
      tokensRequest: null,
      tokensRequestFields: [{key: 'name', sortable: true}, {key: 'registered', sortable: true}, {key: 'tokens', sortable: true}, {key: 'status', sortable: true}]
    }
  },
  mounted: function () {
    this.$http.get('/api/users/me')
      .then((response) => {
        this.item = response.data
        this.item.keyStore.address = '0x' + response.data.keyStore.address
      })

    this.$http.get('/api/users/token')
      .then((response) => {
        this.tokens = response.data.token + ' JC'
      })

    this.$http.get('/api/token-requests/me')
      .then((response) => {
        this.tokensRequest = response.data
      })
  },
  methods: {
    updateProfile: function (event) {
      this.$http.put('/api/users/me', this.item)
        .then((response) => {
          alert('업데이트 완료')
        })
    }
  }
}

</script>
