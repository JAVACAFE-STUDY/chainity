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
      value: '0'
    }
  },
  mounted: function () {
    this.$http.get('http://localhost:3000/api/balance/0xA5C4B67A464AA5A511f0C8B360b2e8Ad83a49A06')
      .then((response) => {
        this.value = response.data
      })
  }
}
</script>
