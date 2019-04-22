<template>
  <div class="animated fadeIn">
    <b-card>
      <b-row>
        <b-col sm="12">
          <h4 class="card-title mb-0">프로필</h4>
          <div class="small text-muted">가입일시: {{ $moment.utc(user.createdAt).local().format('YYYY-MM-DD HH:mm:ss') }}</div>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="8">
          <b-row>
            <b-col sm="12">
              <Callout variant="success">
                <small class="text-muted">이름</small><br>
                <strong class="h4" v-if="!editable">{{ user.name }} <span class="h3 text-muted text-left mb-4"><b-link v-on:click="setEditable(true)"><i class="icon-pencil"></i></b-link></span></strong>
                <b-input-group v-else>
                  <b-btn variant="success" slot="append" v-on:click="updateUser">변경</b-btn>
                  <b-btn variant="secondary" slot="append" v-on:click="setEditable(false)">취소</b-btn>
                  <b-form-input :value="user.name" @input="updateNewName"></b-form-input>
                </b-input-group>
              </Callout>
            </b-col>
            <b-col sm="12">
              <Callout variant="info">
                <small class="text-muted">이메일</small><br>
                <strong class="h4">{{ user.email }}</strong>
              </Callout>
            </b-col>
            <b-col sm="12">
              <Callout variant="info">
                <small class="text-muted">역활</small><br>
                <strong class="h4">{{ user.role === 'system' ? '슈퍼 관리자' : user.role === 'admin' ? '관리자' : '회원' }}</strong>
              </Callout>
            </b-col>
            <b-col sm="12">
              <Callout variant="danger">
                <small class="text-muted">지갑주소</small><br>
                <strong class="h4">{{ user.keyStore ? '0x'+user.keyStore.address : '' }}</strong>
              </Callout>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="4">
          <b-row>
            <b-col sm="12">
              <b-card show-footer border-variant="white" footer-border-variant="white" footer-bg-variant="transparent">
                <b-img thumbnail fluid :src="user.avatar ? $http.defaults.baseURL + '/api/images/' + user.avatar : '/static/img/avatars/profile.jpg'" alt="로딩중..." />
                <div slot="footer" class="text-sm-center">
                  <b-button id="pick-avatar" block variant="success">프로필 사진 올리기</b-button>
                  <small v-if="!user.avatar">※ 최초 프로필 사진 등록시 1,000 JC 지급!</small>
                </div>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>
    <avatar-cropper
              @uploaded="handleUploaded"
              trigger="#pick-avatar"
              :labels="{submit: '완료', cancel: '취소'}"
              :upload-headers="{Authorization: 'Bearer '+$session.get('user-token')}"
              :upload-url="$http.defaults.baseURL+'/api/users/me/images/profile'" />
    <b-modal ref="modalRef" :title="'프로필 사진 업데이트 완료'" :busy="modal.busy" :header-bg-variant="'dark'" :header-text-variant="'light'" @ok="handleOk">
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
import { Callout } from '../components/'

export default {
  name: 'Profile',
  components: {
    AvatarCropper,
    Callout
  },
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
      },
      editable: false
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
      if (!this.user.avatar) {
        this.benefitFirstProfile()
      }
      this.fetchUser()
    },
    benefitFirstProfile () {
      this.modal.busy = false
      this.$v.$reset()
      this.showModal()
    },
    setEditable (value) {
      if (value) {
        this.newName = this.user.name
      }
      this.editable = value
    },
    updateNewName (value) {
      this.newName = value
    },
    updateUser () {
      this.$http.put('/api/users/' + this.user._id, { name: this.newName })
        .then((response) => {
          this.editable = false
          this.fetchUser()
          this.$toastr.s('프로필 업데이트 완료')
        })
    },
    showModal () {
      this.$refs.modalRef.show()
    },
    hideModal () {
      this.$refs.modalRef.hide()
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

        this.fetchUser()
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
