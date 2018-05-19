<template>
  <div class="animated fadeIn">

    <b-row>
      <b-col sm="12">
        <c-table striped caption="<i class='fa fa-align-justify'></i> Striped Table"></c-table>
      </b-col><!--/.col-->
    </b-row><!--/.row-->

  </div>

</template>

<script>
import cTable from './base/Table.vue'

export default {
  name: 'tables',
  components: {cTable},
  mounted: function () {
    this.$http.get('/api/users')
      .then((response) => {
        this.$children[0].items = response.data
        this.$children[0].fields = [{key: 'name'}, {key: 'email'}, {key: 'role'}, {key: 'createdAt'}]
        this.$children[0].currentPage = 1
        this.$children[0].perPage = 5
        this.$children[0].totalRows = response.data.length
      })
  }
}
</script>
