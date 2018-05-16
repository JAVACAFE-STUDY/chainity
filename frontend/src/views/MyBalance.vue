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
    this.$http.get('http://localhost:3000/api/balance/1')
      .then((response) => {
        this.value = numberWithCommas(response.data[0].balance)
      })
  }
}

function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

</script>
