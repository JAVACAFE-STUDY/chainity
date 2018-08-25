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
      <template slot="id" slot-scope="data">
        <b-link :to="data.item.id.toString()" append>{{data.item.id}}</b-link>
      </template>
      <template slot="price" slot-scope="data">
        ₩ {{data.item.price}}
      </template>
      <template slot="tokens" slot-scope="data">
        JC {{data.item.tokens}}
      </template>
      <template slot="name" slot-scope="data">
        <img class="img-avatar" :src="getProfileUrl(data.item.id)" onerror="this.onerror=null;this.src='../static/img/avatars/profile_thumbnail.jpg';">
        {{data.item.name}}
      </template>
      <template slot="tx" slot-scope="data">
        <b-link :href="'https://rinkeby.etherscan.io/tx/'+data.item.tx" target="_blank">{{data.item.tx}}</b-link>
      </template>
      <template slot="tokensRequestAcceptible" slot-scope="data">
        <b-button variant="success" v-on:click="askPermissionAndTransferFrom(data.item)">승인</b-button>
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
      user: {}
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
    },
    fetchUser (userId) {
      this.$http.get('/api/users/' + userId)
        .then((response) => {
          this.users[userId] = response.data
        })
        .then(() => {
          if (userId === this.form.createdBy) {
            this.form.createdByName = this.users[userId].name
            // trick to change createdByName
            this.form.title = this.form.title + ' '
          }
        })
    },
    askPermissionAndTransferFrom (item) {
      this.$eventHub.$emit('pw-modal-open',
        '토큰 충전 요청 승인',
        '입금자명: <b>' + item.senderName + '</b><br/>' +
        '입금액: <b>₩ ' + item.price + '</b><br/>' +
        '위와 같은 입금 내역을 확인 하셨습니까?<br/>' +
        '승인 시, ' + item.createdBy + '님에게 <b>JC ' + item.tokens + '을(를) 충전</b> 합니다.',
        password => {
          this.$http.get('/api/users/' + item.createdBy)
          .then((response) => {
            var body = {
              receiver: response.data.keyStore.address,
              tokens: item.tokens,
              password: password
            }

            this.$http.post('/api/contracts/0x000/tokens', body)
              .then((response) => {
                console.log(response.data)
                item.tx = response.data.hash
                this.$http.put('/api/tokens-requests/' + item.id, {tx: item.tx, approvedDate: new Date()})
                  .then((response) => {
                    alert('승인 되었습니다.')
                  })
                }).catch((error) => {
                  alert(error.response.data.message)
                })
            })
        }
      )
    },
    getProfileUrl(userId) {
      return 'http://localhost:3000/api/users/' + userId + '/images/profile/thumbnail'
    }
  }
}
</script>
