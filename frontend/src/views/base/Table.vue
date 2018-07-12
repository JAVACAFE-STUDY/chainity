<template>
  <b-card :header="caption">
    <b-table ref="table"
             :hover="hover"
             :striped="striped"
             :bordered="bordered"
             :small="small"
             :fixed="fixed"
             responsive="sm"
             :items="items"
             :fields="fields"
             :current-page="currentPage"
             :per-page="perPage">
      <template slot="role" slot-scope="data">
        <select class="form-control" v-model="data.item.role" v-on:change="onChange(data.item)">
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="system">system</option>
        </select>
      </template>
      <template slot="status" slot-scope="data">
        <b-badge :variant="getBadge(data.item.status)">{{data.item.status}}</b-badge>
      </template>
    </b-table>
    <nav>
      <b-pagination :total-rows="getRowCount(items)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
    </nav>
  </b-card>
</template>

<script>

export default {
  name: 'c-table',
  created () {
    this.items = this.rows
    this.fields = this.columns
  },
  props: {
    rows: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => [{key: 'name'}]
    },
    caption: {
      type: String,
      default: 'Table'
    },
    hover: {
      type: Boolean,
      default: false
    },
    striped: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      items: [],
      fields: [],
      currentPage: 1,
      perPage: 5,
      totalRows: 0
    }
  },
  methods: {
    getBadge (status) {
      return status === 'Active' ? 'success'
        : status === 'Inactive' ? 'secondary'
          : status === 'Pending' ? 'warning'
            : status === 'Banned' ? 'danger' : 'primary'
    },
    getRowCount (items) {
      return items.length
    },
    onChange (item) {
      this.$http.put('/api/users/me', item)
        .then((response) => {
          alert('업데이트 완료')
        })
    }
  }
}
</script>
