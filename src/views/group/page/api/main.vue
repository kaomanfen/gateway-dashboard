<template>
  <el-container style="min-height:90vh">
    <el-aside style="margin:20px">
      <side ref="side"></side>
    </el-aside>
    <el-main style="padding-left: 0">
      <router-view :key="key"></router-view>
    </el-main>
  </el-container>
</template>

<script>
import Side from '../../components/side'
export default {
  name: 'apiIndex',
  components: {
    Side
  },
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
