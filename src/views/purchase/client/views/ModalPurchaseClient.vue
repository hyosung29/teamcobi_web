<template>
  <v-dialog id="modal-employee" v-model="dialog" persistent max-width="600px">
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
          <v-col>거래처 {{ !id ? '등록' : '상세' }}</v-col>
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
                  v-model="formData.clientNum"
                  label="거래처ID"
                  disabled
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field
                      v-model="formData.type"
                      label="거래유형 : 구매"
                      disabled
                    />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.clientName"
                  :rules="_rules.required"
                  label="거래처명*"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.ceoName"
                  :rules="_rules.required"
                  label="대표자명*"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.registerNum"
                  :rules="_rules.required"
                  label="사업자번호*"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.address"
                  :rules="_rules.required"
                  label="주소*"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.detailAddress"
                  :rules="_rules.required"
                  label="상세주소*"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.zipCode"
                  :rules="_rules.required"
                  label="우편번호*"
                  @change="zipCodeNumber"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.email"
                  :rules="_rules.required"
                  label="Email*"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.businessType"
                  :rules="_rules.required"
                  label="업종*"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="formData.telephone"
                  :rules="_rules.required"
                  label="전화번호*"
                  dense
                  clearable
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="formData.fax"
                  :rules="_rules.required"
                  label="팩스번호*"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.cellPhone"
                  :rules="_rules.required"
                  label="휴대폰*"
                  dense
                  clearable
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
  name: 'ModalSalesClient',
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
        type: null,
        clientName: null,
        clientNum: null,
        ceoName: null,
        address: null,
        detailAddress: null,
        zipCode: null,
        email: null,
        businessType: null,       
        telephone: null,       
        fax: null,       
        cellPhone: null,       
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
  computed: {
    _rules() {
      return {
        required: [(v) => !!v || '필수값입니다. 입력해주세요!.'],
        // passwordRules: [(v) => !!v || "비밀번호를 입력해주세요!"],
      }
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
      const apiUrl = `/purchase-client/${this.id}`
      try {
        await this.$axios.get(apiUrl).then(({ data }) => {
          this.formData = data
        })
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
    initialize() {
      this.formData = {}
    },
    onSave() {
      if (!this.validation()) return
      this.$emit('save', this.formData)
      this.onClose()
    },
    onUpdate() {
      if (!this.validation()) return
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
        title: '거래처 삭제',
        deleteButton: true,
      }
    },
          
    zipCodeNumber(input) {
      const reg = /[^0-9]/g
      const number = input.replace(reg, "")

      this.formData.zipCode = number
    }
  },
}
</script>

<style></style>
