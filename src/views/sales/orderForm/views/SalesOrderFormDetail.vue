<template>
  <v-card class="pa-4">
    <v-card-title class="font-weight-bold">상세 페이지</v-card-title>
    <v-card>
      <br />
      <v-row
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <v-col cols="3">
          <v-text-field v-model="formData.type" label="거래유형" readonly />
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="formData.salesNumber" label="주문번호" readonly />
        </v-col>
      </v-row>
      <v-row
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <v-col cols="3">
          <v-text-field v-model="formData.clientName" label="업체명" readonly />
        </v-col>
      </v-row>
      <v-row
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <v-col cols="3">
          <v-text-field v-model="formData.productName" label="품명" readonly />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="formData.productQuantity"
            label="수량"
            readonly
          />
        </v-col>
      </v-row>
      <v-row
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <v-col cols="3">
          <v-text-field v-model="formData.totalPrice" label="가격" readonly />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="formData.createdDate"
            label="요청일자"
            readonly
          />
        </v-col>
      </v-row>
      <v-row
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <v-col cols="3">
          <v-combobox
            v-model="formData.status"
            :items="status"
            label="상태"
            outlined
            dense
          ></v-combobox>
        </v-col>
      </v-row>
      <br />
      <v-card-actions>
        <v-btn class="ml-3" color="primary" width="50px" @click="insertOutbound"
          ><v-icon left> mdi-checkbox-marked-circle </v-icon> 승인
        </v-btn>
        <v-btn
          class="ml-3"
          color="secondary"
          width="50px"
          @click="updateOrderForm"
          ><v-icon left> mdi-pencil </v-icon> 수정 </v-btn
        >&nbsp;
        <v-btn class="ml-3" color="success" width="50px" dark @click="onPrint"
          ><v-icon color="white"> mdi-arrow-up-bold-box-outline </v-icon
          >출력</v-btn
        >
        <v-btn
          class="ml-3"
          color="primary"
          width="50px"
          dark
          absolute
          right
          @click="goList"
          >목록으로</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<script>
import moment from 'moment'
export default {
  name: 'SalesOrderFormDetail',
  data() {
    return {
      formData: {
        type: null,
        salesNumber: null,
        clientName: null,
        productName: null,
        productQuantity: null,
        totalPrice: null,
        createdDate: null,
        status: null,
      },
      status: ['승인(출하지시)', '승인보류', '승인취소'],
    }
  },
  computed: {
    _id() {
      return this.$route.params.id
    },
  },
  mounted() {
    this.fetchDetail()
  },
  filters: {
    dateFormatter(value) {
      return moment(value).format('YYYY-MM-DD')
    },
    priceFormatter(value) {
      return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
  methods: {
    async fetchDetail() {
      this.loading = true
      const apiUrl = `/sales-orderform/${this._id}`
      await this.$axios
        .get(apiUrl)
        .then(({ data }) => {
          this.formData = data
          this.onFilterTotalPrice(this.formData.totalPrice)
          this.onFilterCreatedDate(this.formData.createdDate)
        })
        .catch((error) => {
          console.log(error)
        })
      this.loading = false
    },

    async updateOrderForm() {
      const data = this.formData
      const apiUrl = `/sales-orderform/${this._id}`
      await this.$axios
        .put(apiUrl, data)
        .then(({ status }) => {
          if (status === 200) {
            // this.showSnackbar('수정 완료')
            this.goList()
          }
        })
        .catch((error) => {
          console.log(error)
        })
      // this.showSnackbar(error.response.data.message, 'error')
    },
    async insertOutbound() {
      const data = this.formData
      const apiUrl = `/outbound/updateStatus/${this._id}`
      await this.$axios
        .put(apiUrl, data)
        .then(({ status }) => {
          if (status === 200) {
            this.goList()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onFilterTotalPrice(value) {
    this.formData.totalPrice = String(value).replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ','
    )
  },
  onFilterCreatedDate(value) {
    this.formData.createdDate = moment(value).format('YYYY-MM-DD')
  },
    goList() {
      this.$router.go(-1)
    },
  },
}
</script>

<style></style>