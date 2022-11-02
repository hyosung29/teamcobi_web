<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">항목</th>
          <th class="text-left">정보</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in userInfo" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.value }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      userInfo: [
        {
          name: 'Frozen Yogurt',
          value: 159,
        },
      ],
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    async fetchList(id) {
      this.loading = true
      console.log(id)
    },
  },
}
</script>
