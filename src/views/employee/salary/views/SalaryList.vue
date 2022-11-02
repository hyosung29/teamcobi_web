<template>
  <v-container fluid>
    <!-- title start -->
    <v-card-title 
    class="font-weight-bold" 
    style="justify-content:center;
    font-size:22px;"
    >급여관리</v-card-title> 
    <!-- title end -->
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
          <v-col cols="12" md="3">
            <v-text-field
              v-model="searchForm.employeeNumber"
              label="사번"
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="searchForm.name" label="이름" clearable />
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
        @click:row="goSalaryDetail"
        dense
        hide-default-footer
      >
        <template v-slot:[`item.createdDate`]="{ value }">
          {{ value | dateFormatter }}
        </template>
        <template v-slot:[`item.incomeTax`]="{ value }">
          {{ value | payFormatter }}
        </template>
        <template v-slot:[`item.netSalary`]="{ value }">
          {{ value | payFormatter }}
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
    <modal-salary
      :visible.sync="dialog"
      :id="detailId"
      @save="(value) => createSalary(value)"
      @update="updateSalary"
      @delete="deleteSalary"
      @close="closeDialog"
    ></modal-salary>
  </v-container>
</template>

<script>
import ModalSalary from './ModalSalary.vue'
import SearchBox from '@/components/SearchBox.vue'
const qs = require('qs')

export default {
  name: 'SalaryList',
  components: {
    ModalSalary,
    SearchBox,
  },
  data() {
    ModalSalary
    return {
      loading: false,
      dialog: false,
      page: 1,
      detailId: null,

      searchForm: {
        employeeNumber: null,
        name: null,
        page: 0,
        size: 10,
        sort: 'createdDate,desc',
      },
      headers: [
        {
          text: '사번',
          value: 'employeeNumber',
          align: 'center',
          sortable: true,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '이름',
          value: 'name',
          align: 'center',
          sortable: true,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '부서',
          value: 'departmentName',
          align: 'center',
          sortable: true,
          class: 'py-3 font-weight-bold',
          width: '10%',
        },
        {
          text: '직책',
          value: 'positionName',
          align: 'center',
          sortable: true,
          class: 'py-3 font-weight-bold',
          width: '10%',
        },
        {
          text: '소득세',
          value: 'incomeTax',
          align: 'center',
          sortable: true,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '실지급액',
          value: 'netSalary',
          align: 'center',
          sortable: true,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '상태',
          value: 'paymentStatus',
          align: 'center',
          sortable: true,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '수정',
          value: 'id',
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
    // dateFormatter(value) {
    //   return moment(value).format('YYYY-MM-DD')
    // },
    payFormatter(value) {
      return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
  mounted() {
    this.fetchList(), this.fetchDetail()
  },
  methods: {
    async fetchList() {
      this.loading = true
      const queryString = qs.stringify(this.searchForm)
      const apiUrl = `/salary?${queryString}`
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

    async createSalary(value) {
      const data = value
      const apiUrl = `/salary`
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
    async updateSalary(value) {
      const data = value
      const apiUrl = `/salary/${this.detailId}`
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
    async deleteSalary(id) {
      const apiUrl = `/salary/${id}`
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
    goSalaryDetail(value) {
      // alert(value.departmentId)
      this.$router.push({
        name: 'SalaryView',
        params: {
          id: value.id,
        },
      })
    },
  },
}
</script>

<style></style>
