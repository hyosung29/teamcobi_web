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
      >구매거래처 상세</v-card-title>
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

<!-- <template>  
  <v-container>
    <v-row>
		<button @click="makePDF"
    class="ml-3"
          color="blue darken-2"
          width="50px"
          dark
          >PDF출력</button>
        </v-row>
    <br/>
    
    <div>
    <v-simple-table class="detailTable">
      <tr>
        <th class="col-md-1">거래처ID</th>
        <td class="col-md-2">
          <v-text-field 
            v-model="formData.clientNum"
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
        <td colspan="5">
          <v-text-field 
            v-model="formData.zipCode"
            readonly/>
        </td>
      </tr>

      <tr>
        <th class="col-md-1">주소</th>
        <td colspan="2">
          <v-text-field 
            v-model="formData.address"
            readonly/>
        </td>

        <th class="col-md-1">상세주소</th>

        <td colspan="2">
          <v-text-field 
            v-model="formData.detailAddress"
            readonly/>
        </td>
      </tr>

      <tr>
        <th class="col-md-1">E-mail</th>
        <td colspan="3">
          <v-text-field 
            v-model="formData.email"
            readonly/>
        </td>
        <th class="col-md-1">전화번호</th>
        <td colspan="3">
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
        <th class="col-md-1">휴대폰번호</th>
        <td cols="2">
          <v-text-field 
            v-model="formData.cellPhone"
            readonly/>
        </td>
      </tr>
      
    </v-simple-table>
  </div>

  </v-container>

</template> -->

  
<script>
// import jsPDF from 'jspdf'
// import html2canvas from 'html2canvas'
import html2pdf from 'html2pdf.js'
export default {
  name: 'PurchaseClientDetail',

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
      const apiUrl = `/purchase-client/${this._id}`
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
          filename: 'PurchaseClientDetail.pdf',
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

    // makePDF (selector = 'body') {
		// 	window.html2canvas = html2canvas //Vue.js 특성상 window 객체에 직접 할당해야한다.
		// 	let that = this
		// 	let pdf = new jsPDF('p', 'mm', 'a4')
		// 	let canvas = pdf.canvas
		// 	const pageWidth = 210 //캔버스 너비 mm
		// 	const pageHeight = 295 //캔버스 높이 mm
		// 	canvas.width = pageWidth

		// 	let ele = document.querySelector(selector)
		// 	let width = ele.offsetWidth // 셀렉트한 요소의 px 너비
		// 	let height = ele.offsetHeight // 셀렉트한 요소의 px 높이
		// 	let imgHeight = pageWidth * height/width // 이미지 높이값 px to mm 변환

		// 	if(!ele){
		// 		console.warn(selector + ' is not exist.')
		// 		return false
		// 	}

		// 	html2canvas(ele, {
		// 		onrendered: function(canvas) {
		// 			let position = 0
		// 			const imgData = canvas.toDataURL('image/png')
		// 			pdf.addImage(imgData, 'png', 0, position, pageWidth, imgHeight, undefined, 'slow')

		// 			//Paging 처리
		// 			let heightLeft = imgHeight //페이징 처리를 위해 남은 페이지 높이 세팅.
		// 			heightLeft -= pageHeight
		// 			while (heightLeft >= 0) {
		// 				position = heightLeft - imgHeight
		// 				pdf.addPage();
		// 				pdf.addImage(imgData, 'png', 0, position, pageWidth, imgHeight)
		// 				heightLeft -= pageHeight
		// 			}

		// 			pdf.save(that.propTitle.toLowerCase() +'.pdf')
		// 		},

    //   });	

    // },
  }
}
</script>

<style>
.detailTable{
	margin: 0 auto;
	min-height: 500px;
  border: 1px solid black;
} 


</style>
