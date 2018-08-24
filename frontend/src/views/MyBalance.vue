<template>
  <div id="balance" class="animated fadeIn">
    <b-card title="토큰 조회"
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2">
      <h1 style="text-align:  right;">
        {{ value }} JC
      </h1>
    </b-card>
  </div>

</template>

<script>
export default {
  name: 'Balance',
  data: () => {
    return {
      value: '0',
      my_id: null
    }
  },
  mounted: function () {
    this.$http.get('/api/users/token')
      .then((response) => {
        this.value = response.data.token
      })
  }
}
</script>
