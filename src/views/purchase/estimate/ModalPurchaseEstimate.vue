<template>
  <v-dialog
    id="modal-purchase-estimate"
    v-model="dialog"
    persistent
    scrollable
    max-width="600px"
  >
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
          <v-col>견적서 {{ !id ? '등록' : '상세' }}</v-col>
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
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.type"
                  label="타입"
                  dense
                  disabled
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="formData.productId"
                  item-value="id"
                  item-text="productName"
                  :items="productCodes"
                  @change="onUnitPrice(formData.productId)"
                  label="품명"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="formData.clientId"
                  item-value="id"
                  item-text="clientName"
                  :items="clientCodes"
                  label="거래처명"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.productQuantity"
                  :rules="_rules.required"
                  label="수량"
                  @change="quantityNumber"
                  dense
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.unitPrice"
                  label="단가"
                  @change="ProductUnitPrice"
                  dense
                  disabled
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="_supplyValue"
                  :rules="_rules.required"
                  label="공급가액"
                  @change="supplyNumber"
                  dense
                  disabled
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="_tax"
                  :rules="_rules.required"
                  label="세액"
                  @change="taxNumber"
                  dense
                  disabled
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="_totalPrice"
                  :rules="_rules.required"
                  label="총금액"
                  @change="totalPriceNumber"
                  dense
                  disabled
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-combobox
                  v-model="formData.status"
                  :items="items"
                  label="상태"
                  dense
                  outlined
                />
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="error"
          v-if="id"
          text
          dark
          @click="showModalDeleteConfirm"
        >
          삭제
        </v-btn>
        <v-btn v-if="!id" color="blue darken-1" text dark @click="onSave">
          저장
        </v-btn>
        <v-btn v-else color="blue darken-1" text dark @click="onUpdate">
          수정
        </v-btn>
        <v-btn color="gray darken-2" text @click="onClose">취소</v-btn>
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
import ModalConfirm from '@/components/ModalConfirm'
export default {
  name: 'ModalPurchaseEstimate',
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
        productId: null,
        clientId: null,
        productQuantity: null,
        supplyValue: null,
        tax: null,
        totalPrice: null,
        status: '승인대기',
        unitPrice: null,
        type: '구매',
      },

      modalConfirm: {
        id: '',
        visible: false,
        title: '',
        message: '',
        deleteButton: false,
      },
      clientCodes: [],
      productCodes: [],
      select: ['상태'],
      items: ['승인대기', '승인완료', '승인취소'],
    }
  },
  mounted() {
    this.fetchClientCode()
    this.fetchProductCode()
    // this.fetchProductPrice()
  },
  computed: {
    _rules() {
      return {
        required: [(v) => !!v || '필수값입니다. 입력해주세요!.'],
        // passwordRules: [(v) => !!v || "비밀번호를 입력해주세요!"],
      }
    },
    _unitPrice() {
      return this.formData.productId.unitPrice
    },
    _supplyValue() {
      return this.formData.productQuantity * this.formData.unitPrice
    },
    _tax() {
      return this._supplyValue * 0.1
    },
    _totalPrice() {
      return this._supplyValue + this._tax
    },
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
      const apiUrl = `/purchase-estimate/${this.id}`
      try {
        await this.$axios.get(apiUrl).then(({ data }) => {
          this.formData = data
        })
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
    async fetchClientCode() {
      const apiUrl = `/purchase-client/code`
      await this.$axios
        .get(apiUrl)  
        .then(({ data }) => {
          this.clientCodes = data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async fetchProductCode() {
      const apiUrl = `/product/codes`
      await this.$axios
        .get(apiUrl)
        .then(({ data }) => {
          this.productCodes = data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // async fetchProductPrice() {
    //   const apiUrl = `/product/${this.codes}`
    //   await this.$axios
    //     .get(apiUrl)
    //     .then(({ data }) => {
    //       console.log('data', data), (this.formData.productId.unitPrice = data)
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // },
    initialize() {
      this.formData = {}
    },
    onSave() {
      if (!this.validation()) return
      this.$set(this.formData, 'supplyValue', this._supplyValue)
      this.$set(this.formData, 'tax', this._tax)
      this.$set(this.formData, 'totalPrice', this._totalPrice)
      this.$emit('save', this.formData)
      this.onClose()
    },
    onUpdate() {
      if (!this.validation()) return
      this.$set(this.formData, 'supplyValue', this._supplyValue)
      this.$set(this.formData, 'totalPrice', this._totalPrice)
      this.$emit('update', this.formData)
      this.onClose()
    },
    onDelete() {
      if (!this.validation()) return
      this.$emit('delete', this.id)
      this.onClose()
    },
    onClose() {
      this.$emit('close', false)
      this.initialize()
      this.$refs.rulesForm.resetValidation()
    },
    validation() {
      return this.$refs.rulesForm.validate()
    },

    showModalDeleteConfirm() {
      this.modalConfirm = {
        visible: true,
        id: this.id,
        title: '견적서 삭제',
        deleteButton: true,
      }
    },
    quantityNumber(input) {
      const reg = /[^0-9]/g
      const number = input.replace(reg, '')

      this.formData.productQuantity = number
    },
    priceNumber(input) {
      const reg = /[^0-9]/g
      const number = input.replace(reg, '')
      this.formData.unitPrice = number
    },
    supplyNumber(input) {
      const reg = /[^0-9]/g
      const number = input.replace(reg, '')
      this.formData.supplyValue = number
    },
    taxNumber(input) {
      const reg = /[^0-9]/g
      const number = input.replace(reg, '')
      this.formData.tax = number
    },
    totalPriceNumber(input) {
      const reg = /[^0-9]/g
      const number = input.replace(reg, '')
      this.formData.totalPrice = number
    },
    totalSupply() {
      const result = this.productQuantity * this.unitPrice
      this.formData.supplyValue = result
    },
    ProductUnitPrice() {
      const price = this.productCodes.unitPrice
      this.formData.unitPrice = price
    },
    onUnitPrice(id) {
      const getUnitPrice = this.productCodes.find(
        (getUnitPrice) => getUnitPrice.id === id
      )
      this.formData.unitPrice = getUnitPrice.unitPrice
    },
  },
}
</script>