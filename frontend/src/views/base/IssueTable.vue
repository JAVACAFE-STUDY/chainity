<template>
  <b-card :header="caption">
    <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :fixed="fixed" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" @row-clicked="rowClickHandler">
      <template slot-scope="data">
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
  props: {
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
      fields: [
        {
          key: 'title',
          sortable: true
        },
        {
          key: 'count',
          sortable: true
        },
        {
          key: 'rewards',
          sortable: true
        },
        {
          key: 'dueDate',
          sortable: true
        },
        {
          key: 'status',
          sortable: true
        }
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: 0
    }
  },
  methods: {
    getRowCount (items) {
      return items.length
    },
    rowClickHandler (record, index) {
      this.$router.push({path: 'issueDetail', query: { id: record.id }})
    }
  }
}
</script>
