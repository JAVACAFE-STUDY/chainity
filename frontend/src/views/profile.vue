<template>
  <div class="animated fadeIn">
    <div class="card mx-4">
      <div class="card-body">
        <h1>프로필</h1>
      </div>
      <b-row>
        <b-col cols="5">
          <div class="card-body p-4">
            <b-img center fluid :src="previewData" onerror="this.onerror=null;this.src='static/img/avatars/profile.jpg';" alt="center image" />
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

            <button type="button" v-on:click="onSubmit" class="btn btn-block btn-success">수정</button>
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
      previewData: null,
      imageData: null
    }
  },
  mounted: function () {
    this.$http.get('/api/users/me')
      .then((response) => {
        this.item = response.data
        this.item.keyStore.address = '0x' + response.data.keyStore.address
        this.previewData = 'http://localhost:3000/api/users/' + this.item._id + '/images/profile'
      })

    this.$http.get('/api/users/token')
      .then((response) => {
        this.tokens = response.data.token + ' JC'
      })
  },
  methods: {
    onSubmit: function (event) {
      if (this.imageData == null) {
        this.updateProfile()
      } else {
        const formData = new FormData()
        formData.append('profile', this.imageData[0], this.item._id)
        this.$http.post('/api/users/' + this.item._id + '/images/profile', formData)
          .then((response) => {
            if (response.data.result === 'Success') {
              this.updateProfile()
            } else {
              alert('업데이트 실패')
            }
          })
      }
    },
    previewImage: function (event) {
      var input = event.target
      if (input.files && input.files[0]) {
        this.imageData = event.target.files
        var reader = new FileReader()
        reader.onload = (e) => {
          this.previewData = e.target.result
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    updateProfile: function () {
      this.$http.put('/api/users/me', this.item)
        .then((response) => {
          if (response.status === 200) {
            alert('업데이트 완료')
          } else {
            alert('업데이트 실패')
          }
        })
    }
  }
}

</script>
