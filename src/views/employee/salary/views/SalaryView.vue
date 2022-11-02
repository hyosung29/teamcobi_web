<template>
  <v-card class="pa-4">
    <v-card-title class="font-weight-bold">급여 상세</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="formData.employeeNumber"
        label="사원번호"
        readonly
      ></v-text-field>
      <v-text-field
        v-model="formData.name"
        label="이름"
        readonly
      ></v-text-field>
      <v-text-field
        v-model="formData.departmentName"
        label="부서"
        readonly
      ></v-text-field>
      <v-text-field
        v-model="formData.positionName"
        label="직책"
        readonly
      ></v-text-field>
      <v-text-field
        v-model="formData.basicPay"
        label="기본급"
        readonly
      ></v-text-field>
      <v-text-field
        v-model="formData.overtimePay"
        label="시간외수당"
        readonly
      ></v-text-field>
      <v-text-field
        v-model="formData.bonusPay"
        label="상여금"
        readonly
      ></v-text-field>
      <v-text-field
        v-model="formData.mealAllowance"
        label="식대"
        readonly
      ></v-text-field>
      <v-text-field
        v-model="formData.incomeTax"
        label="소득세"
        readonly
      ></v-text-field>
      <v-text-field
        v-model="formData.netSalary"
        label="실지급액"
        readonly
      ></v-text-field>
      <v-text-field
        v-model="formData.payDay"
        label="급여지급일"
        readonly
      ></v-text-field>
      <v-text-field
        v-model="formData.paymentStatus"
        label="급여지급상태"
        readonly
      >
      </v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn dark absolute right @click="goList">이전으로</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from 'moment'
export default {
  name: 'SalaryView',
  data() {
    return {
      formData: {
        employeeNumber: null,
        name: null,
        departmentName: null,
        positionName: null,
        basicPay: null,
        overtimePay: null,
        bonusPay: null,
        mealAllowance: null,
        incomeTax: null,
        netSalary: null,
        payDay: null,
        paymentStatus: null,
      },

      modalConfirm: {
        id: '',
        visible: false,
        title: '',
        message: '',
        // saveButton: false,
        // deleteButton: false,
        deleteButton: false,
      },
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
      const apiUrl = `/salary/${this._id}`
      await this.$axios
        .get(apiUrl)
        .then(({ data }) => {
          this.formData = data
          this.onFilterTotalPrice(this.formData.basicPay, this.formData.overtimePay, this.formData.bonusPay, this.formData.mealAllowance, this.formData.incomeTax, this.formData.netSalary)
          this.onFilterCreatedDate(this.formData.payDay)
        })
        .catch((error) => {
          console.log(error)
        })
      this.loading = false
    },
    async saveSalary() {
      const data = this.formData
      const apiUrl = `/salary/${this._id}`
      await this.$axios
        .put(apiUrl, data)
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
    async deleteSalary() {
      const apiUrl = `/salary/${this._id}`
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
    onFilterTotalPrice(value1, value2, value3, value4, value5, value6) {
      this.formData.basicPay = String(value1).replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      ),
      this.formData.overtimePay = String(value2).replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      ),
      this.formData.bonusPay = String(value3).replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      ),
      this.formData.mealAllowance = String(value4).replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      ),
      this.formData.incomeTax = String(value5).replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      ),
      this.formData.netSalary = String(value6).replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      )
    },
    onFilterCreatedDate(value) {
      this.formData.payDay = moment(value).format('YYYY-MM-DD')
    },
    goList() {
      this.$router.go(-1)
    },
  },
}
// heool
</script>
