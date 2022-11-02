<template>
  <v-container fluid>
    <v-scroll-y-transition mode="out-in">
      <router-view></router-view>
    </v-scroll-y-transition>
  </v-container>
</template>

<script>
export default {
  name: 'EmployeeLayout',
  data() {
    return {}
  },
  methods: {},
}
</script>

<style></style>
