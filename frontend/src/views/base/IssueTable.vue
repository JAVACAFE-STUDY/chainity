<template>
  <b-card :header="caption">
    <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :fixed="fixed" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
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
/**
   * Randomize array element order in-place.
   * Using Durstenfeld shuffle algorithm.
   */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

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
      items: shuffleArray([
        {title: 'Samppa Nori', due_date: '2012/01/01', rewards: 'Member', status: 'Active'},
        {title: 'Estavan Lykos', due_date: '2012/02/01', rewards: 'Staff', status: 'Banned'},
        {title: 'Chetan Mohamed', due_date: '2012/02/01', rewards: 'Admin', status: 'Inactive'},
        {title: 'Derick Maximinus', due_date: '2012/03/01', rewards: 'Member', status: 'Pending'},
        {title: 'Friderik Dávid', due_date: '2012/01/21', rewards: 'Staff', status: 'Active'},
        {title: 'Yiorgos Avraamu', due_date: '2012/01/01', rewards: 'Member', status: 'Active'},
        {title: 'Avram Tarasios', due_date: '2012/02/01', rewards: 'Staff', status: 'Banned'},
        {title: 'Quintin Ed', due_date: '2012/02/01', rewards: 'Admin', status: 'Inactive'},
        {title: 'Enéas Kwadwo', due_date: '2012/03/01', rewards: 'Member', status: 'Pending'},
        {title: 'Agapetus Tadeáš', due_date: '2012/01/21', rewards: 'Staff', status: 'Active'},
        {title: 'Carwyn Fachtna', due_date: '2012/01/01', rewards: 'Member', status: 'Active'},
        {title: 'Nehemiah Tatius', due_date: '2012/02/01', rewards: 'Staff', status: 'Banned'},
        {title: 'Ebbe Gemariah', due_date: '2012/02/01', rewards: 'Admin', status: 'Inactive'},
        {title: 'Eustorgios Amulius', due_date: '2012/03/01', rewards: 'Member', status: 'Pending'},
        {title: 'Leopold Gáspár', due_date: '2012/01/21', rewards: 'Staff', status: 'Active'},
        {title: 'Pompeius René', due_date: '2012/01/01', rewards: 'Member', status: 'Active'},
        {title: 'Paĉjo Jadon', due_date: '2012/02/01', rewards: 'Staff', status: 'Banned'},
        {title: 'Micheal Mercurius', due_date: '2012/02/01', rewards: 'Admin', status: 'Inactive'},
        {title: 'Ganesha Dubhghall', due_date: '2012/03/01', rewards: 'Member', status: 'Pending'},
        {title: 'Hiroto Šimun', due_date: '2012/01/21', rewards: 'Staff', status: 'Active'},
        {title: 'Vishnu Serghei', due_date: '2012/01/01', rewards: 'Member', status: 'Active'},
        {title: 'Zbyněk Phoibos', due_date: '2012/02/01', rewards: 'Staff', status: 'Banned'},
        {title: 'Einar Randall', due_date: '2012/02/01', rewards: 'Admin', status: 'Inactive'},
        {title: 'Félix Troels', due_date: '2012/03/21', rewards: 'Staff', status: 'Active'},
        {title: 'Aulus Agmundr', due_date: '2012/01/01', rewards: 'Member', status: 'Pending'}
      ]),
      fields: [
        {key: 'title'},
        {key: 'due_date'},
        {key: 'rewards'},
        {key: 'status'}
      ],
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
    }
  }
}
</script>
