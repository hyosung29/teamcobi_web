<template>
	<div>
    <v-card-actions v-show="!loading">
      <v-btn dark @click="goList">목록으로</v-btn>
          <v-btn 
          class="ml-3"
          color="blue darken-2"
          width="80px"
          dark
          style="cursor:pointer;" 
          @click="exportToPDF">PDF 출력</v-btn>
    </v-card-actions>
    
    <div ref="pdfarea">
      <v-card-title class="font-weight-bold" 
    style="padding:0px; justify-content:center; font-size: 20px;"
    >판매거래처 상세</v-card-title>
    <br/>
      <v-simple-table class="detailTable">
        <tr>
            <th class="col-md-1">거래처ID</th>
            <td class="col-md-2">
              <v-text-field 
                v-model="formData.clientNum"
                readonly/>
              </td>

              <th class="col-md-1">거래처명</th>
            <td class="col-md-3">
              <v-text-field 
                v-model="formData.clientName"
                readonly/>
              </td> 
          </tr>

          <tr>
            <th class="col-md-1">대표자명</th>
            <td class="col-md-3">
              <v-text-field 
                v-model="formData.ceoName"
                readonly/>
              </td> 

              <th class="col-md-1">거래유형</th>
            <td class="col-md-3">
              <v-text-field 
                v-model="formData.type"
                readonly/>
              </td> 
              <th class="col-md-1">업종</th>
          <td class="col-md-4">
            <v-text-field
              v-model="formData.businessType"
              readonly/>
            </td> 
          </tr>

        <tr>
          <th class="col-md-1">우편번호</th>
          <td colspan="2">
            <v-text-field 
              v-model="formData.zipCode"
              readonly/>
          </td>
        </tr>

        <tr>
          <th class="col-md-1">주소</th>
          <td colspan="1">
            <v-text-field 
              v-model="formData.address"
              readonly/>
          </td>

          <th class="col-md-1">상세주소</th>
          <td class="col-md-4">
            <v-text-field 
              v-model="formData.detailAddress"
              readonly/>
          </td>
        </tr>

        <tr>
          <th class="col-md-1">E-mail</th>
          <td colspan="1">
            <v-text-field 
              v-model="formData.email"
              readonly/>
          </td>
          <th class="col-md-1">전화번호</th>
          <td colspan="1">
            <v-text-field 
              v-model="formData.telephone"
              readonly/>
          </td>
        </tr>

        <tr>
          <th class="col-md-1">팩스번호</th>
          <td cols="2">
            <v-text-field 
              v-model="formData.fax"
              readonly/>
          </td>
          <th class="col-md-1" style="font-size:14px;">휴대폰번호</th>
          <td cols="2">
            <v-text-field 
              v-model="formData.cellPhone"
              readonly/>
          </td>
        </tr>
        
      </v-simple-table>
    </div>
  </div>
</template>

  
<script>

import html2pdf from 'html2pdf.js'
export default {
  name: 'SalesClientDetail',

  data() {
    return {
      propTitle: 'mypdf',
      loading: false,
      dialog: false,
      formData: {
        type: null,
        clientName: null,
        clientNum: null,
        ceoName: null,
        address: null,
        detailAddress: null,
        zipCode: 0,
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
    _id() {
      return this.$route.params.id
    },
  },
  mounted() {
    this.fetchDetail()
  },
  methods: {
    async fetchDetail() { 
      this.loading = true
      const apiUrl = `/client/${this._id}`
      await this.$axios
        .get(apiUrl)
        .then(({ data }) => {
          this.formData = data
        })
        .catch((error) => {
          console.log(error)
        })
      this.loading = false
    },

    goList() {
      this.$router.go(-1)
    },
    exportToPDF () {

      //window.scrollTo(0, 0);
      html2pdf(this.$refs.pdfarea, {
          margin: [10, 3, 10, 3],
          filename: 'SalesClientDetail.pdf',
          pagebreak: { mode: 'avoid-all' }, // pagebreak 옵션
          image: {type:"jpg", quality: 1},
          html2canvas: { scrollY: 0, scale:1, dpi: 300, letterRendering: true, allowTaint: false,
              // ignoreElements : function( element  ) {	//pdf에 출력하지 않아야할 dom이 있다면 해당 옵션 사용
              //       if( element.id == "pdf-button-area" ) {
              //           return true;
              //       }
              //   }
          },
          jsPDF: {orientation: 'landscape', unit: 'mm', format: 'a4', compressPDF: true}
      })
    },

  },
}
</script>

<style>
.detailTable{
	margin: 0 auto;
	min-height: 500px;
  border: 1px solid black;
} 


</style>
