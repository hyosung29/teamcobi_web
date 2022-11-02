<template>
  <v-container fluid>
    <v-card-title class="font-weight-bold" 
    style="padding:0px; justify-content:center; font-size: 22px;"
    >구매거래처 조회</v-card-title>
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
            <v-text-field cols="6" label="거래유형 : 구매" disabled />
          </v-col>
          <v-col cols="8">
            <v-text-field v-model="searchForm.clientName" label="거래처명" clearable />
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
      <v-btn
        class="ml-3"
        color="#ebc934"
        width="50px"
        dark
        @click="downloadExcel"
        >Excel</v-btn
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
        @click:row="goPurchaseClientDetail"
        dense
        hide-default-footer
      >
        <template v-slot:[`item.createdDate`]="{ value }">
          {{ value | dateFormatter }}
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
    <modal-purchaseClient
      :visible.sync="dialog"
      :id="detailId"
      @save="(value) => createPurchaseClient(value)"
      @update="updatePurchaseClient"
      @delete="deletePurchaseClient"
      @close="closeDialog"
    ></modal-purchaseClient>
  </v-container>
</template>

<script>
import moment from 'moment'
import ModalPurchaseClient from './ModalPurchaseClient.vue'
import SearchBox from '@/components/SearchBox.vue'
import * as XLSX from 'xlsx'
const qs = require('qs')

export default {
  name: 'PurchaseClientList',
  components: {
    ModalPurchaseClient,
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
        type: '구매',
        page: 0,
        size: 10,
        sort: 'createdDate,desc',
      },
      headers: [
        {
          text: '거래유형',
          value: 'type',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '20%',
        },
        {
          text: '거래처명',
          value: 'clientName',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '20%',
        },
        {
          text: '대표자명',
          value: 'ceoName',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '20%',
        },
        {
          text: '연락처',
          value: 'telephone',
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
          width: '20%',
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
      return moment(value).format('YYYY-MM-DD hh:mm')
    },
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.loading = true
      const queryString = qs.stringify(this.searchForm)
      const apiUrl = `/purchase-client?${queryString}`
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
    async createPurchaseClient(value) {
      const data = value
      const apiUrl = `/purchase-client`
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
    async updatePurchaseClient(value) {
      const data = value
      const apiUrl = `/purchase-client/${this.detailId}`
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
    async deletePurchaseClient(id) {
      const apiUrl = `/purchase-client/${id}`
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

    goPurchaseClientDetail(value) {
      this.$router.push({
        name: 'PurchaseClientDetail',
        params: {
          id: value.id,
        },
      })
      // console.log('value', value.id)
    },

    downloadExcel(){
      const excelData = XLSX.utils.json_to_sheet(this.data.content); // this.items 는 json object 를 가지고있어야함 
      const workBook = XLSX.utils.book_new(); // 새 시트 생성 
      //XLSX.utils.sheet_add_aoa(workBook, this.data.headers);
      XLSX.utils.book_append_sheet(workBook, excelData, 'PurchaseClientList'); // 시트 명명, 데이터 지정
      XLSX.writeFile(workBook, 'PurchaseClientList.xlsx'); // 엑셀파일 만듦
    },

  },
}
</script>

<style></style>
