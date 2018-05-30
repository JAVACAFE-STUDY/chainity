<template>
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
        <input type="text" class="form-control" v-model="item.email" placeholder="Email">
      </div>

      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text">
            <i class="icon-pie-chart"></i>
          </span>
        </div>
        <input type="text" class="form-control" v-model="item.balance" readonly>
      </div>

      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text">
            <i class="icon-people"></i>
          </span>
        </div>
        <input type="text" class="form-control" v-model="item.role" placeholder="Role">
      </div>

      <button type="button" class="btn btn-block btn-success">Update Profile</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data: () => {
    return {
      item: []
    }
  },
  mounted: function () {
    this.$http.get('/api/users/me')
      .then((response) => {
        alert(response.data[0])
        this.item = response.data[0]
      })
  }
}
</script>