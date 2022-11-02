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
        <v-col>사원 {{ !id ? '등록' : '상세' }}</v-col>
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
                v-model="formData.employeeNumber"
                label="사원번호*"
                dense
                disabled
                />
            </v-col>
            </v-row>
            <v-row>
            <v-col cols="12" md="6">
                <v-text-field
                v-model="formData.name"
                :rules="_rules.required"
                label="이름*"
                dense
                clearable
                />
                <!-- clearable : 글 쓰면 오른쪽 끝에 나오는 x 버튼 -->
                <!-- dense : 전체 높이를 글씨 크기에 맞춰서 맞춰줌 -->
            </v-col>
            </v-row>
            <v-row>
            <v-col cols="12" md="6">
                <img
                :src="preview"
                >
                <v-file-input
                v-model="formData.photo"
                type="file"
                label="사진*"
                dense
                @change="previewFile"
                />
            </v-col>
            </v-row>
            <v-row>
            <v-col cols="12" md="6">
                <v-text-field
                v-model="regResRegNum"
                @keyup="regRRNEvent(regResRegNum)"
                :rules="_rules.residentRegNum"
                label="주민등록번호*"
                dense
                clearable
                />
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field
                v-model="regPhone"
                @keyup="regPhoneEvent(regPhone)"
                :rules="_rules.phone"
                label="핸드폰번호*"
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
            <v-col class="d-flex" cols="12" sm="6">
                <v-select
                v-model="formData.departmentId"
                item-value="id"
                item-text="departmentName"
                :items="departmentCodes" label="부서"></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="6">
                <v-select :items="position" label="직급"></v-select>
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
name: 'ModalEmployee',
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
        employeeNumber: null,
        name: null,
        photo: null,
        phone: null,
        residentRegNum: null,
        departmentId: null,
    },
    modalConfirm: {
        id: '',
        visible: false,
        title: '',
        message: '',
        deleteButton: false,
    },
    departmentCodes: [
    ]
    ,
    position: [
        '사원', '대리'
    ],
    preview: '',
    saveFile: null, 
    regPhone: null,
    regResRegNum: null,
    }
},
mounted() {
    this.fetchDepartmentCode()
},
computed: {
    _rules() {
    return {
        required: [(v) => !!v || '필수값입니다. 입력해주세요!.'],
        // passwordRules: [(v) => !!v || "비밀번호를 입력해주세요!"],
        phone: 
        [
        (v) => !!v || '필수값입니다. 입력해주세요!.',
        (v) => !(v && v.length >= 14) || '핸드폰번호 형식에 맞지 않습니다.',
        (v) => !(v && v.length < 13) || '핸드폰번호를 입력해주세요.',
        ],
        residentRegNum: 
        [
        (v) => !!v || '필수값입니다. 입력해주세요!.',
        (v) => !(v && v.length >= 15) || '주민등록번호 형식에 맞지 않습니다.',
        (v) => !(v && v.length < 14) || '주민등록번호를 입력해주세요.'
        ],
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
    const apiUrl = `/employee/${this.id}`
    try {
        await this.$axios.get(apiUrl).then(({ data }) => {
        this.formData = data
        this.preview = `http://localhost:8081${data.photo}`
        })
    } catch (error) {
        console.log(error)
    }

    this.loading = false
    },
    async fetchDepartmentCode() {
    const apiUrl = `/department/codes`
    await this.$axios
    .get(apiUrl)
    .then(({ data }) => {
        console.log("data", data),
        this.departmentCodes = data
    })
    .catch((error) => {
    console.log(error)
    })
    },
    initialize() {
    this.formData = {}
    this.preview = null
    this.regPhone = null
    this.regResRegNum = null
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
        title: '사원 삭제',
        deleteButton: true,
    }
    },
    phototest() {
    console.log(this.formData.photo)
    },
    previewFile() {
    const file = this.formData.photo
    if (!file) {
        this.preview = null
        return
    }
    const fileData = (data) => {
        this.preview = data
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.addEventListener("load", function() {
        fileData(reader.result)
    }, false)
    },
    regPhoneEvent(regPhone) {
        let res = this.onRegPhone(regPhone)
        this.regPhone = res
        //서버 전송 값에는 '-' 를 제외하고 숫자만 저장
        this.formData.phone = this.regPhone.replace(/[^0-9]/g, '')
    },
    
    onRegPhone( phoneNumber ) {
        if(!phoneNumber) return phoneNumber
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
    
        let res = ''
        if(phoneNumber.length < 3) {
            res = phoneNumber
        }
        else {
            if(phoneNumber.substr(0, 2) =='02') {
        
                if(phoneNumber.length <= 5) {//02-123-5678
                    res = phoneNumber.substr(0, 2) + '-' + phoneNumber.substr(2, 3)
                }
                else if(phoneNumber.length > 5 && phoneNumber.length <= 9) {//02-123-5678
                    res = phoneNumber.substr(0, 2) + '-' + phoneNumber.substr(2, 3) + '-' + phoneNumber.substr(5)
                }
                else if(phoneNumber.length > 9) {//02-1234-5678
                    res = phoneNumber.substr(0, 2) + '-' + phoneNumber.substr(2, 4) + '-' + phoneNumber.substr(6)
                }
        
            } else {
                if(phoneNumber.length < 8) {
                    res = phoneNumber
                }
                else if(phoneNumber.length == 8)
                {
                    res = phoneNumber.substr(0, 4) + '-' + phoneNumber.substr(4)
                }
                else if(phoneNumber.length == 9)
                {
                    res = phoneNumber.substr(0, 3) + '-' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6)
                }
                else if(phoneNumber.length == 10)
                {
                    res = phoneNumber.substr(0, 3) + '-' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6)
                }
                else if(phoneNumber.length > 10) { //010-1234-5678
                    res = phoneNumber.substr(0, 3) + '-' + phoneNumber.substr(3, 4) + '-' + phoneNumber.substr(7)
                }
            }
        }
        return res
    },
    // 주민등록번호
    regRRNEvent(regResRegNum) {
        let res = this.onRegRRN(regResRegNum)
        this.regResRegNum = res
        //서버 전송 값에는 '-' 를 제외하고 숫자만 저장
        this.formData.residentRegNum = this.regResRegNum.replace(/[^0-9]/g, '')
    },
    
    onRegRRN( resRegNumber ) {
        if(!resRegNumber) return resRegNumber
        resRegNumber = resRegNumber.replace(/[^0-9]/g, '')
    
        let res = ''
            if(resRegNumber.length < 7) {
                    res = resRegNumber
                }
                else if(resRegNumber.length == 7) {
                res = resRegNumber.substr(0,6) + '-' + resRegNumber.substr(6,7)
                }
                else if(resRegNumber.length > 7) { //010-1234-5678
                    res = resRegNumber.substr(0, 6) + '-' + resRegNumber.substr(6)
                }
        return res
    }
}
}
</script>

