<template>
  <v-card class="pa-4">
    <v-card-title class="font-weight-bold">공지사항 등록</v-card-title>
    <v-card-text>
      <v-text-field v-model="formData.title" label="제목" />
      <v-textarea v-model="formData.content" label="내용"></v-textarea>
    </v-card-text>
    <v-card-actions
      ><v-btn color="primary" @click="saveNotice">저장</v-btn>
      <v-btn dark absolute right @click="goList">목록으로</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'NoticeCreate',
  data() {
    return {
      formData: {
        title: null,
        content: null,
      },
    }
  },
  methods: {
    async saveNotice() {
      const data = this.formData
      const apiUrl = `/notice`
      await this.$axios
        .post(apiUrl, data)
        .then(({ status }) => {
          if (status === 200) {
            this.showSnackbar('등록 완료', 'success')
            this.goList()
          }
        })
        .catch((error) => {
          console.log(error)
            this.showSnackbar('등록 실패', 'error')
        })
      // this.showSnackbar(error.response.data.message, 'error')
    },
    goList() {
      this.$router.go(-1)
    },
    showSnackbar(message, color) {
      const snackbar = {
        show: true,
        message,
        color
      }
      this.$store.dispatch('showSnackbar', snackbar)
    }
  },
}
</script>

<style></style>
