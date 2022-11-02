<template>
  <v-container fluid>
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
              v-model="searchForm.clientName"
              label="거래처명"
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
        :height="400"
        @click:row="goSalesEstimateDetail"
        dense
        hide-default-footer
      >
        <template v-slot:[`item.createdDate`]="{ value }">
          {{ value | dateFormatter }}
        </template>
        <template v-slot:[`item.unitPrice`]="{ value }">
          {{ value | unitPriceFormatter }}
        </template>
        <template v-slot:[`item.totalPrice`]="{ value }">
          {{ value | unitPriceFormatter }}
        </template>

        <template v-slot:[`item.id`]="{ value }">
          <v-btn
            dark
            color="blue darken-1"
            small
            @click.stop="showDialogUpdate(value)"
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
    <modal-sales-estimate
      :visible.sync="dialog"
      :id="detailId"
      @save="createSalesEstimate"
      @update="updateSalesEstimate"
      @delete="deleteSalesEstimate"
      @close="closeDialog"
    ></modal-sales-estimate>
  </v-container>
</template>

<script>
import moment from 'moment'
import ModalSalesEstimate from './ModalSalesEstimate.vue'
import SearchBox from '@/components/SearchBox.vue'
const qs = require('qs')

export default {
  components: {
    SearchBox,
    ModalSalesEstimate,
  },
  name: 'SalesEstimateList',
  data() {
    ModalSalesEstimate
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
          text: '품명',
          value: 'productName',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '10%',
        },
        {
          text: '거래처명',
          value: 'clientName',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '10%',
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
          text: '단가',
          value: 'unitPrice',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '10%',
        },
        {
          text: '총금액',
          value: 'totalPrice',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '10%',
        },
        {
          text: '작성자',
          value: 'name',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '10%',
        },
        {
          text: '작성일자',
          value: 'createdDate',
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
          width: '10%',
        },
        {
          text: '상세',
          value: 'id',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '10%',
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
    unitPriceFormatter(value) {
      return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
  mounted() {
    this.onSearch()
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.loading = true
      const queryString = qs.stringify(this.searchForm)
      const apiUrl = `/sales-estimate?${queryString}`
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
    async createSalesEstimate(value) {
      const data = value
      const apiUrl = `/sales-estimate`
      await this.$axios
        .post(apiUrl, data)
        .then(({ status }) => {
          if (status === 200) {
            this.onSearch()
            //this.showSnackbar('등록 완료')
            this.detailId = null
          }
        })
        .catch((error) => {
          console.log(error)
          //this.showSnackbar('등록 실패')
        })
      // this.showSnackbar(error.response.data.message, 'error')
    },
    async updateSalesEstimate(value) {
      const data = value
      const apiUrl = `/sales-estimate/${this.detailId}`
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
    async deleteSalesEstimate(id) {
      const apiUrl = `/sales-estimate/${id}`
      await this.$axios
        .delete(apiUrl)
        .then(({ status }) => {
          if (status === 200) {
            this.onSearch()
            // this.showSnackbar('삭제 완료')
            this.detailId = null
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
    goSalesEstimateDetail(value) {
      this.$router.push({
        name: 'SalesEstimateDetail',
        params: {
          id: value.id,
        },
      })
    },
  },
}
</script>

<style></style>
