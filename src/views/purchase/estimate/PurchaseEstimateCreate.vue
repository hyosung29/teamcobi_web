<template>
  <v-card class="pa-4">
    <v-card-title class="font-weight-bold">견적서 등록</v-card-title>
    <v-card-text>
      <v-text-field v-model="formData.productName" label="품명" />
      <v-text-field v-model="formData.clientId" label="거래처명"></v-text-field>
      <v-text-field v-model="formData.productQuantity" label="수량" @change="quantityNumber"></v-text-field>
      <v-text-field v-model="formData.unitPrice" label="단가" @change="priceNumber"></v-text-field>
      <v-text-field v-model="formData.supplyValue" label="공급가액" @change="supplyNumber"></v-text-field>
      <v-text-field v-model="formData.tax" label="세액" @change="taxNumber"></v-text-field>
      <v-text-field v-model="formData.totalPrice" label="총금액" @change="totalPriceNumber"></v-text-field>
    </v-card-text>
    <v-card-actions
      ><v-btn color="primary" @click="saveEstimate">저장</v-btn>
      <v-btn dark absolute right @click="goList">목록으로</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'PurchaseEstimateCreate',
  data() {
    return {
      formData: {
        productName: null,
        clientId: null,
        productQuantity: null,
        unitPrice :null,
        supplyValue: null,
        tax:null,
        totalPrice: null,
      },
    }
  },
  methods: {
    async saveEstimate() {
      const data = this.formData
      const apiUrl = `/purchase-estimate`
      await this.$axios
        .post(apiUrl, data)
        .then(({ status }) => {
          if (status === 200) {
            this.showSnackbar('등록 완료', 'success')
            this.goList()
          }
        })
        .catch((error) => {
          console.log(error)
            this.showSnackbar('등록 실패', 'error')
        })
      // this.showSnackbar(error.response.data.message, 'error')
    },
    goList() {
      this.$router.go(-1)
    },
    showSnackbar(message, color) {
      const snackbar = {
        show: true,
        message,
        color
      }
      this.$store.dispatch('showSnackbar', snackbar)
    },
    quantityNumber(input) {
      const reg = /[^0-9]/g
      const number = input.replace(reg, "")

      this.formData.productQuantity = number
    },
    priceNumber(input) {
      const reg = /[^0-9]/g
      const number = input.replace(reg, "")
      
      this.formData.unitPrice = number
    },
    supplyNumber(input) {
      const reg = /[^0-9]/g
      const number = input.replace(reg, "")

      this.formData.supplyValue = number
    },
    taxNumber(input) {
      const reg = /[^0-9]/g
      const number = input.replace(reg, "")

      this.formData.tax = number
    },
    totalPriceNumber(input) {
      const reg = /[^0-9]/g
      const number = input.replace(reg, "")

      this.formData.totalPrice = number
    }
  },
}
</script>

<style></style>
