<template>
  <div class="animated fadeIn">
    <div class="card mx-4">
      <div class="card-body">
        <h1>Profile</h1>
      </div>
      <b-row>
        <b-col cols="5">
          <div class="card-body p-4">
            <b-img center fluid :src="imageData" alt="center image" />
            <br>
            <input type="file" @change="previewImage" accept="image/*">
          </div>
        </b-col>
        <b-col cols="7">
          <div class="card-body p-4">
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
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Profile',
  data: () => {
    return {
      item: [],
      tokens: 0,
      imageData: "https://picsum.photos/250/250/?image=54"
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
  },
  methods: {
    updateProfile: function (event) {
      this.$http.put('/api/users/me', this.item)
        .then((response) => {
          alert('업데이트 완료')
        })
    },
    previewImage: function(event) {
      var input = event.target;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
          this.imageData = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
      }
    }
  }
}

</script>
