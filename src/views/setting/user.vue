<template>
  <el-container style="min-height:95vh">
    <el-main>
      <h1>user</h1>
      <el-button type="primary">主要按钮</el-button>
    </el-main>

  </el-container>


</template>
<script>
export default {
  name: 'user',
  methods: {
    reload() {
      this.$router.push({ path: '/setting/user', query: {
        t: +new Date() // 保证每次点击路由的query项都是不一样的，确保会重新刷新view
      }})
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
