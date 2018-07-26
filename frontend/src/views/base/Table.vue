<template>
  <b-card :header="caption">
    <b-row>
      <b-col sm="12">
        <b-input-group>
          <b-form-input v-model="filter" placeholder="Type to Search" />
          <b-input-group-append>
            <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-table ref="table"
             @filtered="onFiltered"
             :filter="filter"
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
        <div v-if="(user.role === 'system')">
          <select class="form-control" v-model="data.item.role" v-on:change="onChange(data.item)">
              <option value="user">user</option>
              <option value="admin">admin</option>
              <option value="system">system</option>
          </select>
        </div>
        <div v-else>
          {{data.item.role}}
        </div>
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
    this.$http.get('/api/users/me')
      .then((response) => {
        this.user = response.data
      })
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
      totalRows: 0,
      filter: null,
      user: null
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
      this.$http.put('/api/users/' + item.id, {
        role: item.role
      })
        .then((response) => {
          alert('업데이트 완료')
        })
    },
    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  }
}
</script>
