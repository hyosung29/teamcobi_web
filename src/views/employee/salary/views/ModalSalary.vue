<template>
  <v-dialog id="modal-salary" v-model="dialog" persistent max-width="600px">
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
          <v-col>급여 {{ !id ? '등록' : '상세' }}</v-col>
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
              <v-col class="d-flex" cols="12" sm="6">
                <v-select
                v-model="formData.employeeId"
                item-value="id"
                item-text="employeeNumber"
                :items="employeeCodes" 
                label="사원번호"></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.basicPay"
                  :rules="_rules.required"
                  label="기본급*"
                  @change="basic"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.overtimePay"
                  :rules="_rules.required"
                  label="시간외수당*"
                  @change="overtime"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.bonusPay"
                  :rules="_rules.required"
                  label="상여금*"
                  @change="bonus"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.mealAllowance"
                  :rules="_rules.required"
                  label="식대*"
                  @change="meal"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="_incomeTax"
                  :rules="_rules.required"
                  label="소득세(기본급*10%)*"
                  @change = "taxNumber"
                  dense
                  clearable
                  disabled
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="_netSalary"
                  :rules="_rules.required"
                  label="실지급액*"
                  @change="totalNetSalary"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.payDay"
                  :rules="_rules.required"
                  label="급여지급일*"
                  dense
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-combobox
                  v-model="formData.paymentStatus"
                  :items="items"
                  label="급여지급상태*"
                  dense
                  Standard
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
import moment from 'moment'
import ModalConfirm from '@/components/ModalConfirm'
export default {
  name: 'ModalSalary',
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
        employeeId: null,
        basicPay: null,
        overtimePay: null,
        bonusPay: null,
        mealAllowance: null,
        incomeTax: null,
        netSalary: null,
        payDay: null,
        paymentStatus: '지급 대기',
      },

      modalConfirm: {
        id: '',
        visible: false,
        title: '',
        message: '',
        deleteButton: false,
      },
      employeeCodes: [],
      select: ['급여지급상태'],
      items: ['지급 대기', '지급 완료'],
    }
  },
  mounted() {
    this.fetchEmployeeCode()
  },
  computed: {
    _rules() {
      return {
        required: [(v) => !!v || '필수값입니다. 입력해주세요!.'],
        // passwordRules: [(v) => !!v || "비밀번호를 입력해주세요!"],
      }
    },
    _salaryValue() {  //기본급+시간외수당+상여금+식대 
      return parseInt(this.formData.basicPay) + parseInt(this.formData.overtimePay) + parseInt(this.formData.bonusPay) + parseInt(this.formData.mealAllowance)
    },
    _incomeTax() {  //근로소득세
      return this.formData.basicPay * 0.1
    },
    _netSalary() {  //(기본급+시간외수당+상여금+식대) -  근로소득세
      return this._salaryValue - this._incomeTax
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
      const apiUrl = `/salary/${this.id}`
      try {
        await this.$axios.get(apiUrl).then(({ data }) => {
          this.formData = data
          this.onFilterCreatedDate(this.formData.payDay)
        })
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
    async fetchEmployeeCode() {
      const apiUrl = `/employee/codes`
      await this.$axios
        .get(apiUrl)
        .then(({ data }) => {
          console.log('data', data), (this.employeeCodes = data)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    initialize() {
      this.formData = {}
    },
    onSave() {
      if (!this.validation()) return
      this.$set(this.formData,'salaryValue', this._salaryValue)
      this.$set(this.formData, 'incomeTax', this._incomeTax)
      this.$set(this.formData, 'netSalary', this._netSalary)
      this.$emit('save', this.formData)
      this.onClose()
    },
    onUpdate() {
      if (!this.validation()) return
      this.$set(this.formData,'salaryValue', this._salaryValue)
      this.$set(this.formData, 'incomeTax', this._incomeTax)
      this.$set(this.formData, 'netSalary', this._netSalary)
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
        title: '급여 삭제',
        deleteButton: true,
      }
    },
    basic(input) {
    const reg = /[^0-9]/g
    const number = input.replace(reg, '')
    this.formData.basicPay = number
    },
    overtime(input) {
    const reg = /[^0-9]/g
    const number = input.replace(reg, '')
    this.formData.overtimePay = number
    },
    bonus(input) {
    const reg = /[^0-9]/g
    const number = input.replace(reg, '')
    this.formData.bonusPay = number
    },
    meal(input) {
    const reg = /[^0-9]/g
    const number = input.replace(reg, '')
    this.formData.mealAllowance = number
    },
    taxNumber(input) {
    const reg = /[^0-9]/g
    const number = input.replace(reg, '')
    this.formData.incomeTax = number
    },
    netSalary(input) {
    const reg = /[^0-9]/g
    const number = input.replace(reg, '')
    this.formData.netSalary = number
    },
    onFilterCreatedDate(value) {
      this.formData.payDay = moment(value).format('YYYY-MM-DD')
    },
  },
}
</script>

<style></style>
