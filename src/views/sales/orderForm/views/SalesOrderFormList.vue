<template>
  <v-container fluid>
    <board-title title="판매 주문서 조회" />
    <v-row class="pa-3" justify="start">
      <!-- 검색 시작 -->
      <search-box
        :model="searchForm"
        @submit="onSearch"
        @initialize="onInitializeSearch"
      >
        <!-- 태그 안에 작성 시 slot 태그에 작성됨 SearchBox.vue 참고 -->
        <v-row>
        <v-col cols="12" md="3">
          <v-text-field v-model="searchForm.productName" label="상품명" clearable />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field v-model="searchForm.clientName" label="업체명" clearable />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field v-model="searchForm.status" label="처리상태" clearable />
        </v-col>
      </v-row>
      </search-box>
      <!-- 검색 끝 -->
    </v-row>

    <v-card class="mt-2">
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="data.content"
        :itemPerPage="searchForm.sizessss"
        :height="400"
        @click:row="goOrderFormDetail"
        dense
        hide-default-footer
      >
        <template v-slot:[`item.createdDate`]="{ value }">
          {{ value | dateFormatter }}
        </template>
        <template v-slot:[`item.totalPrice`]="{ value }">
          {{ value | priceFormatter }}
        </template>
        <template v-slot:footer>
          <v-divider></v-divider>
          <v-pagination
            v-model="page"
            @input="onSearch"
            :length="data.totalPages"
            :total-visible="7"
          ></v-pagination>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import moment from 'moment'
import SearchBox from '@/components/SearchBox.vue'
const qs = require('qs')

export default {
  name: 'SalesOrderFormList',
  components: {
    SearchBox,
  },
  data() {
    return {
      loading: false,
      dialog: false,
      page: 1,
      detailId: null,
      searchForm: {
        clientName: null,
        page: 0,
        size: 10,
        sort: 'createdDate,desc',
      },
      headers: [
        {
          text: '구분',
          value: 'type',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '5%',
        },
        {
          text: '업체명',
          value: 'clientName',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '20%',
        },
        {
          text: '품명',
          value: 'productName',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '20%',
        },
        {
          text: '수량',
          value: 'productQuantity',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '10%',
        },
        {
          text: '금액',
          value: 'totalPrice',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '10%',
        },
        {
          text: '상태',
          value: 'status',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '20%',
        },
        {
          text: '요청일자',
          value: 'createdDate',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
      ],
      data: {
        content: [],
        totalPages: 1,
      },
    }
  },
  computed: {
    _page() {
      return this.page - 1
    },
  },
  filters: {
    dateFormatter(value) {
      return moment(value).format('YYYY-MM-DD')
    },
    priceFormatter(value) {
      return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.loading = true
      const queryString = qs.stringify(this.searchForm)
      const apiUrl = `/sales-orderform?${queryString}`
      await this.$axios
        .get(apiUrl)
        .then((res) => {
          // console.log(res)
          this.data = res.data
        })
        .catch((error) => {
          console.log(error)
        })
      this.loading = false
    },
    onSearch() {
      // this.searchForm.page = this._page 아래와 같음. 아래 방식이 vue 권장 사항
      this.$set(this.searchForm, 'page', this._page)
      this.fetchList()
    },
    onInitializeSearch() {
      Object.assign(this.searchForm, this.$options.data().searchForm)
      this.onSearch()
    },
    goOrderFormDetail(value) {
      this.$router.push({
        name: 'SalesOrderFormDetail',
        params: {
          id: value.id,
        },
      })
    },
  },
}
</script>

<style></style>