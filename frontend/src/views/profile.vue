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
                <b-img width="200px" :src="user.avatar ? $http.defaults.baseURL + '/api/images/' + user.avatar : '/static/img/avatars/profile_thumbnail.jpg'" alt="로딩중..." />
                <div slot="header">프로필 사진</div>
                <div slot="footer" class="text-sm-center">
                  <b-button id="pick-avatar" block variant="success">프로필 사진 올리기</b-button>
                  <small v-if="!user.avatar">※ 최초 프로필 사진 등록시 1,000 JC 지급!</small>
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
    <b-modal ref="roleModalRef" :title="'프로필 사진 업데이트 완료'" :busy="modal.busy" :header-bg-variant="'dark'" :header-text-variant="'light'" @ok="handleOk">
      <b-form @submit="onSubmit">
        <b-row>
          <b-col sm="12">
            <b-form-group>
              <span>프로필 사진이 최초 등록되어, <b>{{ user.name }}</b>님에게 <b>JC {{ modal.form.tokens }}을(를) 지급</b> 합니다.</span>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="12">
            <b-form-group>
              <!-- <label for="name">비밀번호</label> -->
              <b-form-input type="password" v-model="modal.form.password" :state="!$v.modal.form.password.$invalid" aria-describedby="password"></b-form-input>
              <b-form-invalid-feedback id="password">
                비밀번호를 입력해주세요
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </div>
</template>

<script>

import AvatarCropper from 'vue-avatar-cropper'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

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
      },
      modal: {
        busy: false,
        form: {
          tokens: 1000
        }
      }
    }
  },
  created () {
    this.fetchUser()
    this.fetchToken()
  },
  mixins: [
    validationMixin
  ],
  validations: {
    modal: {
      form: {
        password: {
          required
        }
      }
    }
  },
  methods: {
    fetchUser () {
      this.user = {}
      this.$http.get('/api/users/me')
        .then((response) => {
          this.user = response.data
        })
    },
    fetchToken () {
      this.$http.get('/api/users/me/tokens')
        .then((response) => {
          this.tokens = response.data.tokens + ' JC'
        })
    },
    handleUploaded (resp) {
      this.$toastr.s('프로필 사진 업데이트 완료')
      this.$eventHub.$emit('thumbnail-changed')
      if(!this.user.avatar) {
        this.benefitFirstProfile();
      }
      this.fetchUser()
    },
    benefitFirstProfile () {
      this.modal.busy = false
      this.$v.$reset()
      this.showModal()
    },
    onSubmit (event) {
      this.$http.put('/api/users/' + this.user._id, this.user)
        .then((response) => {
          this.$toastr.s('프로필 업데이트 완료')
        })
    },
    showModal () {
      this.$refs.roleModalRef.show()
    },
    hideModal () {
      this.$refs.roleModalRef.hide()
    },
    resetModal () {
      this.modal = {}
    },
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      this.submit()
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.submit()
    },
    async submit () {
      var self = this
      this.$v.$touch()
      if (this.$v.$invalid) return

      this.modal.busy = true

      var body = {
        receiver: this.user.keyStore.address,
        tokens: this.modal.form.tokens,
        password: this.modal.form.password
      }
      var before
      try {
        before = this.$toastr.Add({
          title: '거래 내역',
          msg: '생성 중...',
          clickClose: false,
          timeout: 0,
          type: 'info'
        })

        const response = await this.$http.post('/api/contracts/mine/tokens', body)
        this.$toastr.Close(before)

        this.$toastr.Add({
          title: '거래 내역',
          msg: '블록체인 원장에 등록 중... (<a target="_blank" href="https://rinkeby.etherscan.io/tx/' + response.data.txHash + '">상세보기 <i class="fa fa-external-link" aria-hidden="true"></i></a>)',
          clickClose: false,
          timeout: 10000,
          type: 'info',
          progressBar: true,
          onClosed: function () {
            // TODO - websocket
            self.$toastr.s('등록 완료 (<a target="_blank" href="https://rinkeby.etherscan.io/tx/' + response.data.txHash + '">상세보기 <i class="fa fa-external-link" aria-hidden="true"></i></a>)', '거래 내역')
          }
        })

        this.fetchData()
        this.hideModal()
      } catch (error) {
        console.error(error)
        if (undefined !== before) {
          this.$toastr.Close(before)
        }
        this.$toastr.e('등록 실패' + error.response.data.message ? ': ' + error.response.data.message : '', '거래 내역')
      }

      this.modal.busy = false
    }
  }
}

</script>
