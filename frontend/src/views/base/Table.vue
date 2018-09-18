<template>
  <b-card :header="caption">
    <b-row>
      <b-col sm="12">
        <b-input-group>
          <b-form-input v-model="filter" placeholder="검색어를 입력해주세요." />
          <b-input-group-append>
            <b-btn :disabled="!filter" @click="filter = ''">지움</b-btn>
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
        {{ getRole(data.item.role) }}
      </template>
      <template slot="status" slot-scope="data">
        <b-badge :variant="getBadge(data.item.status)">{{data.item.status}}</b-badge>
      </template>
      <template slot="id" slot-scope="data">
        <b-link :to="data.item.id.toString()" append>{{data.item.id}}</b-link>
      </template>
      <template slot="price" slot-scope="data">
        ₩ {{ data.item.price }}
      </template>
      <template slot="tokens" slot-scope="data">
        JC {{ data.item.tokens }}
      </template>
      <template slot="name" slot-scope="data">
        <div class="avatar">
          <img class="img-avatar" :src="getProfileUrl(data.item.id)" onerror="this.onerror=null;this.src='../static/img/avatars/profile_thumbnail.jpg';">
        </div>
        &nbsp;{{ data.item.name }}
      </template>
      <template slot="tokenRequestUserName" slot-scope="data">
        <img class="img-avatar" :src="getProfileUrl(data.item.createdBy)" onerror="this.onerror=null;this.src='../static/img/avatars/profile_thumbnail.jpg';">
        {{ data.item.tokenRequestUserName }}
      </template>
      <template slot="tx" slot-scope="data">
        <b-link :href="'https://rinkeby.etherscan.io/tx/'+data.item.tx" target="_blank">{{data.item.tx.substring(0, 10) + '...'}}</b-link>
      </template>
      <template slot="tokensRequestAcceptible" slot-scope="data">
        <b-button variant="success" v-on:click="askPermissionAndTransferFrom(data.item)">승인</b-button>
      </template>
      <template slot="approveButton" slot-scope="data">
        <b-button variant="success" size="sm" @click.stop="$eventHub.$emit('approve-clicked', data.item)" class="mr-1">승인</b-button>
        <!-- <b-button size="sm" @click.stop="$root.$emit('bv::show::modal', 'registerRequest', $event.target)" class="mr-1">승인하기</b-button> -->
      </template>
      <template slot="roleDropdown" slot-scope="data">
        <b-dropdown text="변경" size="sm" variant="success">
          <b-dropdown-item @click.stop="$eventHub.$emit('role-admin-clicked', data.item)">관리자</b-dropdown-item>
          <b-dropdown-item @click.stop="$eventHub.$emit('role-user-clicked', data.item)">회원</b-dropdown-item>
        </b-dropdown>
        <!-- <b-button size="sm" @click.stop="$root.$emit('bv::show::modal', 'registerRequest', $event.target)" class="mr-1">승인하기</b-button> -->
      </template>
       <template slot="issueStatus" slot-scope="data">
         <!-- TODO: check closed by finishDate -->
         <b-badge v-if="data.item.isClosed == true" variant="error">종료</b-badge>
        <!-- TODO: check pending by startDate -->
         <!-- <b-badge v-else-if="data.item.startDate == true" variant="error">대기 중</b-badge> -->
         <b-badge v-else variant="success">진행 중</b-badge>
      </template>
      <template slot="createdAt" slot-scope="data">
          {{ (data.item.createdAt && data.item.createdAt != null) ? $moment.utc(data.item.createdAt).local().format('YYYY-MM-DD HH:mm:ss') : '' }}
      </template>
      <template slot="closedAt" slot-scope="data">
          {{ (data.item.closedAt && data.item.closedAt != null) ? $moment.utc(data.item.closedAt).local().format('YYYY-MM-DD HH:mm:ss') : '' }}
      </template>
      <template slot="registeredAt" slot-scope="data">
          {{ (data.item.registeredAt && data.item.registeredAt != null) ? $moment.utc(data.item.registeredAt).local().format('YYYY-MM-DD HH:mm:ss') : '' }}
      </template>
      <template slot="approvedAt" slot-scope="data">
          {{ (data.item.approvedAt && data.item.approvedAt != null) ? $moment.utc(data.item.approvedAt).local().format('YYYY-MM-DD HH:mm:ss') : ''}}
      </template>
      <template slot="startDate" slot-scope="data">
          {{ (data.item.startDate && data.item.startDate != null) ? $moment.utc(data.item.startDate).local().format('YYYY-MM-DD') : '미지정'}}
      </template>
      <template slot="finishDate" slot-scope="data">
          {{ (data.item.finishDate && data.item.finishDate != null) ? $moment.utc(data.item.finishDate).local().format('YYYY-MM-DD') : '미지정' }}
      </template>
      <template slot="eventFrom" slot-scope="data">
        <!-- <b-link :href="'https://rinkeby.etherscan.io/address/'+data.item.from" target="_blank">{{ data.item['from-ref'] ? data.item['from-ref'].name : (data.item.from.substring(0, 10) + '...') }}</b-link> -->
        {{ data.item['from-ref'] ? data.item['from-ref'].name : data.item.from }}
      </template>
      <template slot="eventTo" slot-scope="data">
        <!-- <b-link :href="'https://rinkeby.etherscan.io/address/'+data.item.to" target="_blank">{{ data.item['to-ref'] ? data.item['to-ref'].name : (data.item.to.substring(0, 10) + '...') }}</b-link> -->
        {{ data.item['to-ref'] ? data.item['to-ref'].name : data.item.to }}
      </template>
      <template slot="value" slot-scope="data">
        JC {{ data.item.value }}
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
    getRole (role) {
      return role === 'system' ? '슈퍼 관리자'
        : role === 'admin' ? '관리자' : '회원'
    },
    askPermissionAndTransferFrom (item) {
      this.$eventHub.$emit('pw-modal-open',
        '토큰 충전 요청 승인',
        '입금자명: <b>' + item.senderName + '</b><br/>' +
        '입금액: <b>₩ ' + item.price + '</b><br/>' +
        '위와 같은 입금 내역을 확인 하셨습니까?<br/>' +
        '승인 시, ' + item.tokenRequestUserName + '님에게 <b>JC ' + item.tokens + '을(를) 충전</b> 합니다.',
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
                  this.$http.put('/api/tokens-requests/' + item._id, {tx: item.tx, approvedAt: new Date()})
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
    getProfileUrl (userId) {
      return 'http://localhost:3000/api/images/' + userId + '/profile/thumbnail'
    }
  }
}
</script>
