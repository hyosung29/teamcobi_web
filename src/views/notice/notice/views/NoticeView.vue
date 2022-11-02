<template>
  <v-card class="pa-4">
    <v-card-title class="font-weight-bold">공지사항 상세</v-card-title>
    <v-card-text>
      <v-text-field 
        v-model="formData.title" 
        label="제목" 
        readonly
        />
      <v-textarea 
        v-model="formData.content" 
        label="내용"
        readonly
        >
      </v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn dark absolute right @click="goList">이전으로</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'NoticeDetail',
  data() {
    return {
      formData: {
        title: null,
        content: null,
      },

      modalConfirm: {
        id: '',
        visible: false,
        title: '',
        message: '',
        // saveButton: false,
        // deleteButton: false,
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
      const apiUrl = `/notice/${this._id}`
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
    async saveNotice() {
      const data = this.formData
      const apiUrl = `/notice/${this._id}`
      await this.$axios
        .put(apiUrl, data)
        .then(({ status }) => {
          if (status === 200) {
            // this.showSnackbar('등록 완료')
            this.goList()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async deleteNotice() {
      const apiUrl = `/notice/${this._id}`
      await this.$axios
        .delete(apiUrl)
        .then(({ status }) => {
          if (status === 200) {
            // this.showSnackbar('등록 완료')
            this.goList()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    goList() {
      this.$router.go(-1)
    },
  },
}
// heool
</script>

<style></style>
