<template>
  <v-container fluid>
    <!-- title start -->
    <board-title title="섹션정보" />
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
          <v-col cols="12" md="5">
            <v-text-field
              v-model="searchForm.sectionName"
              label="섹션명"
              clearable
            />
          </v-col>
          </v-row>
          
          <v-row>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="searchForm.location"
              label="로케이션"
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
        dense
        hide-default-footer
      >
        <template v-slot:[`item.createdDate`]="{ value }">
          {{ value | dateFormatter }}
        </template>
        <template v-slot:[`item.sectionId`]="{ value }">
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
    <modal-section
      :visible.sync="dialog"
      :sectionId="detailId"
      @save="createSection"
      @update="updateSection"
      @delete="deleteSection"
      @close="closeDialog"
    ></modal-section>
  </v-container>
</template>

<script>
import moment from 'moment'
import ModalSection from './ModalSection.vue'
import SearchBox from '@/components/SearchBox.vue'
const qs = require('qs')

export default {
  components: {
    SearchBox,
    ModalSection,
  },
  name: 'SectionList',
  data() {
    ModalSection
    return {
      loading: false,
      dialog: false,
      page: 1,
      detailId: null,

      searchForm: {
        sectionName: null,
        location: null,
        page: 0,
        size: 10,
        sort: 'sectionName,desc',
      },
      headers: [
        {
          text: '창고명',
          value: 'warehouseName',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '섹션명',
          value: 'sectionName',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '위치',
          value: 'location',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '적재량',
          value: 'quantity',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '작성자',
          value: 'name',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '작성일자',
          value: 'createdDate',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '상세',
          value: 'sectionId',
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
      return moment(value).format('YYYY-MM-DD HH:mm')
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
      const apiUrl = `/section?${queryString}`
      await this.$axios
        .get(apiUrl)
        .then((res) => {
          // console.log(res)
          this.data = res.data
          console.log('1', res.data)
          console.log('2', this.data)
        })
        .catch((error) => {
          console.log(error)
        })
      this.loading = false
    },
    async createSection(value) {
      const data = value
      const apiUrl = `/section`
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
    async updateSection(value) {
      const data = value
      const apiUrl = `/section/${this.detailId}`
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
    async deleteSection(sectionId) {
      const apiUrl = `/section/${sectionId}`
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
    showDialogUpdate(sectionId) {
      this.detailId = sectionId
      this.dialog = true
    },
  },
}
</script>

<style></style>