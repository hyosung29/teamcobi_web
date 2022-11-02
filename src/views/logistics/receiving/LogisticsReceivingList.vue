<template>
  <v-container fluid>
    <!-- title start -->
    <board-title title="입고내역" />
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
              v-model="searchForm.clientName"
              label="거래처명"
              clearable
            />
          </v-col>
        </v-row>
      </search-box>
      <!-- 검색 끝 -->
      <!-- <v-btn
        class="ml-3"
        color="blue darken-2"
        width="50px"
        dark
        @click="showDialog"
        >등록</v-btn
      > -->
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
        <template v-slot:[`item.modifiedDate`]="{ value }">
          {{ value | dateFormatter }}
        </template>
        <!-- v-if="[`items.status` === 'inbound']" 이거 문법이 대체 어떻게 되는거야  @click:row="test"-->
        <template v-slot:[`item.id`]="{ value }">
          <v-btn
            dark
            color="blue darken-1"
            small
            @click.stop="showDialogUpdate(value)"
            >상세</v-btn
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
    <modal-inbound
      :visible.sync="dialog"
      :id="detailId"
      @save="createInbound"
      @update="updateInbound"
      @delete="deleteInbound"
      @close="closeDialog"
    ></modal-inbound>
  </v-container>
</template>

<script>
import moment from 'moment'
import ModalInbound from './ModalInbound.vue'
import SearchBox from '@/components/SearchBox.vue'
const qs = require('qs')

export default {
  components: {
    SearchBox,
    ModalInbound,
  },
  name: 'LogisticsReceivingList',
  data() {
    ModalInbound
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
          text: '거래처명',
          value: 'clientName',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '창고명',
          value: 'warehouseName',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '섹션',
          value: 'sectionName',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '10%',
        },
        {
          text: '상품명',
          value: 'productName',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '15%',
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
          text: '요청일자',
          value: 'createdDate',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '20%',
        },
        {
          text: '상태',
          value: 'status',
          align: 'center',
          sortable: false,
          class: 'py-3 font-weight-bold',
          width: '15%',
        },
        {
          text: '상세',
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
      const apiUrl = `/inbound?${queryString}`
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
    async createInbound(value) {
      const data = value
      const apiUrl = `/inbound`
      await this.$axios
        .post(apiUrl, data)
        .then(({ status }) => {
          if (status === 200) {
            this.onSearch()
            this.detailId = null
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async updateInbound(value) {
      const data = value
      const apiUrl = `/inbound/${this.detailId}`
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
    async deleteInbound(id) {
      const apiUrl = `/inbound/${id}`
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
    // test(value) {
    //   this.productId = value.productId
    //   console.log('1번', value.product)
    //   console.log('2번', this.productId)
    // }
  },
}
</script>

<style></style>
