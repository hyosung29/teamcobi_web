<template>
  <v-dialog id="modal-employee" v-model="dialog" persistent max-width="90%">
    <v-card v-if="loading" color="primary" dark>
      <v-card-text>
        잠시만 기다려주세요 ...
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
    
    <v-card v-else>
      <v-toolbar dense class="text-h5 mb-5" dark color="primary">
        <v-row justify="space-around">
          <v-col>거래처 상세 조회</v-col>
          <v-col class="text-right">
            <v-btn x-small dark text icon @click="onClose">
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-toolbar>
      <v-card-text class="pt-5">
        <v-container>
          <v-form ref="rulesForm" lazy-validation>

        
        <v-simple-table class="detailTable" style="border:1px solid black;" >
          <tr>
            <th class="col-md-1">거래처명</th>
            <td class="col-md-3">
              <v-text-field 
                v-model="formData.clientName"
                readonly/>
            </td>
            <th class="col-md-1">거래타입</th>
            <td class="col-md-3">
              <v-text-field 
                v-model="formData.type"
                readonly/>
            </td> 
          </tr>

          <tr>
            <th class="col-md-1">상품명</th>
            <td class="col-md-3">
              <v-text-field 
                v-model="formData.productName"
                readonly/>
              </td>
              <th class="col-md-1">카테고리</th>
            <td class="col-md-3">
              <v-text-field 
                v-model="formData.category"
                readonly/>
            </td> 
          </tr>

          <tr>
            <th class="col-md-1">단가</th>
            <td class="col-md-1">
              <v-text-field 
                v-model="formData.unitPrice"
                readonly/>
            </td>

            <th class="col-md-1">수량</th>
            <td class="col-md-1">
              <v-text-field 
                v-model="formData.productQuantity"
                readonly/>
            </td> 

            <th class="col-md-1">합계</th>
            <td class="col-md-3">
              <v-text-field 
                v-model="formData.totalPrice"
                readonly/>
            </td> 
          </tr>

          <tr>
            <th class="col-md-1">거래상태</th>
            <td class="col-md-3">
              <v-text-field
                v-model="formData.status"
                readonly/>
            </td> 
          </tr>

          <tr>
            <th class="col-md-1">등록일</th>
            <td class="col-md-2">
              <v-text-field 
                v-model="formData.createdDate"
                readonly/>
              </td>
              <th class="col-md-1">등록자</th>
            <td class="col-md-3">
              <v-text-field 
                v-model="formData.createdBy"
                readonly/>
            </td> 
          </tr>
      </v-simple-table>
      </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="gray darken-2" @click="onClose">취소</v-btn>
      </v-card-actions>
    </v-card>
    <modal-confirm
      :id="modalConfirm.id"
      :visible.sync="modalConfirm.visible"
      :title.sync="modalConfirm.title"
      :deleteButton.sync="modalConfirm.deleteButton"
      @delete="onDelete"
    />
  </v-dialog>
</template>

<script>
import moment from 'moment'
import ModalConfirm from '@/components/ModalConfirm'
export default {
  name: 'ModalClientDetail',
  components: {
    ModalConfirm,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      dialog: false,
      formData: {
        clientName:null,
        type:null,
        productName:null,
        category:null,
        totalPrice:null,
        unitPrice:null,
        status:null,
        supplyValue:null,
        productQuantity:null,
        createdBy: null,
        createdDate: null,
      },

      modalConfirm: {
        id: '',
        visible: false,
        title: '',
        message: '',
        deleteButton: false,
      },

    }
  },

  watch: {
    visible(value) {
      this.dialog = value
      if (!value) return
      if (this.id) {
        this.$nextTick(() => {
          this.fetchDetail()
        })
      }
    },
  },
  methods: {
    async fetchDetail() {
      this.loading = true
      const apiUrl = `/purchase-client/codes/${this.id}`
      try {
        await this.$axios.get(apiUrl).then(({ data }) => {
          this.formData = data
          this.onFilterTotalPrice(this.formData.totalPrice, this.formData.unitPrice)
          this.onFilterCreatedDate(this.formData.createdDate)
        })
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
    initialize() {
      this.formData = {}
    },
    onClose() {
      this.$emit('close', false)
      this.initialize()
      this.$refs.rulesForm.resetValidation()
    },
    validation() {
      return this.$refs.rulesForm.validate()
    },

    onFilterTotalPrice(value, value2) {
    this.formData.totalPrice = String(value).replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ','
    ),
    this.formData.unitPrice = String(value2).replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ','
    )
    },
    onFilterCreatedDate(value) {
      this.formData.createdDate = moment(value).format('YYYY-MM-DD')
    },

  }        
}
</script>

<style></style>