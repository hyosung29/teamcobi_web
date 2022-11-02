<template>
  <v-container class="mt-16 text-align-center" fluid>
    <v-card class="pa-10" width="700px" :img="toggleSwitch ? _img : ''">
      <v-card-title class="pl-0">
        <v-img
          class="mr-2"
          max-width="32px"
          max-height="32px"
          :src="_logo"
          @click="toggleSwitch = !toggleSwitch"
        />
        COBI ERP 로그인
      </v-card-title>
      <v-form ref="form" lazy-validation>
        <v-text-field
          v-model="form.employeeNumber"
          counter="8"
          :rules="idRules"
          label="사원번호"
          required
        />

        <v-text-field
          v-model="form.password"
          :rules="passwordRules"
          type="password"
          label="비밀번호"
          required
        />
      </v-form>
      <v-card-actions>
        <v-btn @click="login">로그인</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      valid: true,
      show: false,
      idRules: [(v) => !!v || '아이디를 입력해주세요!'],
      passwordRules: [(v) => !!v || '비밀번호를 입력해주세요!'],
      form: {
        employeeNumber: '',
        password: '',
      },
      toggleSwitch: false,
      // img: () => require('@/assets/img/gugugugu.gif'),
    }
  },
  computed: {
    _img() {
      return require('@/assets/img/img.gif')
    },
    _logo() {
      return require('@/assets/cobiLogo2.png')
    },
  },
  methods: {
    async login() {
      const validate = this.$refs.form.validate()
      if (!validate) return
      const formData = new FormData()
      formData.append('employeeNumber', this.form.employeeNumber)
      formData.append('password', this.form.password)
      this.$store.dispatch('login', formData)
    },
  },
}
</script>

<style lang="scss" scoped>
.text-align-center {
  text-align: -webkit-center;
}
</style>
