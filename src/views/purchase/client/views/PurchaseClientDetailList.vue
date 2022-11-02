<template>
  <v-container fluid>
    <div ref="pdfarea">
      <v-card-title class="font-weight-bold" 
      style="padding:0px; justify-content:center; font-size: 22px;"
      >구매거래처 상세 조회</v-card-title>
      <v-row class="pa-3" justify="start">
        <search-box
          :model="searchForm"
          @submit="onSearch"
          @initialize="onInitializeSearch"
        >
          <v-row>
            <v-col cols="3">
              <v-text-field
                label="거래유형"
              />
            </v-col>
            <v-col cols="5">
              <v-text-field cols="6"
                label="판매"
                disabled
              />
            </v-col>
            <v-col cols="8">
              <v-text-field v-model="searchForm.name" label="거래처명" clearable />
            </v-col>
          </v-row>
        </search-box>
            <v-btn 
            class="ml-3"
            color="blue darken-2"
            width="80px"
            dark
            style="cursor:pointer;" 
            @click="exportToPDF">PDF 출력</v-btn>
      </v-row> 

    
      <v-card class="mt-2">
        <v-data-table
          :loading="loading"
          :headers="headers"
          :items="data.content"       
          :items-per-page="10"
          class="elevation-1"
        >
        <template v-slot:[`item.id`]="{ value }">
            <v-btn dark color="blue darken-1" small @click="showModalClientDetail(value)">주문상세</v-btn>
        </template>
      </v-data-table>
      </v-card>    
      <modal-purchaseClientDetail
        :visible.sync="dialog"
        :id="detailId"
        @update="updateSalesClient"
        @delete="deleteSalesClient"
        @close="closeDialog"
      ></modal-purchaseClientDetail>
    </div>
  </v-container>
</template>


<script>
import moment from 'moment'
import ModalPurchaseClientDetail from './ModalPurchaseClientDetail.vue'
import SearchBox from '@/components/SearchBox.vue'
import html2pdf from 'html2pdf.js'
const qs = require('qs')

export default {
  name: 'PurchaseClientDetailList',
  components: {
    ModalPurchaseClientDetail,
    SearchBox,
  },
  data() {
    return {
      propTitle: 'mypdf',
      loading: false,
      dialog: false,
      detailId: null,

      searchForm: {
        clientName: null,
        page: 0,
        size: 10,
        sort: 'createdDate,desc',
      },

      headers: [
          {
            text: '거래처코드',
            align: 'start',
            sortable: false,
            value: 'clientNum',
          },
          { text: '거래처명', value: 'clientName' },
          { text: '거래유형', value: 'type' },
          { text: '대표자명', value: 'ceoName' },
          { text: '주소', value: 'address' },
          { text: '이메일', value: 'email' },
          { text: '사업자번호', value: 'registerNum' },
          { text: '업종', value: 'businessType' },
          { text: '전화번호', value: 'telephone' },
          { text: '팩스번호', value: 'fax' },
          { text: '휴대폰번호', value: 'cellPhone' },
          { text: '상세', value: 'id' },
        ],

      data: {
        content: [],
      },
    }
  },
  computed: {
    _id() {
      return this.$route.params.id
    },
  },
  filters: {
    dateFormatter(value) {
      return moment(value).format('YYYY-MM-DD hh:mm')
    },
  },
  mounted() {
    this.fetchDetail(),
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

    async fetchDetail() { 
      this.loading = true
      const apiUrl = `/purchase-client/${this._id}`
      await this.$axios
        .get(apiUrl)
        .then(({ data }) => {
          this.formData = data
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
    // async saveNotice() {
    //   const data = this.formData
    //   const apiUrl = `/client/${this._id}`
    //   await this.$axios
    //     .put(apiUrl, data)
    //     .then(({ status }) => {
    //       if (status === 200) {
    //         // this.showSnackbar('등록 완료')
    //         this.goList()
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // },
    async showClientList() {
      const apiUrl = `/purchase-client/${this._id}`
      await this.$axios
        .delete(apiUrl)
        .then(({ status }) => {
          if (status === 200) {
            // this.showSnackbar('등록 완료')
            this.goList()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    showModalClientDetail(id) {
      this.detailId = id
      this.dialog = true
    },

    goList() {
      this.$router.go(-1)
    },

    exportToPDF () {

      html2pdf(this.$refs.pdfarea, {
          margin: [10, 3, 10, 3],
          filename: 'SalesClientDetailList.pdf',
          pagebreak: { mode: 'avoid-all' },
          image: {type:"jpg", quality: 1},
          html2canvas: { scrollY: 0, scale:1, dpi: 300, letterRendering: true, allowTaint: false,
      },
      jsPDF: {orientation: 'landscape', unit: 'mm', format: 'a4', compressPDF: true}
    })
  },

  },
}
</script>

<style></style>