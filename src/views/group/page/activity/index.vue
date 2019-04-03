<template>
<el-container>
  <el-header></el-header>
  <activity type="project" :dataId="$route.params.id"></activity>
</el-container>
</template>

<script>
import Activity from '@/components/Activity'
export default {
  name: 'activityLiat',
  components: {
    Activity
  }

}
</script>

