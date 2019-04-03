<template>
<el-container>
  <el-main>
    <el-row>
      <el-col :span="2">
        <el-menu
          default-active="1"
          :router="true"
          class="el-menu-vertical">
          <el-menu-item index="1" :route="{name:'advSettingIndex'}">
            <span slot="title">概述</span>
          </el-menu-item>
          <el-menu-item index="2" :route="{name:'advSettingSecrets'}" v-if="$store.getters.roles.is_admin === 1">
            <span slot="title">秘钥</span>
          </el-menu-item>
          <el-menu-item index="4" :route="{name:'AppList'}" v-if="$store.getters.roles.is_admin === 1">
            <span slot="title">App配置</span>
          </el-menu-item>
          <el-menu-item index="6" :route="{name:'WafRules'}" v-if="$store.getters.roles.is_admin === 1">
            <span slot="title">防火墙规则</span>
          </el-menu-item>
          <el-menu-item index="7" :route="{name:'trafficControl'}">
            <span slot="title">流量控制</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="22">
        <router-view></router-view>
      </el-col>
    </el-row>
  </el-main>

</el-container>
</template>

<script>
  export default {
    name: 'advSttingMain'
  }
</script>

<style scoped>

</style>
