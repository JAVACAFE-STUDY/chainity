<template>
      <b-nav-item-dropdown right no-caret>
        <template slot="button-content">
          <img src="static/img/avatars/6.jpg" class="img-avatar" alt="admin@bootstrapmaster.com">
        </template>
        <b-dropdown-header tag="div" class="text-center"><strong>설정</strong></b-dropdown-header>
        <b-dropdown-item @click="profile"><i class="fa fa-user"></i> 프로필</b-dropdown-item>
        <b-dropdown-item @click="payments"><i class="fa fa-usd"></i> 토큰 관리<b-badge variant="secondary">{{itemsCount}}</b-badge></b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="logout"><i class="fa fa-lock"></i> 로그아웃</b-dropdown-item>
      </b-nav-item-dropdown>
</template>
<script>
export default {
  name: 'header-dropdown',
  data: () => {
    return { itemsCount: 42 }
  },
  methods: {
    logout (e) {
      e.preventDefault()
      this.$session.destroy()
      this.$router.push('/login')
    },
    profile (e) {
      e.preventDefault()
      this.$router.push('/Profile')
    },
    payments (e) {
      e.preventDefault()
      this.$router.push('/my-tokens')
    }
  }
}
</script>
