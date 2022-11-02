<template>
  <v-container fluid>
    <!-- 변경부분 시작 -->
    <v-row class="pa-3" justify="start">
      <!-- 검색 시작 -->
      <search-box
        :model="searchForm"
        @submit="onSearch"
        @initialize="onInitializeSearch"
      >
        <!-- 태그 안에 작성 시 slot 태그에 작성됨 SearchBox.vue 참고 -->
        <v-row>
          <!-- <v-col class="d-flex" cols="5">
            <v-select
              :items="items"
              label="Standard"
            ></v-select>
          </v-col> -->
          <v-col cols="5">
            <v-text-field v-model="searchForm.productName" label="상품명" clearable />
          </v-col>
          <v-col cols="5">
            <v-combobox v-model="searchForm.category" :items="category" label="카테고리" clearable></v-combobox>

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
    <!-- 변경부분 끝 -->
    
    <v-card class="mt-2">
      <v-data-table 
        :loading="loading"
        :headers="headers"
        :items="data.content"
        :itemPerPage="searchForm.size"
        :height="400"
        dense
        hide-default-footer
      >
        <template v-slot:[`item.createdDate`]="{ value }">
          {{ value | dateFormatter }}
        </template>
        <template v-slot:[`item.unitPrice`]="{ value }">
          {{ value | priceFormatter }}
        </template>
        <template v-slot:[`item.id`]="{ value }">
          <v-btn dark color="blue darken-1" small @click.stop="showDialogUpdate(value)">수정</v-btn>
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
    <modal-product
      :visible.sync="dialog"
      :id="detailId"
      @save="createProduct"
      @update="updateProduct"
      @delete="deleteProduct"
      @close="closeDialog"
    ></modal-product>
  </v-container>
</template>

<script>
import moment from 'moment'
import ModalProduct from './ModalProduct.vue'
import SearchBox from '@/components/SearchBox.vue'
const qs = require('qs')

export default {
  name: 'ProductList',
  components: {
    ModalProduct,
    SearchBox
  },
  data() {
    return {
      loading: false,
      dialog: false,
      page: 1,
      detailId: null,
      searchForm: {
        productName: null,
        category: null,
        page: 0,
        size: 10,
        sort: 'productName',
      },
      category: [
      '휴대폰','컴퓨터','노트북','주변기기'
      ],
      headers: [
        {
          text: '카테고리',
          value: 'category',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '상품명',
          value: 'productName',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '20%',
        },
        {
          text: '단가',
          value: 'unitPrice',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '등록일자',
          value: 'createdDate',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '20%',
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
      return moment(value).format('YYYY-MM-DD')
    },
    priceFormatter(value){
      return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.loading = true
      const queryString = qs.stringify(this.searchForm)
      const apiUrl = `/product?${queryString}`
      await this.$axios
        .get(apiUrl)
        .then((res) => {
          this.data = res.data
        })
        .catch((error) => {
          console.log(error)
        })
      this.loading = false
    },
    async createProduct(value) {
      const data = value
      const apiUrl = `/product`
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
    async updateProduct(value) {
      const data = value
      const apiUrl = `/product/${this.detailId}`
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
    async deleteProduct(id) {
      const apiUrl = `/product/${id}`
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
  },
}
</script>

<style></style>
