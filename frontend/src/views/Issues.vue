<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <c-table striped caption="<i class='fa fa-align-justify'></i> 이슈 리스트"></c-table>
      </b-col><!--/.col-->
    </b-row><!--/.row-->
    <!-- <router-link to="./addIssue">이슈 등록</router-link> -->
    <b-button variant="primary" v-on:click="addIssue">이슈 등록</b-button>
  </div>
</template>

<script>
import cTable from './base/IssueTable.vue'

export default {
  name: 'tables',
  components: {cTable},
  mounted: function () {
    this.$http.get('/api/issue')
      .then((response) => {
        this.$children[0].items = response.data
      })
  },
  methods: {
    addIssue: function (event) {
      this.$router.push('/addIssue')
    }
  }
}
</script>
