<template>
  <el-container >
    <el-main class="object-main">
      <el-card class="box-card" style="min-height:90vh">
        <div slot="header" class="clearfix">
          <span><b>添加项目</b></span>
        </div>
        <el-row :gutter="24">
          <el-col :span="12" :offset="6">
            <el-steps :active="active" finish-status="success" simple>
              <el-step title="基本信息"></el-step>
              <el-step title="配置环境"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
            <keep-alive>
             <router-view></router-view>
            </keep-alive>

          </el-col>
        </el-row>


      </el-card>

    </el-main>

  </el-container>
</template>
<script>
  export default {
    name: 'objectMain',
    data() {
      return {
        active: 0

      }
    },
    mounted() {
      this.setActive()
    },
    watch: {
      $route() {
        this.setActive()
      }
    },
    methods: {
      setActive() {
        this.active = this.$store.state.object.active
      }
    }
  }
</script>
<style  lang="scss" scoped>
.object-main{
  padding-top: 0;
}
.box-card .hgx{
  border-bottom: .5px dashed #dee5e7;
  margin-top: 0;
  margin-bottom: 20px
}
</style>
