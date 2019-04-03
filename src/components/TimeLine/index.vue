<template>
  <div>
    <div style="padding: 10px 0px 0px 10px;"><el-button size="small" @click='diffDetail' v-if="diffData !==null && diffData.length!==0">改动详情</el-button></div>
    <el-dialog
      title="Api 改动日志"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <span>注： 绿色代表新增内容，红色代表删除内容</span>
      <div v-for="(item,index) in diffMsgs" :key="index">
        <h3>{{item.title}}</h3>
        <div v-html="item.content"></div>
      </div>

    </el-dialog>
  </div>

</template>

<script>
import { diffView } from '@/utils/diffView'
const jsondiffpatch = require('jsondiffpatch/public/build/jsondiffpatch-full.js')
const formattersHtml = require('jsondiffpatch/public/build/jsondiffpatch-formatters.js').html
import 'jsondiffpatch/public/formatters-styles/annotated.css'
import 'jsondiffpatch/public/formatters-styles/html.css'

export default {
  name: 'TimeLine',
  props: ['diffData'],
  data() {
    return {
      diffMsgs: [],
      dialogVisible: false
    }
  },
  created() {
    this.diffMsgs = diffView(jsondiffpatch, formattersHtml, this.diffData)
  },
  methods: {
    diffDetail() {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>

</style>
