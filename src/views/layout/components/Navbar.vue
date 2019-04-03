<template>
  <el-menu class="navbar" mode="horizontal">
    <logo class="logo">
      <img :src="logo" style="height: 50px;padding: 5px"/>
    </logo>
    <breadcrumb></breadcrumb>
    <div class="api-tootlp">
      <el-row>
        <el-dropdown>
          <el-button type="primary" icon="el-icon-plus" circle></el-button>
          <el-dropdown-menu slot="dropdown">
            <router-link :to="{name:'AddZone'}">
              <el-dropdown-item>添加分组</el-dropdown-item>
            </router-link>

          </el-dropdown-menu>
        </el-dropdown>

        <el-button type="success" icon="el-icon-question" circle @click="help"></el-button>
        <router-link :to="{name:'advSetting'}">
          <el-button type="info" icon="el-icon-setting" circle style="margin-left:0"></el-button>
        </router-link>
      </el-row>
    </div>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" :src="avatar">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            Home
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">LogOut</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Logo from '@/components/Logo'

export default {
  components: {
    Breadcrumb,
    Logo
  },
  computed: {
    ...mapGetters([
      'avatar',
      'logo'
    ])
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    help() {
      window.open('https://git.100tal.com/kaomanfen_open_source/api-gateway/wikis/Quick-Start')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .logo {
    line-height: 50px;
    height: 50px;
    float: left;
    padding: 0 10px;
    margin: 0 0 0 20px;
  }
  .api-tootlp{
    float: right;
    position: relative;
    right: 100px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }


    }
  }
}
</style>

