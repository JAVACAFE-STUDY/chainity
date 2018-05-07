<template>
  <div id="balance" class="animated fadeIn">
    <b-card title="토큰 조회"
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2">
      <h1 style="text-align:  right;">
        {{ value }}
      </h1>
    </b-card>
  </div>

</template>

<script>
export default {
  name: 'Balance',
  mounted: function () {
    this.$http.get('http://localhost:3000/api/balance/1')
      .then((response) => {
        var example2 = new Vue({
          el: '#balance',
          data: {
            value: response.data[0].balance
          }
        })

        console.log(response.data[0].balance)
      })
  }
}
</script>
