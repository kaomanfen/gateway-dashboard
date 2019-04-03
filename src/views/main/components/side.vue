<template>
  <el-container  v-loading="loading"
  >
    <el-header style="height:200px;padding:0">
      <el-card class="box-card" style="height:100%">
        <div  class="text item">
          <h2>{{ item.name }}</h2>
          <div class="mark">
            简介：<span>{{ item.description }}</span>
          </div>
          <div class="search">
            <el-input v-model="search" placeholder="请输入搜索内容" @input='searching'></el-input>
          </div>
        </div>

      </el-card>
    </el-header>
    <el-main style="max-height:72vh;padding:0" class="side" >
      <el-menu
        :default-active = active
        style="height:100%;width:100%"
        @select="handleSelect"
      >
        <template v-for="(menu,index) in showmenus" >
          <el-menu-item  :key="index" :index="String(index)" class="side-menu-item">
            <i class="el-icon-menu" ></i>
            <span slot="title">{{ menu.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-main>
  </el-container>
</template>
<script>
  import { getGroups } from '@/api/group'
  import { baseSearch, firstObj } from '@/utils/object'
  export default {
    name: 'side',
    props: ['pid'],
    data() {
      return {
        menus: null,
        showmenus: null,
        active: null,
        item: {
          name: '',
          description: ''
        },
        search: '',
        loading: true
      }
    },
    created() {
      const zoneId = this.$route.params.zoneId
      this.fetchData(zoneId)
    },
    watch: {
      $route() {
        const zoneId = this.$route.params.zoneId
        this.fetchData(zoneId)
      }
    },
    methods: {
      fetchData(zoneId) {
        getGroups().then(response => {
          this.menus = response
          this.showmenus = this.menus
          this.loading = false
          this.initSelect(zoneId)
        })
      },
      initSelect(id) {
        if (id) {
          const data = this.menus[id]
          this.active = id
          this.item.name = data.name
          if (data.description) {
            this.item.description = data.description
          } else {
            this.item.description = ''
          }
        } else {
          if (this.active === null) {
            if (this.menus === null) {
              return true
            }
            const data = firstObj(this.menus)
            this.active = Object.keys(data)[0]
            const elem = Object.values(data)[0]
            this.$store.dispatch('selectedSidebar', elem)
            this.$router.push({ name: 'Zone', params: { zoneId: this.active }})
            this.item.name = elem.name
            if (elem.description) {
              this.item.description = elem.description
            } else {
              this.item.description = ''
            }
          }
        }
      },
      handleSelect(key, keyPath) {
        this.item.name = this.menus[key].name
        this.$store.dispatch('selectedSidebar', this.menus[key])
        if (this.menus[key].description) {
          this.item.description = this.menus[key].description
        } else {
          this.item.description = ''
        }
        this.$router.push({ name: 'Zone', params: { zoneId: key }})
      },
      searching(value) {
        this.showmenus = baseSearch(this.menus, 'name', value)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mark{
    position: relative;
    height: 35px;
    overflow: hidden;
  }
  .search{
    margin: 15px;
  }
  .goto{
    position: absolute;
    display:none;
    right: 10px;
    top: 13.5px;
  }
  .side-menu-item:hover .goto{
    display:inline;
  }
  .box-card .item{
    position: relative;
  }
  .addObj{
    position: absolute;
    top:0;
    right:15px;
  }
  /* for Chrome */
  .side::-webkit-scrollbar {
    display: none;
  }
</style>

