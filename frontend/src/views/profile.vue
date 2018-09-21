<template>
  <div class="animated fadeIn">
    <div class="card mx-4">
      <div class="card-body">
        <h1>프로필</h1>
      </div>
      <b-row>
          <!-- <div class="card-body p-4">
            <b-img center fluid :src="previewData" onerror="this.onerror=null;this.src='static/img/avatars/profile.jpg';" alt="center image" />
            <br>
            <input type="file" @change="previewImage" accept="image/*">
          </div> -->
        <b-col cols="7">
          <div class="card-body p-4">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon-user"></i>
                </span>
              </div>
              <input type="text" class="form-control" v-model="user.name" placeholder="Username">
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">@</span>
              </div>
              <input type="text" class="form-control" v-model="user.email" placeholder="Email" readonly>
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
              <input type="text" class="form-control" :value="user.keyStore ? '0x'+user.keyStore.address : ''" readonly>
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon-people"></i>
                </span>
              </div>
              <input type="text" class="form-control" v-model="user.role" placeholder="Role" readonly>
            </div>

            <button type="button" v-on:click="onSubmit" class="btn btn-block btn-success">수정</button>
          </div>
        </b-col>
        <b-col cols="5">
          <div class="card-body p-4">
            <b-row>
              <b-card show-footer>
                <b-img width="200px" :src="user.avatar ? $http.defaults.baseURL + '/api/images/' + user.avatar : 'static/img/avatars/profile_thumbnail.jpg'" alt="로딩중..." />
                <div slot="header">프로필 사진</div>
                <div slot="footer" class="text-sm-right">
                  <b-button id="pick-avatar" block variant="success">프로필 사진 올리기</b-button>
                </div>
              </b-card>
            </b-row>
          </div>
        </b-col>
      </b-row>
    </div>
    <avatar-cropper
              @uploaded="handleUploaded"
              trigger="#pick-avatar"
              :labels="{submit: '완료', cancel: '취소'}"
              :upload-headers="{Authorization: 'Bearer '+$session.get('user-token')}"
              :upload-url="$http.defaults.baseURL+'/api/users/me/images/profile'" />
  </div>
</template>

<script>

import AvatarCropper from 'vue-avatar-cropper'

export default {
  name: 'Profile',
  components: { AvatarCropper },
  data: () => {
    return {
      user: {},
      tokens: 0,
      avatarUrl: 'static/img/avatars/profile.jpg',
      imageData: null,
      avatar: {
        labels: {
          submit: '완료',
          cancel: '취소'
        }
      }
    }
  },
  created () {
    this.fetchUser()
    this.fetchToken()
  },
  methods: {
    fetchUser() {
      this.user = {}
      this.$http.get('/api/users/me')
      .then((response) => {
        this.user = response.data
      })
    },
    fetchToken() {
      this.$http.get('/api/users/me/tokens')
      .then((response) => {
        this.tokens = response.data.tokens + ' JC'
      })
    },
    handleUploaded(resp) {
      this.$toastr.s('프로필 사진 업데이트 완료')
      this.$eventHub.$emit('thumbnail-changed')
      this.fetchUser()
    },
    onSubmit(event) {
      this.$http.put('/api/users/' + this.user._id, this.user)
        .then((response) => {
          this.$toastr.s('프로필 업데이트 완료')
        })
    }
  }
}

</script>
