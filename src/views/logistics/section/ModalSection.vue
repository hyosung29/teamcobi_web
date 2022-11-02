<template>
  <v-dialog
    id="modal-section"
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
          <v-col>섹션정보 {{ !sectionId ? '등록' : '상세' }}</v-col>
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
                <v-select
                  v-model="formData.warehouseId"
                  item-value="id"
                  item-text="warehouseName"
                  :items="warehouseCodes"
                  label="창고명"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-combobox
                  v-model="formData.sectionName"
                  :items="items"
                  label="섹션명"
                  dense
                  outlined
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.location"
                  :rules="_rules.required"
                  label="위치"
                  dense
                  required
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.quantity"
                  :rules="_rules.required"
                  label="적재량"
                  @change="quantityNumber"
                  dense
                  required
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
      :id="modalConfirm.sectionId"
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
  name: 'ModalSection',
  components: {
    ModalConfirm,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    sectionId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      dialog: false,
      formData: {
        location: null,
        quantity: null,
        warehouseId: null,
        sectionName: null,
      },
      modalConfirm: {
        sectionId: '',
        visible: false,
        title: '',
        message: '',
        deleteButton: false,
      },
      warehouseCodes: [],
      items: ['A', 'B', 'C'],
    }
  },
  mounted() {
    this.fetchWarehouseCode()
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
      if (this.sectionId) {
        this.$nextTick(() => {
          this.fetchDetail()
        })
      }
    },
  },
  methods: {
    async fetchDetail() {
      this.loading = true
      const apiUrl = `/section/${this.id}`
      console.log(this.id)
      try {
        await this.$axios.get(apiUrl).then(({ data }) => {
          this.formData = data
        })
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
    async fetchWarehouseCode() {
      const apiUrl = `/warehouse/names`
      await this.$axios
        .get(apiUrl)
        .then(({ data }) => {
          this.warehouseCodes = data
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
        title: '섹션 정보 삭제',
        deleteButton: true,
      }
    },
    quantityNumber(input) {
      const reg = /[^0-9]/g
      const number = input.replace(reg, '')

      this.formData.quantity = number
    },
  },
}
</script>

<style></style>
