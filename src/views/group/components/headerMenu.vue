<template>
  <el-menu
    :default-active="defaultActive"
    class="el-menu-group"
    mode="horizontal"
    background-color="#4895ea"
    text-color="#fff"
    active-text-color="#fff" router>

      <el-menu-item index="groupApi" :route="{name:'groupApi'}">接口</el-menu-item>
      <el-menu-item index="groupActivity" :route="{name:'groupActivity'}" v-if="permissionStatus.groupActivity">动态</el-menu-item>
      <el-menu-item index="groupUser" :route="{name:'groupUser'}">成员</el-menu-item>
      <el-menu-item index="groupSetting" :route="{name:'groupSetting'}" v-if="permissionStatus.groupSetting">设置</el-menu-item>
      <el-menu-item index="groupCache" :route="{name:'groupCache'}">缓存</el-menu-item>
  </el-menu>
</template>
<script>
  import { componentCheck } from '@/utils/permission'
  export default {
    name: 'headerMenu',
    props: ['id'],
    data() {
      return {
        path: '/group/' + this.id,
        permissionStatus: {
          groupActivity: false,
          groupSetting: false
        },
        project: '',
        defaultActive: ''

      }
    },
    created() {
      this.defaultActive = this.$route.name
    },
    mounted() {
      this.permissionCheck()
      this.groupSetBackendName()
    },
    watch: {
      route() {
        this.permissionCheck()
        this.groupSetBackendName()
        this.defaultActive = this.$route.name
      }
    },
    methods: {
      permissionCheck() {
        this.permissionStatus.groupActivity = componentCheck(this.$route, 'groupActivity')
        this.permissionStatus.groupSetting = componentCheck(this.$route, 'groupSetting')
      },
      groupSetBackendName() {
        this.project = this.$store.getters.app.selected.backend_name
      }
    }
  }
</script>
