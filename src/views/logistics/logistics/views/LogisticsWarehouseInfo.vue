<template>
  <v-container fluid>
    <!-- title start -->
    <board-title title="창고정보" />
    <!-- title end -->
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
            <v-text-field
              v-model="searchForm.warehouseName"
              label="창고명"
              clearable
            />
          </v-col>
        </v-row>
      </search-box>
      <!-- 검색 끝 -->
      <v-btn
        class="ml-3"
        color="blue darken-2"
        width="50px"
        dark
        @click="showDialog"
        >등록</v-btn
      >
    </v-row>

    <v-card class="mt-2">
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="data.content"
        :itemPerPage="searchForm.size"
        :min-height="400"
        dense
        hide-default-footer
      >
        <template v-slot:[`item.createdDate`]="{ value }">
          {{ value | dateFormatter }}
        </template>
        <template v-slot:[`item.volume`]="{ item }">
          {{ item.quantity }}/{{ item.volume }} ({{
            (item.quantity / item.volume) * 100
          }}%)
        </template>
        <template v-slot:[`item.id`]="{ value }">
          <v-btn
            dark
            color="blue darken-1"
            small
            @click="showDialogUpdate(value)"
            >수정</v-btn
          >
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
    <modal-warehouse
      :visible.sync="dialog"
      :id="detailId"
      @save="createWarehouse"
      @update="updateWarehouse"
      @delete="deleteWarehouse"
      @close="closeDialog"
    ></modal-warehouse>
  </v-container>
</template>

<script>
import moment from 'moment'
import SearchBox from '@/components/SearchBox.vue'
const qs = require('qs')
import ModalWarehouse from './ModalWarehouse.vue'

export default {
  components: {
    SearchBox,
    ModalWarehouse,
  },
  name: 'WarehouseList',
  data() {
    ModalWarehouse
    return {
      loading: false,
      dialog: false,
      page: 1,
      // detailId: null 없으면 콘솔창에 에러뜸.  - 효성
      detailId: null,
      searchForm: {
        warehouseName: null,
        page: 0,
        size: 10,
        sort: 'warehouseName',
      },
      headers: [
        {
          text: '작성자',
          value: 'name',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '20%',
        },
        {
          text: '창고명',
          value: 'warehouseName',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '20%',
        },
        {
          text: '용적률',
          value: 'volume',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '20%',
        },
        {
          text: '창고상태',
          value: 'status',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '20%',
        },
        {
          text: '창고 수정',
          value: 'id',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '30px',
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
      return moment(value).format('YYYY-MM-DD HH:mm')
    },
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.loading = true
      const queryString = qs.stringify(this.searchForm)
      const apiUrl = `/warehouse?${queryString}`
      // const apiUrl = `/warehouse?${queryString}`
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
    async createWarehouse(value) {
      const data = value
      const apiUrl = `/warehouse`
      await this.$axios
        .post(apiUrl, data)
        .then(({ status }) => {
          if (status === 200) {
            this.onSearch()
            // this.showSnackbar('등록 완료')
            this.detailId = null
          }
        })
        .catch((error) => {
          console.log(error)
        })
      // this.showSnackbar(error.response.data.message, 'error')
    },
    async updateWarehouse(value) {
      const data = value
      const apiUrl = `/warehouse/${this.detailId}`
      await this.$axios
        .put(apiUrl, data)
        .then(({ status }) => {
          if (status === 200) {
            this.onSearch()
            // this.showSnackbar('수정 완료')
            this.detailId = null
          }
        })
        .catch((error) => {
          console.log(error)
        })
      // this.showSnackbar(error.response.data.message, 'error')
    },
    async deleteWarehouse(id) {
      const apiUrl = `/warehouse/${id}`
      await this.$axios
        .delete(apiUrl)
        .then(({ status }) => {
          if (status === 200) {
            this.onSearch()
            // this.showSnackbar('삭제 완료')
          }
        })
        .catch((error) => {
          console.log(error)
        })
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

    showDialog() {
      this.dialog = true
    },
    closeDialog() {
      this.detailId = null
      this.dialog = false
    },
    showDialogUpdate(id) {
      this.detailId = id
      this.dialog = true
    },
  },
}
</script>

<style></style>
