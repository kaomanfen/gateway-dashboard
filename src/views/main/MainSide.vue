<template>
  <el-container style="min-height:95vh">
    <el-aside style="margin:20px">
        <side :pid=pid></side>
    </el-aside>
     <el-main>
       <router-view></router-view>
      </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Side from './components/side'
export default {
  name: 'mainSide',
  components: {
    Side
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'pid'
    ])
  }

}
</script>
