<template>
  <el-container >
    <router-link class="inlineBlock" :to="{name:'groupCache', params: {env: env, type: 'projects'}}">
      <el-tag>项目</el-tag>
    </router-link>
    <router-link class="inlineBlock" :to="{name:'groupCache', params: {env: env, type: 'routes'}}">
      <el-tag>路由</el-tag>
    </router-link>
    <el-main>
      <!--<editor ref="editor" v-model="value" :readOnly="true"></editor>-->
    </el-main>

  </el-container>

    <!--<el-tab-pane label="项目" name="projects" @click="/test/routes">-->
      <!--<editor ref="editor" v-model="value"></editor>-->
    <!--</el-tab-pane>-->
    <!--<el-tab-pane label="路由" name="routes">-->
      <!--&lt;!&ndash;<editor ref="editor2" v-model="value" :readOnly="true"></editor>&ndash;&gt;-->
    <!--</el-tab-pane>-->

</template>

<script>
import editor from '@/components/Editor'
import { getCache } from '@/api/cache'
export default {
  name: 'projectShow',
  components: {
    editor
  },
  created() {
    console.log(this.$route.params.env)
    this.getJsonCache()
  },
  watch: {
    $route(route) {
      this.getJsonCache()
    }
  },
  methods: {
    getJsonCache() {
      // let project = this.$route.params.id
      // this.getJsonCache(this.$route.params.env, this.$route.params.type)
      getCache(this.projectId, this.$route.params.env, this.$route.params.type).then(response => {
        // this.json = response
        // this.json = JSON.parse(jsonData)
        console.log(this.json)
        this.value = response
      })
    }
  },
  data() {
    return {
      projectId: this.$route.params.id,
      env: this.$route.params.env,
      type: this.$route.params.type,
      value: {}
    }
  }

}
</script>

<style scoped>

</style>
